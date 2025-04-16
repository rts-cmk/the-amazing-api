import * as jose from "jose"

export async function isAuthenticated(request, response, next) {
	if (!request.headers.authorization) {
		return response.status(401).end()
	}

	const authHeader = request.headers.authorization.split(" ")
	const token = authHeader[1]

	try {
		const secret = jose.base64url.decode("cc7e0d44fd473002f1c42167459001140ec6389asd3")
		const { payload } = await jose.jwtDecrypt(token, secret)
		response.locals.user = payload.user
		return next()
	} catch (error) {
		console.error(error)
		return response.status(401).end()
	}
}
