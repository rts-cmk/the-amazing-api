import { z } from "zod"
import { generateSlug } from "../lib/generate-slug.js"
import prisma from "../config/prisma.js"
import { getNavLinks } from "../lib/nav-links.js"

export async function createPost(request, response, next) {
	const schema = z.object({
		title: z.string().min(1),
		blocks: z.array(z.object({
			type: z.string().min(1),
			content: z.object({
				text: z.string().optional(),
				level: z.number().optional(),
				language: z.string().optional(),
				code: z.string().optional(),
				author: z.string().optional(),
				url: z.string().optional(),
				alt: z.string().optional(),
				caption: z.string().optional(),
				spans: z.array(z.object({
					text: z.string(),
					marks: z.array(
						z.union([
							z.string().optional(),
							z.object({
								type: z.string(),
								href: z.string().optional(),
								target: z.string().optional(),
								title: z.string().optional(),
								rel: z.string().optional()
							})
						])
					)
				})).optional()
			}),
			position: z.number().positive()
		}))
	})
	console.log("body", request.body)
	const validated = schema.safeParse({
		title: request.body.title,
		blocks: request.body.blocks
	})

	if (!validated.success) {
		return response.status(400).json({
			...validated.error.format()
		})
	}

	try {
		const post = await prisma.post.create({
			data: {
				title: validated.data.title,
				slug: generateSlug(validated.data.title),
				published: validated.data.published,
				author: {
					connect: {
						id: response.locals.user
					}
				},
				blocks: {
					create: validated.data.blocks
				}
			}
		})
		response.status(201).json(post)
	} catch (error) {
		console.error(error)
		response.status(500).end()
	}
}

export async function getAllPosts(request, response, next) {
	const url = request.protocol + "://" + request.host + request.path
	const limit = Number(request.query.limit) || 10
	const offset = Number(request.query.offset) || 0

	try {
		const [posts, count] = await Promise.all([
			prisma.post.findMany({
				where: {
					published: {
						not: null
					}
				}
			}),
			prisma.post.count({
				select: { id: true },
				where: {
					published: {
						not: null
					}
				}
			})
		])
		const { next, prev } = getNavLinks({ count: count.id, limit, offset, url })

		const results = posts.map(post => ({
			title: post.title,
			url: `${url}/${post.slug}`
		}))

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

export async function getSinglePost(request, response, next) {
	try {
		const post = await prisma.post.findUnique({
			where: {
				slug: request.params.slug
			},
			select: {
				id: true,
				title: true,
				slug: true,
				published: true,
				author: {
					select: {
						id: true,
						email: true,
						role: true
					}
				},
				blocks: {
					select: {
						id: true,
						type: true,
						content: true,
						position: true
					}
				}
			}
		})
		if (!post) return response.status(404).end()
		response.json(post)
	} catch (error) {
		console.error(error)
		response.status(500).end()
	}
}
