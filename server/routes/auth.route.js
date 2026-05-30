import express from "express"
import {
    signUp, signIn, logOut, sendOtp, verifyOtp,
    resetPassword, googleAuth, refreshToken
} from "../controllers/auth.controller.js";


const authRouter = express.Router()

authRouter.post("/refresh-token", refreshToken)
authRouter.post("/signup", signUp)
authRouter.post("/signin",signIn)
authRouter.get("/logout", logOut)
authRouter.post("/send-otp",sendOtp)
authRouter.post("/verify-otp", verifyOtp)
authRouter.post("/reset-password", resetPassword)
authRouter.post("/google-auth", googleAuth)


export default authRouter;