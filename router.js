import Router from "express"
const router = Router()
import { readdir } from "fs"
import { join } from "path"
import { requestLogger } from "./config/winston.js"

router.use(requestLogger)

readdir(join(import.meta.dirname, "routes"), routesIterator)

function routesIterator(err, files) {
	if (err) {
		throw err
	}

	files.forEach(file => requireRoute(file))
}

function requireRoute(file) {
	require(join(import.meta.dirname, "routes", file))(router)
}

export default router
