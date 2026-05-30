import { redisClient } from "../config/redis.js"
import ApiError from "../utils/ApiError.js"
import jwt from "jsonwebtoken"

const verifyJwtToken = async (req, resp, next) => {

    try {
        const { accessToken } = req.cookies

        if (!accessToken) {
            return resp.status(401).json({
                success: false,
                expired:false,
                msg: "Access token missing"
            })
        }

        const decodedToken = jwt.verify(accessToken, process.env.ACCESS_SECRET)

        if (!decodedToken.userId) {
            throw new ApiError(400, "Invalid token")
        }

        req.userId = decodedToken.userId
        next()

    } catch (error) {

        if (error.name === "TokenExpiredError") {
            return resp.status(401).json({
                success: false,
                expired: true,
                msg: "Access token expired"
            })
        }
        next(error)
    }
}

export default verifyJwtToken