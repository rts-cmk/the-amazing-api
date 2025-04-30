import deleteProduct, { getAllProducts, createProduct, getProductBySlug } from "../controllers/product.controller.js"
import { isAuthenticated, isEditorOrAdmin } from "../middleware/auth.middleware.js"

export default function (router) {
	router.post("/api/v1/products", isAuthenticated, isEditorOrAdmin, createProduct)
	router.get("/api/v1/products", getAllProducts)
	router.get("/api/v1/products/:slug", getProductBySlug)
	router.delete("/api/v1/products/:slug", isAuthenticated, isEditorOrAdmin, deleteProduct)
}
