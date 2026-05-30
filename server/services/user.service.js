import User from "../models/user.model.js"
import ApiError from "../utils/ApiError.js"

export const getCurrentUserService = async (userId) => {

    if (!userId) {
        throw new ApiError(400, "UserId not found")
    }
    const user = await User.findById(userId).select("-password -resetOtp -otpExpiry -isOtpVerified")

    if (!user) {
        throw new ApiError(400, "User not found")
    }

    return user
}

export const updateUserLocationService = async (userId, lat, lon) => {

    if (!userId) {
        throw new ApiError(400, "UserId not found")
    }

    if (lon == null || lat == null) {
        {
            throw new ApiError(400, "longitude and latitude are required")
        }

    }
    const user = await User.findByIdAndUpdate(userId, {
        location: {
            type: "Point",
            coordinates: [lon, lat]
        }
    }, { returnDocument: "after" })

    if (!user) {
        throw new ApiError(400, "User not found")
    }
    return user
}
