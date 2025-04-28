import { createPost, deletePost, getAllPosts, getSinglePost } from "../controllers/post.controller.js"
import { isAuthenticated, isEditorOrAdmin } from "../middleware/auth.middleware.js"

export default function (router) {
	router.post("/api/v1/posts", isAuthenticated, isEditorOrAdmin, createPost)
	router.get("/api/v1/posts", getAllPosts)
	router.get("/api/v1/posts/:slug", getSinglePost)
	router.delete("/api/v1/posts/:slug", isAuthenticated, isEditorOrAdmin, deletePost)
}
