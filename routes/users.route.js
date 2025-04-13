import { createUser } from "../controllers/user.controller.js"

export default function (router) {
	router.post("/api/v1/users", createUser)
}
