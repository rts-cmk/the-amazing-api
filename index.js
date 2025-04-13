import express from "express"
const app = express()
import router from "./router.js"
import formidable from "express-formidable"
import cors from "cors"

app.use(cors())
app.use(formidable())
app.use(express.static("public"))
app.use(router)

export default app
