import 'dotenv/config'
import app from './app.js'
import connectDB from './config/db.js'
import http from "http"
import { Server } from "socket.io"
import { socketHandler } from "./utils/socket.js";
import { connectRedis } from './config/redis.js'

const PORT = process.env.PORT || 3200

app.get("/", (req, resp) => {
    resp.send("Backend is running...")
})

const start = async () => {

    await connectDB();
    await connectRedis();
    
    const server = http.createServer(app)

    const io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL,
            credentials: true
        }
    })

    socketHandler(io)
    app.set("io",io)

    server.listen(PORT, () => console.log(`Server is running on PORT : ${PORT}`))
}

start()
