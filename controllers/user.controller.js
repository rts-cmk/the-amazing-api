import { z } from "zod"
import prisma from "../config/prisma.js"
import { getNavLinks } from "../lib/nav-links.js"

export async function createUser(request, response, next) {
	const schema = z.object({
		email: z.string().email(),
		password: z.string().min(1),
		name: z.string().min(1).optional(),
	})

	const validated = schema.safeParse({
		email: request.body.email,
		password: request.body.password,
		name: request.body.name,
	})

	if (!validated.success) {
		return response.status(400).json({
			...validated.error.format()
		})
	}

	try {
		const user = await prisma.user.create({
			data: {
				email: validated.data.email,
				password: validated.data.password,
				name: validated.data.name,
			},
			select: {
				email: true,
				role: true,
				name: true,
				createdAt: true,
			}
		})
		response.status(201).json(user)
	} catch (error) {
		console.error(error)
		response.status(500).end()
	}
}

export async function getAllUsers(request, response, next) {
	const url = request.protocol + "://" + request.host + request.path
	const limit = Number(request.query.limit) || 10
	const offset = Number(request.query.offset) || 0
	const search = request.query.search

	const whereClause = search ? {
		OR: [
			{ email: { contains: search } },
			{ role: { contains: search } },
			{ name: { contains: search } }
		]
	} : {}
	try {
		const [users, count] = await Promise.all([
			prisma.user.findMany({ select: { email: true }, where: whereClause, take: limit, skip: offset }),
			prisma.user.count({ select: { id: true }, where: whereClause })
		])
		const { next, prev } = getNavLinks({ count: count.id, limit, offset, url })
		const results = users.map(user => ({ email: user.email, url: `${url}/${user.email}` }))
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

export async function getUserByEmail(request, response, next) {
	try {
		const user = await prisma.user.findUnique({
			select: {
				email: true,
				role: true,
				name: true,
				createdAt: true,
				updatedAt: true,
				refreshTokens: true,
			},
			where: {
				email: request.params.email
			}
		})
		if (!user) return response.status(404).end()
		response.json(user)
	} catch (error) {
		console.error(error)
		response.status(500).end()
	}
}

export async function updateUserByEmail(request, response, next) {
	const schema = z.object({
		email: z.string().email().optional(),
		password: z.string().min(1).optional(),
		name: z.string().min(1).optional(),
		role: z.enum(["USER", "EDITOR", "ADMIN"]).optional(),
	})

	const validated = schema.safeParse({
		email: request.body.email,
		password: request.body.password,
		name: request.body.name,
		role: request.body.role,
	})

	if (!validated.success) {
		return response.status(400).json({
			...validated.error.format()
		})
	}

	const data = {}
	if (validated.data.email) data.email = validated.data.email
	if (validated.data.password) data.password = validated.data.password
	if (validated.data.name) data.name = validated.data.name
	if (validated.data.role && response.locals.role === "ADMIN") data.role = validated.data.role

	try {
		const user = await prisma.user.update({
			where: { email: request.params.email },
			data,
			select: { email: true, role: true, name: true, createdAt: true, updatedAt: true }
		})
		response.json(user)
	} catch (error) {
		console.error(error)
		response.status(500).end()
	}
}

export async function deleteUserByEmail(request, response, next) {
	try {
		await prisma.user.delete({ where: { email: request.params.email } })
		response.status(204).end()
	} catch (error) {
		console.error(error)
		response.status(500).end()
	}
}
