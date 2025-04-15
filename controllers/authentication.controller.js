import { z } from "zod"
import prisma from "../config/prisma.js"
import { compareSync } from "bcrypt"
import { SignJWT } from "jose"

export async function createToken(request, response, next) {
	const schema = z.object({
		email: z.string().email(),
		password: z.string().min(1),
	})

	const validated = schema.safeParse({
		email: request.fields.email,
		password: request.fields.password,
	})

	if (!validated.success) return response.status(400).json({
		...validated.error.format()
	})

	try {
		const user = await prisma.user.findUnique({ where: { email: validated.data.email } })
		if (!user) return response.status(401).end()

		console.log(user)

		const verified = compareSync(validated.data.password, user.password)

		if (!verified) return response.status(401).end()

		const secret = new TextEncoder().encode(
			'cc7e0d44fd473002f1c42167459001140ec6389b7353f8088f4d9a95f2f596f2',
		)

		const token = await new SignJWT({
			user: user.email
		})
			.setProtectedHeader({ alg: "HS256" })
			.setIssuedAt()
			.setExpirationTime("1D")
			.sign(secret)

		response.status(201).json({
			token
		})
	} catch (error) {
		console.error(error)
		response.status(500).end()
	}
}
