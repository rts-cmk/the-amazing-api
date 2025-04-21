import { createUser, deleteUserByEmail, getAllUsers, getUserByEmail, updateUserByEmail } from "../controllers/user.controller.js"
import { isAdmin, isAuthenticated, isSelfOrAdmin } from "../middleware/auth.middleware.js"

export default function (router) {
	router.post("/api/v1/users", createUser)
	router.get("/api/v1/users", isAuthenticated, isAdmin, getAllUsers)
	router.get("/api/v1/users/:email", isAuthenticated, isSelfOrAdmin, getUserByEmail)
	router.patch("/api/v1/users/:email", isAuthenticated, isSelfOrAdmin, updateUserByEmail)
	router.delete("/api/v1/users/:email", isAuthenticated, isSelfOrAdmin, deleteUserByEmail)
}
