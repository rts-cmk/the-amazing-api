import { getMe } from "../controllers/me.controller.js"
import { isAuthenticated } from "../middleware/auth.middleware.js"

export default function (router) {
	router.get("/api/v1/me", isAuthenticated, getMe)
}
