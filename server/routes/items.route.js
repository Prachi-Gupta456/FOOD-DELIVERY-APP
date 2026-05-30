import express from "express"

import {
    addItem, deleteItem, editItem, getItemByCity,
    getItemByShop, searchItems, updateItemRating
} from "../controllers/items.controller.js"

import upload from "../middlewares/multer.middleware.js"
import verifyJwtToken from "../middlewares/verifyJwt.middleware.js"

const itemRouter = express.Router()

itemRouter.post("/add-item", verifyJwtToken, upload.single("food-image"), addItem)
itemRouter.get("/search-items", verifyJwtToken, searchItems)
itemRouter.post("/update-item-rating", verifyJwtToken, updateItemRating)

itemRouter.post("/edit-item/:itemId", verifyJwtToken, upload.single("food-image"), editItem)
itemRouter.delete("/delete-food/:itemId", verifyJwtToken, deleteItem)
itemRouter.get("/get-item-by-city/:city", verifyJwtToken, getItemByCity)
itemRouter.get("/get-item-by-shop/:shopId", verifyJwtToken, getItemByShop)


export default itemRouter;