export function checkAllowedContentType(request, response, next) {
	const contentType = request.headers["content-type"]

	const allowedContentTypes = [
		"application/json",
		"application/x-www-form-urlencoded",
		"multipart/form-data",
	]

	if (!allowedContentTypes.some((type) => contentType.includes(type))) {
		return response.status(415).json({
			error: "Unsupported Media Type",
			"supported-types": allowedContentTypes,
		})
	}
	next()
}
