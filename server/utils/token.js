import jwt from "jsonwebtoken"

export const generateRefreshToken = (userId) => {
    try {
        const token = jwt.sign({ userId }, process.env.REFRESH_SECRET, { expiresIn: "7d" })
        return token
    } catch (error) {
        console.log("Error in genrating refresh token: ", error.message)
        throw error
    }
}

export const generateAccessToken = (userId) => {
    try {
        const token = jwt.sign({ userId }, process.env.ACCESS_SECRET, { expiresIn: "15m" })
        return token
    } catch (error) {
        console.log("Error in genrating access token: ", error.message)
        throw error
    }
}
