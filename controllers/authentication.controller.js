import { z } from "zod"
import { compareSync } from "bcrypt"
import prisma from "../config/prisma.js"
import { generateAccessToken, generateRefreshToken } from "../lib/tokens.js"

export async function createToken(request, response, next) {
	const schema = z.object({
		email: z.string().email(),
		password: z.string().min(1),
	})

	const validated = schema.safeParse({
		email: request.body.email,
		password: request.body.password,
	})

	if (!validated.success) return response.status(400).json({
		...validated.error.format()
	})

	try {
		const user = await prisma.user.findUnique({ where: { email: validated.data.email }})
		if (!user) return response.status(401).end()

		const verified = compareSync(validated.data.password, user.password)

		if (!verified) return response.status(401).end()

		const accessToken = await generateAccessToken(user)
		const { token: refreshToken, expiresAt } = await generateRefreshToken()
		
		await prisma.refreshToken.create({
			data: {
				token: refreshToken,
				expiresAt,
				userId: user.id
			}
		})

		response.status(201).json({
			accessToken,
			refreshToken
		})
	} catch (error) {
		console.error(error)
		response.status(500).end()
	}
}

export async function refreshToken(request, response, next) {
	const schema = z.object({
		refreshToken: z.string().min(1)
	})

	const validated = schema.safeParse({
		refreshToken: request.body.refreshToken
	})

	if (!validated.success) return response.status(400).json({
		...validated.error.format()
	})

	try {
		const refreshToken = await prisma.refreshToken.findUnique({ where: { token: validated.data.refreshToken } })
		if (!refreshToken) return response.status(401).end()

		const user = await prisma.user.findUnique({ where: { id: refreshToken.userId } })
		if (!user) return response.status(401).end()

		const accessToken = await generateAccessToken(user)

		response.status(201).json({ accessToken })
	} catch (error) {
		console.error(error)
		response.status(500).end()
	}
}
