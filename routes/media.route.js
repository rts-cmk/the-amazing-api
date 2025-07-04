import { createMedia, deleteMedia, getAllMedia, getMediaFile, getSingleMedia, updateMedia } from "../controllers/media.controller.js"
import { isAuthenticated, isEditorOrAdmin } from "../middleware/auth.middleware.js"

export default function (router) {
	router.post("/api/v1/media", isAuthenticated, isEditorOrAdmin, createMedia)
	router.get("/api/v1/media", getAllMedia)
	router.get("/api/v1/media/:id", getSingleMedia)
	router.get("/media/:filename", getMediaFile)
	router.patch("/api/v1/media/:id", isAuthenticated, isEditorOrAdmin, updateMedia)
	router.delete("/api/v1/media/:id", isAuthenticated, isEditorOrAdmin, deleteMedia)
}
