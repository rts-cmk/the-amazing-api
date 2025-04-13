import { createToken } from "../controllers/authentication.controller.js"

export default function (router) {
	router.post("/auth/token", createToken)
}
