import { editItemService, addItemService, deleteItemService, getItemByCityService, getItemByShopService, searchItemService, updateItemRatingService } from "../services/items.service.js"


export const addItem = async (req, resp, next) => {

    try {
        const { name, category, foodType, price } = req.body

        const shop = await addItemService(name, category, foodType, price, req.file, req.userId)

        resp.status(201).json({
            success: true,
            msg: "Item added in shop successfully.",
            shop
        })
    } catch (error) {
        next(error)
    }
}

export const editItem = async (req, resp, next) => {

    try {
        const { name, category, foodType, price } = req.body

        const shop = await editItemService(name, category, foodType, price, req.params.itemId, req.file, req.userId)

        resp.status(201).json({
            success: true,
            msg: "Item updated in shop successfully.",
            shop
        })
    } catch (error) {
        next(error)
    }
}

export const deleteItem = async (req, resp, next) => {

    try {
        const { itemId } = req.params

        const result = await deleteItemService(itemId, req.userId)

        resp.status(200).json({
            success: true,
            msg: "Item removed from shop successfully."
        })
    } catch (error) {
        next(error)
    }
}

export const updateItemRating = async (req, resp, next) => {

    try {
        const { itemId, rating } = req.body

        const item = await updateItemRatingService(itemId, rating)

        resp.status(200).json({
            success: true,
            item
        })
    } catch (error) {
        next(error)
    }
}

export const getItemByCity = async (req, resp, next) => {
    try {
        const { city } = req.params
        const items = await getItemByCityService(city)

        resp.status(200).json({
            success: true,
            msg: "Items fetched successfully",
            items
        })
    } catch (error) {
        next(error)
    }
}

export const getItemByShop = async (req, resp, next) => {
    try {
        const { shopId } = req.params
        const data = await getItemByShopService(shopId)

        resp.status(200).json({
            success: true,
            msg: "Items fetched successfully",
            data
        })
    } catch (error) {
        next(error)
    }
}

export const searchItems = async (req, resp, next) => {
    try {
        const { query, city } = req.query
        const items = await searchItemService(query, city)

        resp.status(200).json({
            success: true,
            msg: "Items fetched successfully",
            items
        })
    } catch (error) {
        next(error)
    }
}
