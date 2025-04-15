import Router from "express"
import { readdir } from "fs"
import { dirname, join } from "path"
import { fileURLToPath, pathToFileURL } from "url"
import { requestLogger } from "./config/winston.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const router = Router()

router.use(requestLogger)

readdir(join(__dirname, "routes"), routesIterator)

function routesIterator(err, files) {
	if (err) {
		throw err
	}

	files.forEach(async file => await requireRoute(file))
}

async function requireRoute(file) {
	const fullPath = join(__dirname, "routes", file)
	const route = await import(pathToFileURL(fullPath))
	route.default(router)
}

export default router
