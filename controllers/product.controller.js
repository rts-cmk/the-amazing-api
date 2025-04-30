import { z } from "zod"
import { generateSlug } from "../lib/generate-slug.js"
import { getNavLinks } from "../lib/nav-links.js"
import prisma from "../config/prisma.js"

export async function createProduct(request, response, next) {
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
		stock: z.number().positive().optional()
	})

	const validated = schema.safeParse({
		name: request.fields.name,
		description: request.fields.description,
		sku: request.fields.sku,
		price: parseFloat(request.fields.price),
		saleprice: parseFloat(request.fields.saleprice),
		weight: parseFloat(request.fields.weight),
		height: parseFloat(request.fields.height),
		width: parseFloat(request.fields.width),
		length: parseFloat(request.fields.length),
		stock: parseInt(request.fields.stock)
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
				weight: parseFloat(validated.data.weight),
				height: parseFloat(validated.data.height),
				width: parseFloat(validated.data.width),
				length: parseFloat(validated.data.length),
				stock: parseInt(validated.data.stock)
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

export default function deleteProduct(request, response, next) {
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
