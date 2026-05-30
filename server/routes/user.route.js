import express from "express"
import verifyJwtToken from "../middlewares/verifyJwt.middleware.js"
import { getCurrentUser, updateUserLocation } from "../controllers/user.controller.js"

const userRouter = express.Router()

userRouter.get("/current-user", verifyJwtToken, getCurrentUser)
userRouter.post("/update-user-location", verifyJwtToken, updateUserLocation)

export default userRouter;