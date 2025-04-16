import { createMedia, getAllMedia, getMediaFile, getSingleMedia } from "../controllers/media.controller.js"

export default function (router) {
	router.post("/api/v1/media", createMedia)
	router.get("/api/v1/media", getAllMedia)
	router.get("/api/v1/media/:id", getSingleMedia)
	router.get("/media/:filename", getMediaFile)
}
