export async function getMe(request, response, next) {

	try {
		const user = await User.findOne({
			where: {
				$or: {
					username: validated.data.username,
					email: validated.data.username,
				}
			}
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
