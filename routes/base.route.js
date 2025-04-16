export default function (router) {
	router.get("/api/v1", function (request, response, next) {
		response.json({
			"me": "/api/v1/me",
			"media": "/api/v1/media",
			"products": "/api/v1/products",
			"users": "/api/v1/users",
		})
	})
}
