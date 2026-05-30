import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String
    },
    contact: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["owner", "deliveryBoy", "user"],
        required: true
    },
   
    isOtpVerified: {
        type: Boolean,
        default: false
    },
  
    location: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },
        coordinates: {
            type: [Number],
            default: [0, 0]
        }
    },
    socketId:{
        type:String
    },
    isOnline:{
        type:Boolean
    }
}, { timestamps: true })

userSchema.index({ location: "2dsphere" })
const User = mongoose.models.User || mongoose.model("User", userSchema)

export default User;



// const userSchema = new mongoose.Schema({
//     fullName: {
//         type: String,
//         required: true
//     },
//     email: {
//         type: String,
//         required: true
//     },
//     password: {
//         type: String
//     },
//     contact: {
//         type: String,
//         required: true
//     },
//     role: {
//         type: String,
//         enum: ["owner", "deliveryBoy", "user"],
//         required: true
//     },
//     resetOtp: {
//         type: String
//     },
//     isOtpVerified: {
//         type: Boolean,
//         default: false
//     },
//     otpExpiry: {
//         type: Date
//     },
//     location: {
//         type: {
//             type: String,
//             enum: ["Point"],
//             default: "Point"
//         },
//         coordinates: {
//             type: [Number],
//             default: [0, 0]
//         }
//     },
//     socketId:{
//         type:String
//     },
//     isOnline:{
//         type:Boolean
//     }
// }, { timestamps: true })

