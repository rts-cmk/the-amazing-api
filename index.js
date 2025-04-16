import express from "express"
const app = express()
import router from "./router.js"
import cors from "cors"
import bodyParser from "body-parser"

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static("public"))
app.use(router)

export default app
