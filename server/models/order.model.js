import mongoose, { Mongoose } from "mongoose"

const shopOrderItemSchema = new mongoose.Schema({
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        required: true
    },
    name: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
}, { timestamps: true })


const shopOrderSchema = new mongoose.Schema({
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shop",
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    subtotal: {
        type: Number
    },
    status: {
        type: String,
        enum: ["pending", "preparing", "out of delivery", "delivered"],
        default: "pending"
    },
    assignment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DeliveryAssignment",
        default: null
    },
    assignedDeliveryBoy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    deliveredAt: {
        type: Date,
        default: null
    },
    shopOrderItems: [shopOrderItemSchema]

}, { timestamps: true })



const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ["cod", "online"]
    },
    deliveryAddress: {
        text: String,
        latitude: Number,
        longitude: Number
    },
    totalAmount: {
        type: Number
    },
    shopOrders: [shopOrderSchema],

    payment: {
        type: Boolean,
        default: false
    },
    razorpayOrderId: {
        type: String,
        default: ""
    },
    razorpayPaymentId: {
        type: String,
        default: ""
    }

}, { timestamps: true })


const Order = mongoose.models.Order || mongoose.model("Order", orderSchema)

export default Order;


// const shopOrderSchema = new mongoose.Schema({
//     shop: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Shop",
//         required: true
//     },
//     owner: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User"
//     },
//     subtotal: {
//         type: Number
//     },
//     status: {
//         type: String,
//         enum: ["pending", "preparing", "out of delivery", "delivered"],
//         default: "pending"
//     },
//     assignment: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "DeliveryAssignment",
//         default: null
//     },
//     assignedDeliveryBoy: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User"
//     },
//     deliveryOtp: {
//         type: String,
//         default: null
//     },
//     otpExpiry: {
//         type: Date,
//         default: null
//     },
//     deliveredAt: {
//         type: Date,
//         default: null
//     },
//     shopOrderItems: [shopOrderItemSchema]

// }, { timestamps: true })
