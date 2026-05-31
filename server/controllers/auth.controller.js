import { redisClient } from "../config/redis.js"
import {
    signupService, signInService, sendOtpService,
    verifyOtpService, resetPasswordService, GoogleAuthService,
    refreshTokenService,
    logoutService
} from "../services/auth.service.js"

export const refreshToken = async (req, resp, next) => {
    try {
       
        const { refreshToken } = req.cookies

        const { access_token, refresh_token } = await refreshTokenService(refreshToken)

        resp.cookie("refreshToken", refresh_token, {
            httpOnly: true,
            path: "/",
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        resp.cookie("accessToken", access_token, {
            httpOnly: true,
            path: "/",
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge:15* 60 * 1000
        })


        resp.status(200).json({
            success: true,
            msg: "Token refreshed successfully."
        })
    } catch (error) {
        next(error)
    }
}

export const signUp = async (req, resp, next) => {
    try {
        const { fullName, email, password, contact, role } = req.body

        const { user, refresh_token,access_token } = await signupService(fullName, email, password, contact, role)

        resp.cookie("accessToken", access_token, {
            httpOnly: true,
            path: "/",
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 15 * 60 * 1000
        })

        resp.cookie("refreshToken", refresh_token, {
            httpOnly: true,
            path: "/",
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        resp.status(201).json({
            success: true,
            msg: "signup done!",
            user
        })

    } catch (error) {
        next(error)
    }
}

export const signIn = async (req, resp, next) => {
    try {
        const { email, password } = req.body

        const { refresh_token,access_token, user } = await signInService(email, password)

         resp.cookie("accessToken", access_token, {
            httpOnly: true,
            path: "/",
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 15*60 * 1000
        })

        resp.cookie("refreshToken", refresh_token, {
            httpOnly: true,
            path: "/",
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })


        resp.status(200).json({
            success: true,
            msg: "Login done!",
            user
        })

    } catch (error) {
        next(error)
    }
}

export const logOut = async (req, resp, next) => {
    try {

        const { refreshToken } = req.cookies

        await logoutService(refreshToken)

        resp.clearCookie("refreshToken", {
            httpOnly: true,
            path: "/",
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
        })

        resp.clearCookie("accessToken", {
            httpOnly: true,
            path: "/",
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
        })

        resp.status(200).json({
            success: true,
            msg: "User logged out."
        })
    } catch (error) {
        next(error)
    }
}

export const sendOtp = async (req, resp, next) => {
    try {
        const { email } = req.body

        await sendOtpService(email)
        resp.status(200).json({
            success: true,
            msg: "OTP sent successfully."
        })

    } catch (error) {
        next(error)
    }
}

export const verifyOtp = async (req, resp, next) => {
    try {
        const { email, otp } = req.body

        await verifyOtpService(email, otp)
        resp.status(200).json({
            success: true,
            msg: "OTP verified successfully."
        })

    } catch (error) {
        next(error)
    }
}

export const resetPassword = async (req, resp, next) => {
    try {
        const { email, newPassword, confirmPassword } = req.body

        await resetPasswordService(email, newPassword, confirmPassword)
        resp.status(200).json({
            success: true,
            msg: "Password reset successfully."
        })

    } catch (error) {
        next(error)
    }
}

export const googleAuth = async (req, resp, next) => {
    try {
        const { fullName, email, contact, role } = req.body

        const { user, refresh_token, access_token } = await GoogleAuthService(fullName, email, contact, role)

        resp.cookie("accessToken", access_token, {
            httpOnly: true,
            path: "/",
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 15 * 60 * 1000
        })

        resp.cookie("refreshToken", refresh_token, {
            httpOnly: true,
            path: "/",
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        resp.status(201).json({
            success: true,
            user
        })

    } catch (error) {
        next(error)
    }
}
