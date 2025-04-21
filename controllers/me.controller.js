import prisma from "../config/prisma.js"

export async function getMe(request, response, next) {
	try {
		const user = await prisma.user.findUnique({
			where: {
				id: response.locals.user,
			},
			select: {
				email: true,
				role: true,
				createdAt: true,
				updatedAt: true,
			},
		})

		if (!user) {
			return response.status(404).end()
		}

		return response.json(user)

	} catch (error) {
		console.error(error)
		response.status(500).end()
	}
}
