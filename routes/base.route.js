export default function (router) {
	router.get("/api/v1", function (request, response, next) {
		response.json({
			"home": "/api/v1",
			"products": "/api/v1/products",
			"me": "/api/v1/me"
		})
	})
}
