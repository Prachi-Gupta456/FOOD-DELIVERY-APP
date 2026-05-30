import User from "../models/user.model.js"
import ApiError from './ApiError.js'

export const socketHandler = async (io) => {

    io.on("connection", (socket) => {


        socket.on("identity", async (data) => {

            try {
                const { userId } = data

                const user = await User.findByIdAndUpdate(userId, {
                    socketId: socket.id,
                    isOnline: true
                }, { returnDocument: "after" })

            } catch (error) {
                console.log(error)
            }
        })


        socket.on("disconnect", async () => {

            try {
                console.log("User disconnected: ", socket.id)

                await User.findOneAndUpdate({ socketId: socket.id }, {
                    socketId: null,
                    isOnline: false
                })

            } catch (error) {
                console.log(error)
            }
        })

        socket.on("update-location", async ({ latitude, longitude, userId }) => {
            try {
                const user = await User.findByIdAndUpdate(userId, {
                    location: {
                        type: "Point",
                        coordinates: [longitude, latitude]
                    },
                    isOnline: true,
                    socketId: socket.id
                }, { returnDocument: "after" })

                if (user) {
                    io.emit("updateDeliveryLocation", {
                        deliveryBoyId: userId,
                        latitude,
                        longitude
                    })
                }
            } catch (error) {
                console.log("updateDeliveryLocation error:", error)
            }
        })

    })

}