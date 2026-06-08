import ApiError from '../utils/ApiError.js'
import User from '../models/user.model.js'
import bcrypt from "bcryptjs"
import { generateAccessToken, generateRefreshToken } from '../utils/token.js'
import crypto from "crypto"
import sendMail from '../utils/mailSender.js'
import { redisClient } from "../config/redis.js"
import jwt from "jsonwebtoken"

export const refreshTokenService = async (refreshToken) => {

    if (!refreshToken) {
        throw new ApiError(400, "Refresh token not found")
    }

    // verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET)

    if (!decoded.userId) {
        throw new ApiError(401, "Invalid refresh token")
    }

    // check in cache
    const storedToken = await redisClient.get(`refresh:${decoded.userId}`)

    if (!storedToken) {
        throw new ApiError(401, "Session expired")
    }

    // compare tokens
    if (refreshToken !== storedToken) {
        throw new ApiError(401, "Invalid refresh token")
    }

    // find user
    const user = await User.findById(decoded.userId)

    if (!user) {
        throw new ApiError(400, "User not found")
    }

    // generate new access token and refresh tokens
    const access_token = await generateAccessToken(user._id)
    const refresh_token = await generateRefreshToken(user._id)

    // store new refresh token in cache
    await redisClient.setEx(`refresh:${user._id}`, 7 * 24 * 60 * 60, refresh_token)

    return { access_token, refresh_token }

}

export const logoutService = async (refreshToken) => {

    if (refreshToken) {

        try {
            // decode refresh token
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET)
            // remove from redis
            await redisClient.del(`refresh:${decoded.userId}`)

        } catch (error) {
            console.log(error)
        }

    }
}

export const signupService = async (fullName, email, password, contact, role) => {

    if (!fullName || !email || !contact || !password || !role) {
        throw new ApiError(400, "All fields are not provided.")
    }

    if (password.length < 6) {
        throw new ApiError(400, "Password must be atleast 6 characters long.")
    }

    if (contact.length < 10) {
        throw new ApiError(400, "Mobile Number must be of 10 digits.")
    }

    // check existing users
    const user = await User.findOne({ email })

    if (user) {
        throw new ApiError(403, "User already exists")
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const result = await User.create({
        fullName,
        email,
        role,
        contact,
        password: hashedPassword
    })

    if (!result) {
        throw new ApiError(500, "Server Error...")
    }

    // generate access token and refresh tokens
    const accessToken = await generateAccessToken(result._id)
    const refreshToken = await generateRefreshToken(result._id)


    // store refresh token in redis
    await redisClient.setEx(`refresh:${result._id}`, 7 * 24 * 60 * 60, refreshToken)


    const data = {
        user: {
            fullName,
            email,
            role,
            contact
        }, refresh_token: refreshToken, access_token: accessToken
    }

    return data;

}

export const signInService = async (email, password) => {

    if (!email || !password) {
        throw new ApiError(400, "All fields are not provided.")
    }

    // check existing users
    const user = await User.findOne({ email })

    if (!user) {
        throw new ApiError(400, "User not found")
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new ApiError(500, "Wrong Password.")
    }


    // generate access token and refresh tokens
    const accessToken = await generateAccessToken(user._id)
    const refreshToken = await generateRefreshToken(user._id)

    // store refresh token in redis
    await redisClient.setEx(`refresh:${user._id}`, 7 * 24 * 60 * 60, refreshToken)

    const data = {
        user: {
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            contact: user.contact
        }, refresh_token: refreshToken, access_token: accessToken

    }

    return data;

}

export const sendOtpService = async (email) => {

    if (!email) {
        throw new ApiError(400, "Email is required.")
    }

    const user = await User.findOne({ email }).lean()

    if (!user) {
        throw new ApiError(403, "User not found")
    }

    // check for otp spam
    const alreadySent = await redisClient.get(`otp:cooldown:${email}`)

    // another request under one minute
    if (alreadySent) {
        throw new ApiError(429, "You can request for another OTP after one minute.")
    }

    const otp = crypto.randomInt(100000, 999999).toString()
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex")

    await sendMail(otp, email)

    // store otp in cache
    await redisClient.setEx(`otp:reset:${email}`, 5 * 60, hashedOtp)

    // set otp limit
    await redisClient.setEx(`otp:cooldown:${email}`, 60, "true")

}

export const verifyOtpService = async (email, otp) => {

    const user = await User.findOne({ email })

    if (!user) {
        throw new ApiError(403, "User not found")
    }

    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex")

    // check in cache
    const cacheKey = `otp:reset:${email}`
    const cachedOtp = await redisClient.get(cacheKey)

    if (!cachedOtp) {
        throw new ApiError(400, "OTP expired.")
    }

    if (hashedOtp !== cachedOtp) {
        throw new ApiError(400, "Wrong OTP.")
    }

    // remove otp from cache
    await redisClient.del(cacheKey)
    // ------------------

    user.isOtpVerified = true

    await user.save()
}

export const resetPasswordService = async (email, newPassword, confirmPassword) => {

    if (!email || !newPassword || !confirmPassword) {
        throw new ApiError(400, "All field are required")
    }

    if (newPassword !== confirmPassword) {
        throw new ApiError(400, "Both Passwords should be same.")
    }

    const user = await User.findOne({ email })

    if (!user || !user.isOtpVerified) {
        throw new ApiError(403, "OTP verification is required.")
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    user.password = hashedPassword
    user.isOtpVerified = false

    await user.save()
}

export const GoogleAuthService = async (fullName, email, contact, role) => {

    // check existing users
    let user = await User.findOne({ email })

    if (!user) {
        user = await User.create({
            fullName,
            email,
            contact,
            role
        })
    }

    // generate access token and refresh tokens
    const accessToken = await generateAccessToken(user._id)
    const refreshToken = await generateRefreshToken(user._id)


    // store refresh token in redis
    await redisClient.setEx(`refresh:${user._id}`, 7 * 24 * 60 * 60, refreshToken)
    

    const data = {
        user: {
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            contact: user.contact
        },  refresh_token: refreshToken, access_token: accessToken
       
    }

    return data;
}



