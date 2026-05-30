import { createClient } from "redis"

export const redisClient = createClient({
    url: process.env.REDIS_URL
})

redisClient.on("error", (error) => {
    console.log("Redis error: ", error)
})

export const connectRedis = async () => {
    try {
        await redisClient.connect()

        console.log("Redis connected successfully.")
    } catch (error) {
        console.log("Redis connection failed")
        console.log(error.message)
    }
}

