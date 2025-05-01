import { z } from "zod"
import { generateSlug } from "../lib/generate-slug.js"
import { getNavLinks } from "../lib/nav-links.js"
import prisma from "../config/prisma.js"

export async function createProduct(request, response, next) {
	const contentType = request.headers["content-type"]
	const fieldOrBody = contentType.includes("multipart/form-data") ? request.fields : request.body

	const schema = z.object({
		name: z.string().min(1),
		description: z.string().min(1),
		sku: z.string().min(1),
		price: z.number(),
		saleprice: z.number().optional(),
		weight: z.number().optional(),
		height: z.number().optional(),
		width: z.number().optional(),
		length: z.number().optional(),
		stock: z.number().positive().optional(),
		media: z.array(z.object({
			id: z.string().min(1),
		})).optional()
	})

	const validated = schema.safeParse({
		name: fieldOrBody.name,
		description: fieldOrBody.description,
		sku: fieldOrBody.sku,
		price: fieldOrBody.price ? parseFloat(fieldOrBody.price) : undefined,
		saleprice: fieldOrBody.saleprice ? parseFloat(fieldOrBody.saleprice) : undefined,
		weight: fieldOrBody.weight ? parseFloat(fieldOrBody.weight) : undefined,
		height: fieldOrBody.height ? parseFloat(fieldOrBody.height) : undefined,
		width: fieldOrBody.width ? parseFloat(fieldOrBody.width) : undefined,
		length: fieldOrBody.length ? parseFloat(fieldOrBody.length) : undefined,
		stock: fieldOrBody.stock ? parseInt(fieldOrBody.stock) : undefined,
		media: fieldOrBody.media ? fieldOrBody.media.map(media => ({ id: media.id })) : undefined
	})

	if (!validated.success) {
		return response.status(400).json({
			...validated.error.format()
		})
	}

	try {
		const product = await prisma.product.create({
			data: {
				name: validated.data.name,
				slug: generateSlug(validated.data.name),
				sku: validated.data.sku,
				description: validated.data.description,
				price: validated.data.price,
				saleprice: validated.data.saleprice >= 0 ? validated.data.saleprice : undefined,
				weight: parseFloat(validated.data.weight),
				height: parseFloat(validated.data.height),
				width: parseFloat(validated.data.width),
				length: parseFloat(validated.data.length),
				stock: parseInt(validated.data.stock),
				media: {
					connect: validated.data.media ? validated.data.media.map(media => ({ id: media.id })) : undefined
				},
			},
			include: {
				media: true
			}
		})
		response.status(201).json(product)
	} catch (error) {
		console.error(error)
		response.status(500).end()
	}
}

export async function getAllProducts(request, response, next) {
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
		const [products, count] = await Promise.all([
			prisma.product.findMany({ select: { name: true, slug: true }, where: whereClause, take: limit, skip: offset }),
			prisma.product.count({
				select: { id: true }, where: whereClause
			})
		])
		const { next, prev } = getNavLinks({ count: count.id, limit, offset, url })
		const results = products.map(product => ({ name: product.name, slug: product.slug, url: `${url}/${product.slug}` }))
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

export async function getProductBySlug(request, response, next) {
	try {
		const product = await prisma.product.findUnique({
			where: {
				slug: request.params.slug
			},
			include: {
				media: true
			}
		})

		if (!product) return response.status(404).end()

		response.json(product)
	} catch (error) {
		console.error(error)
		response.status(500).end()
	}
}

export async function updateProduct(request, response, next) {
	const contentType = request.headers["content-type"]
	const fieldOrBody = contentType.includes("multipart/form-data") ? request.fields : request.body

	const schema = z.object({
		name: z.string().min(1).optional(),
		description: z.string().min(1).optional(),
		sku: z.string().min(1).optional(),
		price: z.number().optional(),
		saleprice: z.number().optional(),
		weight: z.number().optional(),
		height: z.number().optional(),
		width: z.number().optional(),
		length: z.number().optional(),
		stock: z.number().positive().optional(),
		published: z.boolean().optional(),
		media: z.array(z.object({
			id: z.string().min(1),
		})).optional(),
		slug: z.string().min(1)
	})

	const validated = schema.safeParse({
		name: fieldOrBody.name,
		description: fieldOrBody.description,
		sku: fieldOrBody.sku,
		price: fieldOrBody.price ? parseFloat(fieldOrBody.price) : undefined,
		saleprice: fieldOrBody.saleprice ? parseFloat(fieldOrBody.saleprice) : undefined,
		weight: fieldOrBody.weight ? parseFloat(fieldOrBody.weight) : undefined,
		height: fieldOrBody.height ? parseFloat(fieldOrBody.height) : undefined,
		width: fieldOrBody.width ? parseFloat(fieldOrBody.width) : undefined,
		length: fieldOrBody.length ? parseFloat(fieldOrBody.length) : undefined,
		stock: fieldOrBody.stock ? parseInt(fieldOrBody.stock) : undefined,
		published: fieldOrBody.published == "true",
		media: fieldOrBody.media ? fieldOrBody.media.map(media => ({ id: media.id })) : undefined,
		slug: request.params.slug
	})

	if (!validated.success) {
		return response.status(400).json({
			...validated.error.format()
		})
	}

	const data = {}

	if (validated.data.name) data.name = validated.data.name
	if (validated.data.name) data.slug = generateSlug(validated.data.name)
	if (validated.data.description) data.description = validated.data.description
	if (validated.data.sku) data.sku = validated.data.sku
	if (validated.data.price) data.price = validated.data.price
	if (validated.data.saleprice >= 0) data.saleprice = validated.data.saleprice
	if (validated.data.weight) data.weight = validated.data.weight
	if (validated.data.height) data.height = validated.data.height
	if (validated.data.width) data.width = validated.data.width
	if (validated.data.length) data.length = validated.data.length
	if (validated.data.stock) data.stock = validated.data.stock
	if (validated.data.published === false || validated.data.published === true) data.published = validated.data.published
	if (validated.data.media) data.media = {
		connect: validated.data.media.map(media => ({ id: media.id }))
	}

	try {
		const product = await prisma.product.update({
			where: {
				slug: validated.data.slug,
			},
			data,
			include: {
				media: true
			}
		})
		if (!product) return response.status(404).end()
		response.json(product)
	} catch (error) {
		console.error(error)
		response.status(500).end()
	}
}

export function deleteProduct(request, response, next) {
	const schema = z.object({
		slug: z.string().min(1)
	})

	const validated = schema.safeParse({
		slug: request.params.slug
	})

	if (!validated.success) {
		return response.status(400).json({
			...validated.error.format()
		})
	}

	prisma.product.delete({
		where: {
			slug: validated.data.slug
		}
	}).then(() => {
		response.status(204).end()
	}).catch(error => {
		console.error(error)
		response.status(500).end()
	})
}
