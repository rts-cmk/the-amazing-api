import { getAllProducts, createProduct, getProductBySlug, updateProduct, deleteProduct } from "../controllers/product.controller.js"
import { isAuthenticated, isEditorOrAdmin } from "../middleware/auth.middleware.js"
import { checkAllowedContentType } from "../middleware/content-type.middleware.js"

export default function (router) {
	router.post("/api/v1/products", checkAllowedContentType, isAuthenticated, isEditorOrAdmin, createProduct)
	router.get("/api/v1/products", getAllProducts)
	router.get("/api/v1/products/:slug", getProductBySlug)
	router.patch("/api/v1/products/:slug", checkAllowedContentType, isAuthenticated, isEditorOrAdmin, updateProduct)
	router.delete("/api/v1/products/:slug", isAuthenticated, isEditorOrAdmin, deleteProduct)
}
