import { getCurrentUserService, updateUserLocationService } from "../services/user.service.js"

export const getCurrentUser = async (req, resp, next) => {
    try {
        const userId = req.userId

        const user = await getCurrentUserService(userId)

        resp.status(200).json({
            success: true,
            user
        })

    } catch (error) {
        next(error)
    }
}

export const updateUserLocation = async (req, resp, next) => {
    try {
        const userId = req.userId
        const { latitude, longitude } = req.body

        const user = await updateUserLocationService(userId, latitude, longitude)

        resp.status(200).json({
            success: true,
            msg: "User location updated successfully.",
            user
        })

    } catch (error) {
        next(error)
    }
}
