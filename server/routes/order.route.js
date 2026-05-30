import express from "express"
import verifyJwtToken from "../middlewares/verifyJwt.middleware.js"
import {
    acceptOrder, getAssignments, getCurrentOrder, getMyOrders, getOrderById, getTodayDeliveries, placeOrder,
    sendDeliveryOtp, updateOrder, verifyDeliveryOtp, verifyPayment
} from "../controllers/order.controller.js";

const orderRouter = express.Router()

orderRouter.post("/place-order", verifyJwtToken, placeOrder)
orderRouter.post("/verify-payment", verifyJwtToken, verifyPayment)
orderRouter.get("/my-orders", verifyJwtToken, getMyOrders)
orderRouter.get("/get-current-order", verifyJwtToken, getCurrentOrder)
orderRouter.get("/get-assignments", verifyJwtToken, getAssignments)
orderRouter.get("/get-today-deliveries", verifyJwtToken, getTodayDeliveries)
orderRouter.post("/send-delivery-otp", verifyJwtToken, sendDeliveryOtp)
orderRouter.post("/verify-delivery-otp", verifyJwtToken, verifyDeliveryOtp)

orderRouter.post("/update-order/:shopId/:orderId", verifyJwtToken, updateOrder)
orderRouter.get("/accept-order/:assignmentId", verifyJwtToken, acceptOrder)
orderRouter.get("/get-order-by-id/:orderId", verifyJwtToken, getOrderById)


export default orderRouter;