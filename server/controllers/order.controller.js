import {
    acceptOrderService, getCurrentOrderService, getDeliveryBoyAssignment,
    getMyOrderService, getOrderByIdService, getTodayDeliveriesService, placeOrderService, sendDeliveryOtpService,
    updateOrderService, verifyDeliveryOtpService, verifyPaymentService
} from "../services/order.service.js"

export const placeOrder = async (req, resp, next) => {
    try {
        const io = req.app.get("io")
        const { cartItems, paymentMethod, deliveryAddress } = req.body
        const order = await placeOrderService(cartItems, paymentMethod, deliveryAddress, req.userId, io)

        resp.status(201).json({
            success: true,
            msg: "Order Placed Successfully",
            order
        })
    } catch (error) {
        next(error)
    }
}

export const verifyPayment = async (req, resp, next) => {
    try {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature, orderId } = req.body
        const order = await verifyPaymentService(razorpay_payment_id, razorpay_order_id, razorpay_signature, orderId, req.app.get("io"))

        resp.status(200).json({
            success: true,
            msg: "Payment verified successfully",
            order
        })
    } catch (error) {
        next(error)
    }
}

export const getMyOrders = async (req, resp, next) => {
    try {

        const orders = await getMyOrderService(req.userId)

        resp.status(201).json({
            success: true,
            msg: "Orders fetched Successfully",
            orders
        })
    } catch (error) {
        next(error)
    }
}

export const updateOrder = async (req, resp, next) => {
    try {

        const { shopId, orderId } = req.params
        const { status } = req.body

        const data = await updateOrderService(shopId, orderId, status, req.app.get("io"))

        resp.status(200).json({
            data
        })
    } catch (error) {
        next(error)
    }
}

export const getAssignments = async (req, resp, next) => {
    try {

        const data = await getDeliveryBoyAssignment(req.userId)

        resp.status(200).json({
            success: true,
            data
        })
    } catch (error) {
        next(error)
    }
}

export const acceptOrder = async (req, resp, next) => {
    try {
        const { assignmentId } = req.params

        const order = await acceptOrderService(assignmentId, req.userId)

        resp.status(200).json({
            success: true,
            msg: "Order accepted",
            order
        })
    } catch (error) {
        next(error)
    }
}

export const getCurrentOrder = async (req, resp, next) => {
    try {

        const data = await getCurrentOrderService(req.userId)

        resp.status(200).json({
            success: true,
            msg: "current order fetched",
            data
        })
    } catch (error) {
        next(error)
    }
}

export const getOrderById = async (req, resp, next) => {
    try {

        const { orderId } = req.params
        const order = await getOrderByIdService(orderId)

        resp.status(200).json({
            success: true,
            msg: "Order fetched from id",
            order
        })

    } catch (error) {
        next(error)
    }
}

export const sendDeliveryOtp = async (req, resp, next) => {
    try {

        const { orderId, shopOrderId } = req.body
        await sendDeliveryOtpService(orderId, shopOrderId)

        resp.status(200).json({
            success: true,
            msg: "OTP sent successfully"
        })

    } catch (error) {
        next(error)
    }
}

export const verifyDeliveryOtp = async (req, resp, next) => {
    try {

        const { orderId, shopOrderId, otp } = req.body
        await verifyDeliveryOtpService(orderId, shopOrderId, otp)

        resp.status(200).json({
            success: true,
            msg: "Order delivered successfully"
        })

    } catch (error) {
        next(error)
    }
}

export const getTodayDeliveries = async (req, resp, next) => {
    try {

        const data = await getTodayDeliveriesService(req.userId)

        resp.status(200).json({
            success: true,
            msg: "Deliveries fetched successfully",
            data
        })

    } catch (error) {
        next(error)
    }
}