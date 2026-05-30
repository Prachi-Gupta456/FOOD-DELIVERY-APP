"use client"

import { useSelector } from "react-redux";
import Navbar from "../navbar/page";
import { getCurrentOrder, getDeliveryBoyAssignment, getTodayDeliveries, handleAcceptOrder, sendDeliveryOtp, verifyDeliveryOtp } from "@/app/services/api";
import { useEffect, useState } from "react";
import DeliveryBoyTracking from "../deliveryBoyTracking/page";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { socketInstance } from "@/app/socket";
import { useRouter } from "next/navigation";
import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";


export default function DeliveryBoyDashboard() {

    const { userData } = useSelector(state => state.user)
    const [availableAssignments, setAvailableAsssignments] = useState(null)
    const [currentOrder, setCurrentOrder] = useState()
    const [showOtpBox, setShowOtpBox] = useState(false)
    const [otp, setOtp] = useState("")
    const router = useRouter()
    const [todayDeliveries, setTodayDeliveries] = useState(null)
    const [deliveryBoyLocation, setDeliveryBoyLocation] = useState(null)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")
    const totalEarning = todayDeliveries?.reduce((sum, td) => sum + td.count * 50, 0) || 0

    useEffect(() => {
        if (!userData) return

        if (userData.role !== "deliveryBoy") {
            router.push("/auth/signup")
            return
        }

        getAssignments()
        fetchCurrentOrder()
        handleTodayDeliveries()
    }, [userData?._id])

    useEffect(() => {
        
        socketInstance?.on("new-assignment", (data) => {
            if (data.id == userData?._id) {
                setAvailableAsssignments(prev => [data, ...(prev || [])])
            }
        })

        return () => {
            socketInstance?.off("new-assignment")
        }
    }, [userData?._id])

    useEffect(() => {

        if (!socketInstance || userData?.role !== "deliveryBoy")return;
        
        let watchId;
        let lastUpdated = 0;


        if (navigator.geolocation) {

            watchId = navigator.geolocation.watchPosition((pos) => {

                const now = Date.now()

                if (now - lastUpdated < 5000) return;

                lastUpdated = now

                const { latitude, longitude } = pos.coords

                setDeliveryBoyLocation({ lat: latitude, lon: longitude })

                socketInstance.emit("update-location", {
                    latitude,
                    longitude,
                    userId: userData._id
                });

            }, (error) => { console.log(error) }, { enableHighAccuracy: true }
        )}

        return () => {
            if (watchId) {
                navigator.geolocation.clearWatch(watchId)
            }
        }

    }, [socketInstance,userData?._id])

    const getAssignments = async () => {
        const result = await getDeliveryBoyAssignment()

        if (result.success) {
            setAvailableAsssignments(result.data)
        }
    }

    const fetchCurrentOrder = async () => {
        const result = await getCurrentOrder()

        if (result.success) {
            setCurrentOrder(result.data)
        }

    }

    const acceptOrder = async (assignmentId) => {

        const result = await handleAcceptOrder(assignmentId)

        if (!result.success) {
            toast.warn(result.msg)
            return
        }
        toast.success(result.msg)
        await fetchCurrentOrder()

    }

    const handleSendOtp = async () => {

        setLoading(true)
        setShowOtpBox(true)

        const result = await sendDeliveryOtp({ orderId: currentOrder?._id, shopOrderId: currentOrder?.shopOrder?._id })

        if (result.success) {
            toast.success(result.msg)
        }

        setLoading(false)
    }

    const verifyOtp = async () => {

        const result = await verifyDeliveryOtp({ orderId: currentOrder?._id, shopOrderId: currentOrder?.shopOrder?._id, otp })

        if (result.success) {
            setMessage(result.msg)
            location.reload()
        }

    }

    const handleTodayDeliveries = async () => {

        const result = await getTodayDeliveries()

        if (result.success) {
            setTodayDeliveries(result.data)
        }

    }


    return (
        <div className="w-screen min-h-screen flex flex-col gap-5 items-center bg-[#fff9f6] overflow-y-auto">
            <Navbar />

            <div className="w-full max-w-[800px] flex flex-col gap-5 items-center">

                <div className="bg-white rounded-2xl shadow-md p-5 flex flex-col  justify-start items-center 
                w-[90%] border border-orange-100 text-center gap-2">

                    <h1 className="text-xl font-bold text-[#ff4d2d]">Welcome, {userData?.fullName}</h1>
                    <p className="text-[#ff4d2d]">
                        <span className="font-semibold">Latitude: </span>{deliveryBoyLocation?.lat},
                        <span className="font-semibold">Longitude: </span>{deliveryBoyLocation?.lon}
                    </p>
                </div>


                {/* Today Deliveries */}
                {
                    todayDeliveries?.length > 0 && (

                        <div className="bg-white rounded-2xl shadow-md p-5 w-[90%] mb-6 border border-orange-100">

                            <h1 className="text-lg font-bold mb-3 text-[#ff4d2d]">Today Deliveries</h1>

                            {/* Bar chart */}
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={todayDeliveries}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="hour" tickFormatter={(h) => `${h}:00`} />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip formatter={(value) => [value, "orders"]} labelFormatter={(label) => `${label}:00`} />
                                    <Bar dataKey="count" fill="#ff4d2d" />
                                </BarChart>
                            </ResponsiveContainer>

                            <div className="max-w-sm mx-auto mt-6 p-6 bg-white rounded-2xl shadow-lg text-center">

                                <h1 className="text-xl font-semibold text-gray-800 mb-2">Today's Earning</h1>
                                <span className="text-3xl font-bols text-green-600">₹{totalEarning}</span>

                            </div>

                        </div>


                    )
                }
                {/* ----------- */}


                {/* Available orders */}
                {
                    !currentOrder &&
                    <div className="bg-white rounded-2xl p-5 shadow-md w-[90%] border border-orange-100">

                        <h1 className="text-lg font-bold mb-4 flex items-center gap-2">Available Orders</h1>


                        <div className="space-y-4">
                            {
                                availableAssignments?.length > 0 ?
                                    (
                                        availableAssignments.map((a, index) => (
                                            <div className="border rounded-lg p-4 flex justify-between items-center" key={index}>
                                                <div>
                                                    <p className="text-sm text-gray-500">{a?.shopName}</p>
                                                    <p className="text-sm text-gray-500"><span className="font-semibold">Delivery Address: </span>{a?.deliveryAddress?.text}</p>
                                                    <p className="text-xs text-gray-400">{a?.items.length} item | {a.subtotal}</p>
                                                </div>

                                                <button className="cursor-pointer bg-orange-500 text-white px-4 py-3 rounded-lg text-sm
                                            hover:bg-amber-600" onClick={() => acceptOrder(a.assignmentId)}>Accept</button>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-400 text-sm">No Available Orders</p>
                                    )
                            }
                        </div>

                    </div>
                }
                {/* ------------------ */}

                {currentOrder &&
                    <div className="bg-white rounded-2xl p-5 shadow-md w-[90%] border border-orange-100">

                        <h2 className="text-lg font-bold mb-3">Current Order</h2>

                        <div className="border rounded-lg p-4 mb-3">
                            <p className="text-xs text-gray-500 font-semibold">{currentOrder?.shopOrder?.shop?.name}</p>
                            <p className="text-xs text-gray-400">{currentOrder?.deliveryAddress?.text}</p>
                            <p className="text-xs text-gray-400">{currentOrder?.shopOrder?.shopOrderItems?.length} items
                                | {currentOrder?.shopOrder?.subtotal}
                            </p>
                        </div>

                        <DeliveryBoyTracking data={{
                            deliveryBoyLocation: deliveryBoyLocation || {

                                lat: userData?.location?.coordinates?.[1],
                                lon: userData?.location?.coordinates?.[0]
                            },
                            customerLocation: {
                                lat: currentOrder?.deliveryAddress?.latitude,
                                lon: currentOrder?.deliveryAddress?.longitude
                            }
                        }} />

                        {
                            !showOtpBox ?

                                <button disabled={loading} onClick={handleSendOtp} className="mt-4 w-full bg-green-500 text-white font-semibold px-4 py-2
                                  rounded-xl shadow-md hover:bg-green-600 cursor-pointer active:scale-95 transition-all duration-200">
                                    {loading ? <ClipLoader size={20} color="white" /> : "Mark As Delivered"}
                                </button> :

                                <div className="mt-4 p-4 border rounded-xl bg-gray-50">

                                    <p className="text-sm font-semibold mb-2">Enter OTP send to
                                        <span className="text-orange-500"> {currentOrder?.user?.fullName.charAt(0).toUpperCase() + currentOrder?.user?.fullName.slice(1)}</span>
                                    </p>

                                    <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="" className="w-full border px-3 py-2 rounded-lg mb-3
                                    focus:outline-none focus:ring-2 focus:ring-orange-400"/>

                                    {
                                        message &&
                                        <p className="text-center text-green-400 text-2xl mb-4">{message}</p>
                                    }

                                    <button onClick={verifyOtp} className="bg-orange-500 text-white py-2 rounded-lg font-semibold
                                    hover:bg-orange-600 cursor-pointer  active:scale-95 transition-all p-4" >Submit OTP</button>

                                </div>
                        }

                    </div>
                }

            </div>
        </div >
    )
}