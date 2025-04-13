import { z } from "zod"
import { generateSlug } from "../lib/generate-slug.js"
import { getNavLinks } from "../lib/nav-links.js"
import prisma from "../config/prisma.js"

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
		const results = products.map(product => ({ name: product.name, url: `${url}/${product.slug}` }))
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
	console.log("hooray")
	try {
		const product = await prisma.product.findUnique({ where: { slug: request.params.slug } })

		if (!product) return response.status(404).end()

		response.json(product)
	} catch (error) {
		console.error(error)
		response.status(500).end()
	}
}

export async function createProduct(request, response, next) {
	const schema = z.object({
		name: z.string().min(1),
		description: z.string().min(1),
		price: z.number()
	})

	const validated = schema.safeParse({
		name: request.fields.name,
		description: request.fields.description,
		price: parseFloat(request.fields.price)
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
				description: validated.data.description,
				price: validated.data.price,
			}
		})
		response.status(201).json(product)
	} catch (error) {
		console.error(error)
		response.status(500).end()
	}
}
