"use client"
import { getOrderById } from "@/app/services/api"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { IoIosArrowRoundBack } from "react-icons/io"
import DeliveryBoyTracking from "../../deliveryBoyTracking/page"
import { socketInstance } from "@/app/socket"
import { useSelector } from "react-redux"

export default function TrackOrderPage() {

    const { orderId } = useParams()
    const [currentOrder, setCurrentOrder] = useState(null)
    const router = useRouter()
    const { userData } = useSelector(state => state.user)
    const [liveLocation, setLiveLocation] = useState({})

    const handleGetOrder = async () => {
        const result = await getOrderById(orderId)

        if (result.success) {
            setCurrentOrder(result.order)
        }
    }

    useEffect(() => {
        handleGetOrder()
    }, [orderId])

    useEffect(() => {
        socketInstance?.on("updateDeliveryLocation", ({ latitude, longitude, deliveryBoyId }) => {
            setLiveLocation(prev => ({
                ...prev,
                [deliveryBoyId]: { lat: latitude, lon: longitude }
            }))
        })

        return () => {
            socketInstance?.off("updateDeliveryLocation")
        }
    }, [userData?._id])

    return (

        <div className="w-full min-h-screen px-4 md:px-8 lg:px-16 py-6 flex flex-col gap-6 bg-[#fff9f6]">

            <div onClick={() => router.push("/")} className="z-[10] relative flex items-center gap-4 top-5 left-5 mb-[10px]">
                <IoIosArrowRoundBack size={35} className="cursor-pointer text-[#ff4d2d]" />
                <h1 className="text-2xl font-bold md:text-center">Track Order</h1>
            </div>


            {
                currentOrder?.shopOrders?.map((shopOrder, index) => (


                    <div key={index}
                        className="w-full max-w-6xl place-self-center bg-white p-5 rounded-3xl shadow-md border border-orange-100 space-y-5">

                        <div>
                            <p className="text-lg text-[#ff4d2d] font-bold mb-2">{shopOrder?.shop?.name}</p>
                            <p className="font-semibold"> <span>Items: </span>
                                {shopOrder?.shopOrderItems?.map((i => i.name)).join(",")}
                            </p>
                            <p><span className="font-semibold">Subtotal: </span>₹{shopOrder?.subtotal}</p>
                            <p className="mt-6"><span className="font-semibold">Delivery Address: </span>{currentOrder?.deliveryAddress?.text}</p>

                        </div>

                        {shopOrder.status != "delivered" ?
                            <>
                                {
                                    shopOrder?.assignedDeliveryBoy ?
                                        <div className="text-sm text-gray-700">
                                            <p className="font-semibold"><span>Delivery Boy Name: </span>{shopOrder?.assignedDeliveryBoy?.fullName}</p>
                                            <p className="font-semibold"><span>Contact No: </span>{shopOrder?.assignedDeliveryBoy?.contact}</p>

                                        </div> :
                                        <div>
                                            <p className="text-red-600 font-semibold">Delivery Boy is not assigned yet.</p>
                                        </div>
                                }
                            </> :
                            <p className="text-green-600 font-semibold text-lg">Delivered</p>
                        }


                        {(shopOrder?.assignedDeliveryBoy && shopOrder.status !== "delivered") &&
                            <DeliveryBoyTracking data={{
                                deliveryBoyLocation: liveLocation[shopOrder?.assignedDeliveryBoy?._id] || {

                                    lat: shopOrder?.assignedDeliveryBoy?.location?.coordinates?.[1],
                                    lon: shopOrder?.assignedDeliveryBoy?.location?.coordinates?.[0]
                                },
                                customerLocation: {
                                    lat: currentOrder?.deliveryAddress?.latitude,
                                    lon: currentOrder?.deliveryAddress?.longitude
                                }
                            }} />}

                    </div>
                ))
            }
        </div>
    )
}