import { saveShopService, getMyShopService, getShopByCityService } from "../services/shop.service.js"

export const saveShop = async (req, resp, next) => {

    try {

        const { name, city, state, address } = req.body

        const shop = await saveShopService(name, city, state, address, req.file, req.userId)

        resp.status(201).json({
            success: true,
            msg: "Shop registered successfully.",
            shop
        })
    } catch (error) {
        next(error)
    }
}

export const getMyShop = async (req, resp, next) => {
    try {
        const shop = await getMyShopService(req.userId)
        resp.status(200).json({
            success: true,
            shop
        })

    } catch (error) {
        next(error)
    }
}


export const getShopByCity = async(req,resp,next)=>{
    try {
        const {city} = req.params

        const shops = await getShopByCityService(city)

        resp.status(200).json({
            success:true,
            msg:"Shops fetched successfully.",
            shops
        })

    } catch (error) {
        next(errror)
    }
}