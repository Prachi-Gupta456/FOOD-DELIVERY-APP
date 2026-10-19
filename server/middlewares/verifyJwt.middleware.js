import ApiError from "../utils/ApiError.js"
import jwt from "jsonwebtoken"

const unauthorized = (resp) => resp.status(401).json({
    success: false,
    expired: true,
    msg: "Access token expired"
})

const verifyJwtToken = async (req, resp, next) => {

    try {
        const { accessToken } = req.cookies

        if (!accessToken) {
            return unauthorized(resp)
        }

        const decodedToken = jwt.verify(accessToken, process.env.ACCESS_SECRET)

        if (!decodedToken.userId) {
            throw new ApiError(400, "Invalid token")
        }

        req.userId = decodedToken.userId
        next()

    } catch (error) {

        if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
            return unauthorized(resp)
        }
        next(error)
    }
}

export default verifyJwtToken