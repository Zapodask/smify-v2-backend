import express from "express"
import routes from "./routes"
import connection from "./models/connection"
import "dotenv/config"
import cookieParser from "cookie-parser"
import cors from "cors"

const app = express()

app.use(
  cors({
    origin: [
      "http://127.0.0.1:5173",
      "http://localhost:5173",
      "https://smify-v2.vercel.app",
    ],
    credentials: true,
  }),
)
app.use(express.json())
app.use(cookieParser("BeVewyQuiet"))

app.use(routes)

app.listen(3000, () => {
  connection
    .connect()
    .then(() => {
      console.log("Server running on port 3001")
    })
    .catch((err) => {
      console.log("Error connecting to database", err)
      process.exit(1)
    })
})
