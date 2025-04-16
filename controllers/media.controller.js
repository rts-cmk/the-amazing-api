import { z } from "zod"
import { IMAGE_SCHEMA } from "../lib/schemas.js"
import prisma from "../config/prisma.js"
import { IncomingForm } from "formidable"
import path from "path"
import fs from "fs"
import sharp from "sharp"
import { getNavLinks } from "../lib/nav-links.js"

const UPLOAD_DIR = path.join(process.cwd(), 'usermedia')
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true })
}

export async function createMedia(request, response, next) {
	const form = new IncomingForm({
    uploadDir: UPLOAD_DIR,
    keepExtensions: true,
    filename: (name, ext, part) => {
      const base = path.basename(part.originalFilename, ext)
      const clean = base.replace(/\s+/g, "_")
      const finalName = `${clean}-${Date.now()}${ext}`
      return finalName
    }
  })

	const schema = z.object({
		name: z.string().min(1),
		description: z.string().min(1),
		file: IMAGE_SCHEMA,
		width: z.number(),
		height: z.number(),
	})

	form.parse(request, async (err, fields, files) => {
		if (err) {
			console.error(err)
			return response.status(500).end()
		}

		const image = sharp(files.file[0].filepath)
		const metadata = await image.metadata()

		const validated = schema.safeParse({
			name: fields.name[0],
			description: fields.description[0],
			file: files.file[0],
			width: metadata.width,
			height: metadata.height
		})

		console.log("validated", validated)

		if (!validated.success) {
			return response.status(400).json({
				...validated.error.format()
			})
		}

		const type = getMediaType(validated.data.file.mimetype)
		const width = type === "IMAGE" ? validated.data.file.width : null
		const height = type === "IMAGE" ? validated.data.file.height : null
	
		try {
			const media = await prisma.media.create({
				data: {
					name: validated.data.name,
					description: validated.data.description,
					type,
					mimetype: validated.data.file.mimetype,
					width: validated.data.width,
					height: validated.data.height,
					size: validated.data.file.size,
					filename: validated.data.file.newFilename,
					originalFilename: validated.data.file.originalFilename,
					url: "http://localhost:4000/media/" + validated.data.file.newFilename,
				}
			})

			response.status(201).json(media)
		} catch (error) {
			console.error(error)
			response.status(500).end()
		}
	})
}

export async function getSingleMedia(request, response, next) {
	try {
		const media = await prisma.media.findUnique({ where: { id: request.params.id } })
		response.json(media)
	} catch (error) {
		console.error(error)
		response.status(500).end()
	}
}

export async function getMediaFile(request, response, next) {
	const filename = request.params.filename
	const filepath = path.join(UPLOAD_DIR, filename)

	response.status(200).sendFile(filepath)
}

export async function getAllMedia(request, response, next) {
	const url = request.protocol + "://" + request.host + request.path
	const limit = Number(request.query.limit) || 10
	const offset = Number(request.query.offset) || 0
	const search = request.query.search

	const whereClause = search ? {
		OR: [
			{ name: { contains: search } },
			{ description: { contains: search } }
		]
	} : {}

	try {
		const [media, count] = await Promise.all([
			prisma.media.findMany({ select: { name: true, id: true }, where: whereClause, take: limit, skip: offset }),
			prisma.media.count({
				select: { id: true }, where: whereClause
			})
		])
		const { next, prev } = getNavLinks({ count: count.id, limit, offset, url })
		const results = media.map(m => ({ name: m.name, url: `${url}/${m.id}` }))
		response.json({
			count: count.id,
			next,
			prev,
			results
		})
	} catch (error) {
		console.error(error)
		response.status(500).end()
	}
}

function getMediaType(mime) {
  if (!mime) return 'OTHER'
  if (mime.startsWith('image/')) return 'IMAGE'
  if (mime.startsWith('video/')) return 'VIDEO'
  if (mime.startsWith('audio/')) return 'AUDIO'
  if (mime.includes('pdf') || mime.includes('ms') || mime.includes('word')) return 'DOCUMENT'
  return 'OTHER'
}
