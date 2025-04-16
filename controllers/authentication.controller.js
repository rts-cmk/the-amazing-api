import { z } from "zod"
import prisma from "../config/prisma.js"
import { compareSync } from "bcrypt"
import { EncryptJWT, base64url } from "jose"

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
		const user = await prisma.user.findUnique({ where: { email: validated.data.email } })
		if (!user) return response.status(401).end()

		const verified = compareSync(validated.data.password, user.password)

		if (!verified) return response.status(401).end()

		const secret = base64url.decode("cc7e0d44fd473002f1c42167459001140ec6389asd3")

		const token = await new EncryptJWT({
			user: user.email
		})
			.setProtectedHeader({ alg: "dir", enc: "A256GCM" })
			.setIssuedAt()
			.setExpirationTime("1D")
			.encrypt(secret)

		response.status(201).json({
			token
		})
	} catch (error) {
		console.error(error)
		response.status(500).end()
	}
}
