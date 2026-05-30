import ApiError from "../utils/ApiError.js"
import Shop from "../models/shop.model.js"
import Order from "../models/order.model.js"
import User from "../models/user.model.js"
import Item from "../models/item.model.js"
import crypto from "crypto"
import { sendDeliveryOTPMail } from "../utils/mailSender.js"
import DeliveryAssignment from "../models/deliveryAssignment.model.js"
import razorpay_instance from "../config/razorpay.js"
import { redisClient } from "../config/redis.js"


export const placeOrderService = async (cartItems, paymentMethod, deliveryAddress, userId, io) => {

    if (!cartItems || cartItems.length == 0) {
        throw new ApiError(400, "Cart is empty.")
    }

    if (!deliveryAddress.text || deliveryAddress.latitude == null || deliveryAddress.longitude == null) {
        throw new ApiError(400, "Send complete delivery address")
    }

    const groupItemsByShop = {}

    cartItems.forEach(item => {
        const shopId = item.shop

        if (!groupItemsByShop[shopId]) {
            groupItemsByShop[shopId] = []
        }
        groupItemsByShop[shopId].push(item)

    });

    const shopOrders = await Promise.all(Object.keys(groupItemsByShop).map(async (shopId) => {

        const shop = await Shop.findById(shopId)

        if (!shop) {
            throw new ApiError(400, "Shop not found!")
        }

        const items = await Promise.all(
            groupItemsByShop[shopId].map(async (i) => {

                // fetching item from db
                const dbItem = await Item.findById(i.id)

                if (!dbItem) {
                    throw new ApiError(400, "Item not found!")
                }

                if (i.quantity <= 0) {
                    throw new ApiError(400, "Invalid quantity")
                }
                return {
                    item: dbItem._id,
                    name: dbItem.name,
                    price: dbItem.price,
                    quantity: i.quantity
                }
            })
        )

        const subtotal = items.reduce((sum, i) => sum + Number(i.price) * Number(i.quantity), 0)

        return {
            shop: shop._id,
            owner: shop.owner._id,
            subtotal,
            shopOrderItems: items.map((i) => ({
                item: i.item,
                name: i.name,
                price: i.price,
                quantity: i.quantity
            })
            )
        }
    }))

    const finalTotalAmount = shopOrders.reduce((sum, shop) => sum + shop.subtotal, 0)

    // check if payment method is online
    if (paymentMethod == "online") {

        const razorOrder = await razorpay_instance.orders.create({
            amount: Math.round(finalTotalAmount * 100),
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        })

        const newOrder = await Order.create({
            user: userId,
            paymentMethod,
            deliveryAddress,
            totalAmount: finalTotalAmount,
            shopOrders,
            razorpayOrderId: razorOrder.id
        })



        return {
            razorOrder,
            orderId: newOrder._id,
            key_id: process.env.RAZORPAY_KEY_ID
        }

    }

    const newOrder = await Order.create({
        user: userId,
        paymentMethod,
        deliveryAddress,
        totalAmount: finalTotalAmount,
        shopOrders
    })

    await newOrder.populate("shopOrders.shopOrderItems.item", "name image price")
    await newOrder.populate("shopOrders.shop", "name")
    await newOrder.populate("shopOrders.owner", "name socketId")
    await newOrder.populate("user", "name email contact")

    // socket event
    if (io) {
        newOrder.shopOrders.forEach((shopOrder) => {

            const ownerSocketId = shopOrder?.owner.socketId

            if (ownerSocketId) {
                io.to(ownerSocketId).emit("newOrder", {
                    _id: newOrder._id,
                    paymentMethod: newOrder.paymentMethod,
                    user: newOrder.user,
                    createdAt: newOrder.createdAt,
                    deliveryAddress: newOrder.deliveryAddress,
                    payment: newOrder.payment,
                    shopOrders: shopOrder
                })
            }


        })
    }
    // ------------


    return newOrder

}

export const verifyPaymentService = async (razorpay_payment_id, razorpay_order_id, razorpay_signature, orderId, io) => {

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !orderId) {
        throw new ApiError(400, "Missing payment details")
    }


    const order = await Order.findById(orderId)

    if (!order) {
        throw new ApiError(400, "Order not found")
    }

    if (order.payment) {
        throw new ApiError(400, "Payment already completed")
    }

    if (order.razorpayOrderId !== razorpay_order_id) {
        throw new ApiError(400, "Invalid razorpay order")
    }

    // verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id

    const expected_signature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex")

    if (expected_signature !== razorpay_signature) {
        throw new ApiError(400, "Invalid razorpay payment signature")
    }

    // fetch razorpay payment
    const payment = await razorpay_instance.payments.fetch(razorpay_payment_id)

    if (!payment || payment.status !== "captured") {
        throw new ApiError(400, "Payment not captured")
    }

    // verify payment amount
    if (payment.amount / 100 !== order.totalAmount) {
        throw new ApiError(400, "Payment amount mismatch")
    }

    order.payment = true
    order.razorpayPaymentId = razorpay_payment_id

    await order.save()

    await order.populate("shopOrders.shopOrderItems.item", "name image price")
    await order.populate("shopOrders.shop", "name")
    await order.populate("shopOrders.owner", "name socketId")
    await order.populate("user", "name email contact")


    // socket event
    if (io) {
        order.shopOrders.forEach((shopOrder) => {

            const ownerSocketId = shopOrder?.owner.socketId

            if (ownerSocketId) {
                io.to(ownerSocketId).emit("newOrder", {
                    _id: order._id,
                    paymentMethod: order.paymentMethod,
                    user: order.user,
                    createdAt: order.createdAt,
                    deliveryAddress: order.deliveryAddress,
                    payment: order.payment,
                    shopOrders: shopOrder
                })
            }


        })
    }
    // ------------

    return order

}

export const getMyOrderService = async (userId) => {

    if (!userId) {
        throw new ApiError(403, "User is unauthorized.")
    }

    const user = await User.findById(userId)
    let orders;

    if (user.role == "owner") {

        const allOrders = await Order.find({ "shopOrders.owner": userId })
            .sort({ createdAt: -1 })
            .populate("shopOrders.shop", "name")
            .populate("user")
            .populate("shopOrders.shopOrderItems.item", "name image price")

        orders = allOrders.map((order) => ({
            _id: order._id,
            paymentMethod: order.paymentMethod,
            user: order.user,
            createdAt: order.createdAt,
            deliveryAddress: order.deliveryAddress,
            payment: order.payment,
            shopOrders: order.shopOrders.find(o => o.owner._id.toString() == userId.toString())
        }
        ))



    } else {
        orders = await Order.find({ user: userId }).sort({ createdAt: -1 })
            .populate("shopOrders.shop", "name")
            .populate("shopOrders.owner", "name email contact")
            .populate("shopOrders.shopOrderItems.item", "name image price")
            .populate("shopOrders.assignedDeliveryBoy", "fullName contact")
    }

    return orders
}

export const updateOrderService = async (shopId, orderId, status, io) => {

    if (!orderId || !shopId || !status) {
        throw new ApiError(400, "Provide all required data")
    }

    const order = await Order.findById(orderId)

    const shopOrder = await order.shopOrders.find(o => o.shop.toString() === shopId.toString())

    if (!shopOrder) {
        throw new ApiError(400, "shopOrder not found.")
    }

    if (shopOrder.status == "delivered") {
        throw new ApiError(400, "Order is already delivered.")
    }

    shopOrder.status = status

    let deliveryBoysPayload = []

    if (status == "out of delivery" && !shopOrder.assignment) {

        const { longitude, latitude } = order.deliveryAddress

        const nearByDeliveryBoys = await User.find({
            role: "deliveryBoy",
            location: {
                $near: {
                    $geometry: { type: "Point", coordinates: [Number(longitude), Number(latitude)] },
                    $maxDistance: 5000
                }
            }
        })

        const nearByIds = nearByDeliveryBoys.map(b => b._id)

        const busyIds = await DeliveryAssignment.find({
            assignedTo: {
                $in: nearByIds
            },
            status: { $nin: ["broadcasted", "completed"] }

        }).distinct("assignedTo")

        const busyIdSet = new Set(busyIds.map(id => String(id)))

        const availableBoys = nearByDeliveryBoys.filter(b => !busyIdSet.has(String(b._id)))

        const candidates = availableBoys.map(b => b._id)

        if (candidates.length == 0) {
            await order.save()
            return { success: true, msg: "Order status updated but there is no delivery boys available " }
        }

        const deliveryAssignment = await DeliveryAssignment.create({
            order: order._id,
            shop: shopOrder.shop,
            shopOrderId: shopOrder._id,
            broadcastedTo: candidates,
            status: "broadcasted"
        })

        await deliveryAssignment.populate("order")
        await deliveryAssignment.populate("shop")

        shopOrder.assignedDeliveryBoy = deliveryAssignment.assignedTo
        shopOrder.assignment = deliveryAssignment._id

        deliveryBoysPayload = availableBoys.map(b => ({
            id: b._id,
            fullName: b.fullName,
            longitude: b.location.coordinates?.[0],
            latitude: b.location.coordinates?.[1],
            contact: b.contact,

        }))


        // socket event
        if (io) {
            availableBoys.forEach((boy) => {
                const boySocketId = boy.socketId

                if (boySocketId) {
                    io.to(boySocketId).emit("new-assignment", {
                        id: boy._id,
                        assignmentId: deliveryAssignment._id,
                        orderId: deliveryAssignment.order._id,
                        shopName: deliveryAssignment.shop.name,
                        deliveryAddress: deliveryAssignment.order.deliveryAddress,
                        items: (deliveryAssignment.order.shopOrders.find(so => so._id.toString() == deliveryAssignment.shopOrderId.toString()))?.shopOrderItems || [],
                        subtotal: (deliveryAssignment.order.shopOrders.find(so => so._id.toString() == deliveryAssignment.shopOrderId.toString()))?.subtotal
                    })
                }
            })
        }
        // ------------
    }


    await order.save()

    await order.populate("shopOrders.shop", "name")
    await order.populate("shopOrders.assignedDeliveryBoy", "fullName email contact")
    await order.populate("user", "socketId")

    const updatedShopOrder = order.shopOrders.find(o => o.shop?._id?.toString() === shopId.toString())

    if (!updatedShopOrder) {
        throw new ApiError(400, "Updated shop order not found")
    }


    // socket event
    if (io) {

        const userSocketId = order.user.socketId

        io.to(userSocketId).emit("update-order-status", {
            orderId: order._id,
            shopId: updatedShopOrder.shop._id,
            status: updatedShopOrder.status,
            userId: order.user._id
        })
    }
    // ------------

    return {
        success: true,
        shopOrder: updatedShopOrder,
        assignedDeliveryBoy: updatedShopOrder.assignedDeliveryBoy,
        availableBoys: deliveryBoysPayload,
        assignment: updatedShopOrder.assignment?._id
    }

}

export const getDeliveryBoyAssignment = async (deliveryBoyId) => {

    if (!deliveryBoyId) {
        throw new ApiError(403, "User is unauthorized.")
    }

    const assignments = await DeliveryAssignment.find({
        broadcastedTo: deliveryBoyId,
        status: "broadcasted"
    })
        .populate("order")
        .populate("shop")


    const formatted = assignments.map(a => ({
        assignmentId: a._id,
        orderId: a.order._id,
        shopName: a.shop.name,
        deliveryAddress: a.order.deliveryAddress,
        items: (a.order.shopOrders.find(so => so._id.toString() == a.shopOrderId.toString()))?.shopOrderItems || [],
        subtotal: (a.order.shopOrders.find(so => so._id.toString() == a.shopOrderId.toString()))?.subtotal
    }))

    return formatted

}

export const acceptOrderService = async (assignmentId, userId) => {

    const assignment = await DeliveryAssignment.findById(assignmentId)

    if (!assignment) {
        throw new ApiError(400, "Assignment not found")
    }

    if (assignment.status !== "broadcasted") {
        throw new ApiError(400, "Assignment is expired")
    }

    const alreadyAssigned = await DeliveryAssignment.findOne({
        assignedTo: userId,
        status: { $nin: ["broadcasted", "completed"] }
    })

    if (alreadyAssigned) {
        throw new ApiError(400, "You are already assigned to another order")
    }

    assignment.assignedTo = userId
    assignment.status = "assigned"
    assignment.acceptedAt = new Date()

    await assignment.save()

    const order = await Order.findById(assignment.order)

    if (!order) {
        throw new ApiError(400, "order not found")
    }

    let shopOrder = order.shopOrders.find(so => so._id.toString() == assignment.shopOrderId.toString())

    shopOrder.assignedDeliveryBoy = userId

    await order.save()


    const updatedShopOrder = order.shopOrders.find(
        so => so._id.toString() === assignment.shopOrderId.toString()
    )

    return order


}

export const getCurrentOrderService = async (userId) => {

    const assignment = await DeliveryAssignment.findOne({
        assignedTo: userId,
        status: "assigned"
    })
        .populate("assignedTo", "fullName email contact location")
        .populate({
            path: "order",
            populate: [{ path: "user", select: "fullName email contact location" },
            { path: "shopOrders.shop", select: "name" }
            ]
        })

    if (!assignment) {
        return null
    }

    if (!assignment.order) {
        throw new ApiError(400, "order not found")
    }

    const shopOrder = assignment.order.shopOrders.find(so => so._id.toString() == assignment.shopOrderId.toString())


    if (!shopOrder) {
        throw new ApiError(400, "ShopOrder not found")
    }

    let deliveryBoyLocation = { lat: null, lon: null }

    if (assignment?.assignedTo?.location?.coordinates?.length == 2) {

        deliveryBoyLocation.lat = assignment.assignedTo.location.coordinates[1]
        deliveryBoyLocation.lon = assignment.assignedTo.location.coordinates[0]
    }

    let customerLocation = { lat: null, lon: null }

    if (assignment.order.deliveryAddress) {
        customerLocation.lat = assignment.order.deliveryAddress.latitude
        customerLocation.lon = assignment.order.deliveryAddress.longitude

    }


    return {
        _id: assignment.order._id,
        user: assignment.order.user,
        shopOrder,
        deliveryAddress: assignment.order.deliveryAddress,
        deliveryBoyLocation,
        customerLocation
    }

}

export const getOrderByIdService = async (orderId) => {

    const order = await Order.findById(orderId)
        .populate("user")
        .populate({
            path: "shopOrders.shop",
            model: "Shop"
        })
        .populate({
            path: "shopOrders.assignedDeliveryBoy",
            model: "User"
        })
        .populate({
            path: "shopOrders.shopOrderItems.item",
            model: "Item"
        })
        .lean()

    if (!order) {
        throw new ApiError(400, "order not found")
    }

    return order
}

export const sendDeliveryOtpService = async (orderId, shopOrderId) => {

    if (!orderId || !shopOrderId) {
        throw new ApiError(400, "Invalid orderId/shopOrderId")
    }

    const order = await Order.findById(orderId).populate("user")
    if (!order) {
        throw new ApiError(400, "Order not found")
    }

    const shopOrder = order.shopOrders.id(shopOrderId)

    if (!shopOrder) {
        throw new ApiError(400, "ShopOrder not found")
    }

    const otp = crypto.randomInt(100000, 999999).toString()


    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex")

    const email = order.user.email

    await order.save()
    await sendDeliveryOTPMail(otp, email)

    // store otp in cache
    await redisClient.setEx(`deliveryOtp:${orderId}:${shopOrderId}`, 300, hashedOtp)

}

export const verifyDeliveryOtpService = async (orderId, shopOrderId, otp) => {

    if (!orderId || !shopOrderId) {
        throw new ApiError(400, "Invalid orderId/shopOrderId")
    }

    const order = await Order.findById(orderId).populate("user")
    if (!order) {
        throw new ApiError(400, "Order not found")
    }

    const shopOrder = order.shopOrders.id(shopOrderId)

    if (!shopOrder) {
        throw new ApiError(400, "ShopOrder not found")
    }

    // check in cache
    const cachedOtp = await redisClient.get(`deliveryOtp:${orderId}:${shopOrderId}`)

    const deliveryBoyId = shopOrder.assignedDeliveryBoy

    const userOtp = crypto.createHash("sha256").update(otp).digest("hex")


    if (!cachedOtp || userOtp !== cachedOtp) {
        throw new ApiError(400, "Invalid OTP")
    }

    shopOrder.status = "delivered"
    shopOrder.deliveredAt = Date.now()

    await order.save()
    await DeliveryAssignment.deleteOne({
        shopOrderId: shopOrder._id,
        order: order._id,
        assignedTo: shopOrder.assignedDeliveryBoy
    })

    // order delivered then update cache
    await redisClient.del(`today:deliveries:${deliveryBoyId}`)
    await redisClient.del(`deliveryOtp:${orderId}:${shopOrderId}`)

}

export const getTodayDeliveriesService = async (deliveryBoyId) => {

    // check in cache
    const cacheKey = `today:deliveries:${deliveryBoyId}`
    const cachedData = await redisClient.get(cacheKey)
    if (cachedData) {
        return JSON.parse(cachedData)
    }
    // -------------


    const startsOfDay = new Date()
    startsOfDay.setHours(0, 0, 0, 0)

    const orders = await Order.find({
        "shopOrders.assignedDeliveryBoy": deliveryBoyId,
        "shopOrders.status": "delivered",
        "shopOrders.deliveredAt": { $gte: startsOfDay }
    }).lean()

    let todayDeliveries = []

    orders.forEach((order) => {
        order.shopOrders.forEach((shopOrder) => {
            if (shopOrder.assignedDeliveryBoy?.toString() === deliveryBoyId.toString() &&
                shopOrder.status === "delivered" &&
                shopOrder.deliveredAt >= startsOfDay) {
                todayDeliveries.push(shopOrder)
            }
        })
    })

    let stats = {}

    todayDeliveries.forEach((shopOrder) => {
        const hour = new Date(shopOrder.deliveredAt).getHours()

        stats[hour] = (stats[hour] || 0) + 1
    })

    let formattedStats = Object.keys(stats).map(hour => ({
        hour: parseInt(hour),
        count: stats[hour]
    }))

    formattedStats.sort((a, b) => a.hour - b.hour)

    // store in cache
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(formattedStats))

    return formattedStats
}