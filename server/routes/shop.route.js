import express from "express"
import { getMyShop, getShopByCity, saveShop } from "../controllers/shop.controller.js"
import upload from "../middlewares/multer.middleware.js"
import verifyJwtToken from "../middlewares/verifyJwt.middleware.js"

const shopRouter = express.Router()

shopRouter.post("/save-shop",verifyJwtToken,upload.single("shop-image"),saveShop)
shopRouter.get("/get-myshop",verifyJwtToken,getMyShop)
shopRouter.get("/get-shop-by-city/:city",verifyJwtToken,getShopByCity)


export default shopRouter;