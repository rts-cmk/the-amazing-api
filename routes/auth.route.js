import { createToken, refreshToken } from "../controllers/authentication.controller.js"

export default function (router) {
	router.post("/auth/token", createToken)
	router.post("/auth/refresh", refreshToken)
}
