import { z } from "zod"
import { hashSync } from "bcrypt"
import prisma from "../config/prisma.js"

export async function createUser(request, response, next) {
	const schema = z.object({
		email: z.string().email(),
		password: z.string().min(1),
	})

	const validated = schema.safeParse({
		email: request.body.email,
		password: request.body.password,
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
				password: hashSync(validated.data.password, 11)
			}
		})
		response.status(201).json(user)
	} catch (error) {
		console.error(error)
		response.status(500).end()
	}
}
