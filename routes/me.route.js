import { getMe } from "../controllers/me.controller.js"

export default function (router) {
	router.get("/api/v1/me", getMe)
}
