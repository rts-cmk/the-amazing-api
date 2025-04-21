import { verifyAccessToken } from "../lib/tokens.js"

export async function isAuthenticated(request, response, next) {
	if (!request.headers.authorization) {
		return response.status(401).end()
	}

	const authHeader = request.headers.authorization.split(" ")
	const token = authHeader[1]

	try {
		const payload = await verifyAccessToken(token)
		response.locals.user = payload.sub
		response.locals.role = payload.role
		return next()
	} catch (error) {
		console.error(error)
		return response.status(401).end()
	}
}

export async function isAdmin(request, response, next) {
	if (response.locals.role !== "ADMIN") {
		return response.status(403).end()
	}
	return next()
}

export async function isEditor(request, response, next) {
	if (response.locals.role !== "EDITOR") {
		return response.status(403).end()
	}
	return next()
}

export async function isSelfOrAdmin(request, response, next) {
	if (response.locals.role !== "ADMIN" && response.locals.user !== request.params.email) {
		return response.status(403).end()
	}
	return next()
}
