import cookieParser from "cookie-parser";
import express from "express"
import errorMiddleware from './middlewares/error.middleware.js'
import cors from "cors"
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js"
import shopRoutes from "./routes/shop.route.js";
import itemRoutes from "./routes/items.route.js";
import orderRoutes from "./routes/order.route.js";

const app = express()

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/shop", shopRoutes)
app.use("/api/item", itemRoutes)
app.use("/api/order", orderRoutes)

app.use(errorMiddleware)

export default app;