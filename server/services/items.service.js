import ApiError from "../utils/ApiError.js"
import uploadOnCloudinary from "../utils/uploadFile.js"
import Shop from "../models/shop.model.js"
import mongoose from "mongoose"
import Item from "../models/item.model.js"
import { redisClient } from "../config/redis.js"

export const addItemService = async (name, category, foodType, price, file, ownerId) => {

    if (!name || !category || !foodType || !price || !file) {
        throw new ApiError(400, "Please provide all required fields.")
    }

    // upload image of item
    const image = await uploadOnCloudinary(file)

    const shop = await Shop.findOne({ owner: ownerId })

    if (!shop) {
        throw new ApiError(404, "Shop not found!")
    }

    const item = await Item.create({ name, category, foodType, price, image, shop: shop._id })

    shop.items.push(item._id)
    await shop.save()
    await shop.populate({ path: "items", options: { sort: { updatedAt: -1 } } })

   
    // update cache
    await redisClient.del(`items:${shop.city.toLowerCase()}`)

    return shop

}

export const editItemService = async (new_name, new_category, new_foodType, new_price, itemId, file, ownerId) => {

    // upload image of item
    let new_image;
    if (file) {
        new_image = await uploadOnCloudinary(file)
    }

    const shop = await Shop.findOne({ owner: ownerId })

    if (!shop) {
        throw new ApiError(404, "Shop not found!")
    }

    const item = await Item.findById(itemId)

    if (!item) {
        throw new ApiError(404, "Item not found!")
    }

    item.name = new_name
    item.category = new_category
    item.foodType = new_foodType
    item.price = new_price
    item.image = new_image || item.image

    await item.save()
    await shop.populate("items")

    // update cache
    await redisClient.del(`items:${shop.city.toLowerCase()}`)

    return shop;
}

export const deleteItemService = async (itemId, ownerId) => {

    const result = await Item.findByIdAndDelete(itemId)

    if (!result) {
        throw new ApiError(404, "Item not found.")
    }
    const shop = await Shop.findOne({ owner: ownerId })

    if (!shop) {
        throw new ApiError(404, "Shop not found.")
    }

    shop.items = shop.items.filter((id) => id.toString() !== itemId.toString())

    await shop.save()

    // update cache
    await redisClient.del(`items:${shop.city.toLowerCase()}`)


    return result
}

export const getItemByCityService = async (city) => {

    if (!city) {
        throw new ApiError(400, "City not found")
    }

    // check in cache
    const cacheKey = `items:${city.toLowerCase()}`
    const cachedItems = await redisClient.get(cacheKey)

    if (cachedItems) {
        return JSON.parse(cachedItems)
    }

    const shops = await Shop.find({
        city: { $regex: new RegExp(`^${city}$`, "i") }
    }).lean()

    if (shops.length === 0) {
        return []
    }

    const shopIds = shops.map((shop) => shop._id)
    const items = await Item.find({ shop: { $in: shopIds } })

    // store in cache
    await redisClient.setEx(cacheKey, 300, JSON.stringify(items))

    return items
}

export const getItemByShopService = async (shopId) => {

    if (!shopId) {
        throw new ApiError(400, "shopId not found")
    }

    const shop = await Shop.findById(shopId).populate("items")

    if (!shop) {
        throw new ApiError(400, "Shop not found.")
    }

    const data = { shop, items: shop.items }

    return data

}

export const searchItemService = async (query, city) => {

    if (!query || !city) {
        return null
    }

    const shops = await Shop.find({
        city: { $regex: new RegExp(`^${city}$`, "i") }
    }).populate("items")

    if (!shops) {
        throw new ApiError(400, "Shops not found.")
    }

    const shopIds = shops.map(s => s._id)

    const items = await Item.find({
        shop: { $in: shopIds },
        $or: [
            { name: { $regex: query, $options: "i" } },
            { category: { $regex: query, $options: "i" } }
        ]
    }).populate("shop", "name image")

    return items
}

export const updateItemRatingService = async (itemId, rating) => {

    if (!itemId || !rating) {
        throw new ApiError(400, "Missing itemId/rating")
    }

    const numericRating = Number(rating)

    if (!numericRating || numericRating < 1 || numericRating > 5) {
        throw new ApiError(400, "Invalid rating")
    }

    const item = await Item.findById(itemId)

    if (!item) {
        throw new ApiError(400, "Item not found")
    }

    const oldCount = item.rating.count || 0
    const oldAverage = item.rating.average || 0


    const newCount = oldCount + 1
    const newAverage = ((oldAverage * oldCount) + numericRating) / newCount

    item.rating.average = newAverage
    item.rating.count = newCount

    await item.save()

    return item

}