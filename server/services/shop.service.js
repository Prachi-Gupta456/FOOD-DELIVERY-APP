import ApiError from "../utils/ApiError.js"
import uploadOnCloudinary from "../utils/uploadFile.js"
import Shop from "../models/shop.model.js"
import mongoose from "mongoose"
import { redisClient } from "../config/redis.js"

export const saveShopService = async (name, city, state, address, file, ownerId) => {

    let shop = await Shop.findOne({ owner: ownerId })
    let oldCity;

    // if shop does not exist
    if (!shop) {

        if (!name || !city || !state || !address || !file) {
            throw new ApiError(400, "Please provide all required fields.")
        }

        const image = await uploadOnCloudinary(file)
        shop = await Shop.create({ name, city, state, address, image, owner: ownerId })
    }
    // if already exists then update shop
    else {

        oldCity = shop.city
        let newImage = null;
        const oldImage = shop.image
        if (file) {
            newImage = await uploadOnCloudinary(file)
        }

        shop = await Shop.findByIdAndUpdate(shop._id, { name, city, state, address, image: newImage || oldImage, owner: ownerId }, { returnDocument: "after" })
    }

    await shop.populate([
        {
            path: "items",
            options: { sort: { updatedAt: -1 } }
        }, {
            path: "owner"
        }])


    // remove old shops stored in cache for this city
    await redisClient.del(`shops:${city.toLowerCase()}`)

    if (oldCity) {
        await redisClient.del(`shops:${oldCity.toLowerCase()}`)
    }

    return shop

}

export const getMyShopService = async (ownerId) => {

    if (!ownerId) {
        throw new ApiError(400, "Please provide ownerId")
    }

    const shop = await Shop.findOne({ owner: ownerId })
        .populate({ path: "items", options: { sort: { updatedAt: -1 } } })

    if (!shop) {
        throw new ApiError(404, "Shop not found.")
    }

    return shop

}

export const getShopByCityService = async (city) => {

    if (!city) {
        throw new ApiError(400, "City not found")
    }

    const cacheKey = `shops:${city.toLowerCase()}`

    // check in cache
    const cachedShops = await redisClient.get(cacheKey)
    if (cachedShops) {
        return JSON.parse(cachedShops)
    }
    // -------------

    const shops = await Shop.find({
        city: { $regex: new RegExp(`^${city}$`, "i") }
    }).populate("items")

    // store in cache
    await redisClient.setEx(cacheKey, 5 * 60, JSON.stringify(shops))

    return shops
}
