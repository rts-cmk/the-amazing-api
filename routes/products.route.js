import { getAllProducts, createProduct, getProductBySlug } from "../controllers/product.controller.js"

export default function (router) {
	router.post("/api/v1/products", createProduct)
	router.get("/api/v1/products", getAllProducts)
	router.get("/api/v1/products/:slug", getProductBySlug)
}
