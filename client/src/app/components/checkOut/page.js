"use client"

import Script from "next/script";
import { useRouter } from "next/navigation";
import { FaMagnifyingGlassLocation, FaMobileScreenButton } from "react-icons/fa6";
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoSearchOutline } from "react-icons/io5";
import { TbCurrentLocation } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import "leaflet/dist/leaflet.css"
import dynamic from "next/dynamic"
import { useMap } from "react-leaflet";
import { fetchLatLng, getLocation, placeOrder, verifyPayment } from "@/app/services/api";
import { setAddress, setLocation } from "@/app/redux/slices/mapSlice";
import { useEffect, useState } from "react";
import { MdDeliveryDining } from "react-icons/md";
import { FaCreditCard } from "react-icons/fa";
import { toast } from "react-toastify";
import { addMyOrder } from "@/app/redux/slices/userSlice";



const MapContainer = dynamic(
    () => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false }
)

const TileLayer = dynamic(
    () => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false }
)

const Marker = dynamic(
    () => import("react-leaflet").then((mod) => mod.Marker), { ssr: false }
)


function RecenterMap({ location }) {
    if (location.lat && location.lon) {
        const map = useMap()
        map.setView([location.lat, location.lon], 16, { animate: true })
    }
    return null
}


export default function CheckOut() {

    const router = useRouter()
    const dispatch = useDispatch()
    const [addressInput, setAddressInput] = useState("")
    const { location, address } = useSelector(state => state.map)
    const { cartItems, totalAmount, userData } = useSelector(state => state.user)
    const [paymentMethod, setPaymentMethod] = useState("cod")
    const deliveryFee = totalAmount > 500 ? 0 : 40


    const onDragEnd = async (e) => {
        const { lat, lng } = e.target._latlng
        dispatch(setLocation({ lat, lon: lng }))
        await getAddressByLatLng(lat, lng)

    }

    const getAddressByLatLng = async (lat, lng) => {
        const result = await getLocation(lat, lng)
        dispatch(setAddress(result.address_line2))

    }

    const getCurrentLocation = async () => {
        const latitude = userData?.location?.coordinates?.[1]
        const longitude = userData?.location?.coordinates?.[0]

        dispatch(setLocation({ lat: latitude, lon: longitude }))
        getAddressByLatLng(latitude, longitude)
    }

    const getLatLngByAddress = async () => {
        const result = await fetchLatLng(addressInput)
        const { lat, lon } = result
        dispatch(setLocation({ lat, lon }))
    }

    const handlePlaceOrder = async () => {

        const data = {
            deliveryAddress: {
                text: addressInput,
                latitude: location.lat,
                longitude: location.lon
            },
            paymentMethod,
            cartItems
        }

        const result = await placeOrder(data)

        if (!result.success) {
            toast.error("Net Banking is currently unavailable.Please use cod.")
            return
        }

        if (paymentMethod == "cod") {
            dispatch(addMyOrder(result.order))
            router.push("/components/order-placed")
        } else {
            const { orderId, razorOrder } = result
            openRazorpayWindow(orderId, razorOrder)
        }


    }

    const openRazorpayWindow = (orderId, razorOrder) => {


        if (!window.Razorpay) {
            toast.error("Razorpay SDK failed to load")
            return
        }

        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: razorOrder.amount,
            currency: "INR",
            name: "SwadSutra",
            description: "Food Delivery Website",
            order_id: razorOrder.id,
            handler: async function (response) {

                const result = await verifyPayment({
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_signature: response.razorpay_signature,
                    orderId
                })

                if (!result.success) {
                    toast.warn("Payment verification failed")
                    return
                }
                dispatch(addMyOrder(result.order))
                router.push("/components/order-placed")

            }

        }
        const rzp = new window.Razorpay(options)
        rzp.open()
    }


    useEffect(() => {
        setAddressInput(address ?? "")
    }, [address])

    useEffect(() => {
        const loadLeaflet = async () => {
            const L = await import("leaflet")

            delete L.Icon.Default.prototype._getIconUrl

            L.Icon.Default.mergeOptions({
                iconRetinaUrl:
                    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
                iconUrl:
                    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
                shadowUrl:
                    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
            })
        }

        loadLeaflet()
    }, [])


    return (
        <>
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />

            <div className="min-h-screen bg-[#fff9f6] flex items-center justify-center p-6">

                <div onClick={() => router.push("/")} className="absolute top-5 left-5 z-[10]">
                    <IoIosArrowRoundBack size={35} className="text-[#ff4d2d]" />
                </div>

                <div className="w-full max-w-[900px] bg-white rounded-2xl shadow-xl p-6 space-y-6">

                    {/* heading */}
                    <h1 className="text-2xl font-bold text-gray-800">Checkout</h1>

                    {/* Map Section*/}
                    <section>
                        <h2 className="text-lg font-semibold mb-2 flex items-center gap-2 text-gray-800"><FaMagnifyingGlassLocation className="text-[#ff4d2d]" />Delivery Location</h2>

                        {/* input box for delivery address */}
                        <div className="flex gap-2 mb-3">

                            <input type="text" onChange={(e) => setAddressInput(e.target.value)} value={addressInput || ""} className="flex-1 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none
                        focus:ring-2 focus:ring-[#ff4d2d]" placeholder="Enter your delivery address" />

                            <button onClick={getLatLngByAddress} className="bg-[#e64526] cursor-pointer active:scale-95 active:bg-red-800 hover:bg-[#e64526]
                         text-white px-3 py-2 rounded-lg flex items-center justify-center"><IoSearchOutline size={17} /></button>

                            <button onClick={getCurrentLocation} className="bg-blue-500 cursor-pointer active:scale-95 hover:bg-blue-600 active:bg-blue-800
                         text-white px-3 py-2 rounded-lg flex items-center justify-center"><TbCurrentLocation size={17} /></button>

                        </div>
                        {/* ---------------------------- */}

                        {/* map */}
                        <div className="rounded-xl border overflow-hidden">
                            <div className="h-64 w-full flex items-center justify-center">

                                {location?.lat && location?.lon ? (

                                    <MapContainer className="w-full h-full"
                                        center={[location?.lat, location?.lon]} zoom={16}>

                                        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                                        <RecenterMap location={location} />
                                        {/* Marker */}
                                        <Marker position={[location?.lat, location?.lon]} draggable eventHandlers={{ dragend: onDragEnd }} />

                                    </MapContainer>
                                ) : (
                                    <p>Loading map...</p>
                                )}


                            </div>

                        </div>
                        {/* ----------- */}

                    </section>
                    {/* ------------- */}

                    {/* Payment Section */}

                    {/* cod */}
                    <section>
                        <h2 className="text-lg font-semibold mb-3 text-gray-800">Payment Method</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                            {/* Cash on Delivery */}
                            <div onClick={() => setPaymentMethod("cod")} className={`flex items-center cursor-pointer gap-3 rounded-xl border p-4 text-left transition
                         ${paymentMethod === "cod" ? "border-[#ff4d2d] bg-orange-50 shadow" : "border-gray-200 hover:border-gray-300"}`}>
                                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                                    <MdDeliveryDining className="text-green-600 text-xl" />
                                </span>
                                <div>
                                    <p className="font-medium text-gray-800">Cash On Delivery</p>
                                    <p className="text-xs text-gray-500">Pay when your food arrives</p>
                                </div>
                            </div>
                            {/* ------------------ */}

                            {/* Online ------ */}
                            <div onClick={() => setPaymentMethod("online")} className={`cursor-pointer flex items-center gap-3 rounded-xl border p-4 text-left transition 
                            ${paymentMethod === "online" ? "border-[#ff4d2d] bg-orange-50 shadow" : "border-gray-200 hover:border-gray-300"}`}>

                                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full
                             bg-purple-100"><FaMobileScreenButton className="text-purple-700 text-lg" />
                                </span>

                                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full
                             bg-blue-100"><FaCreditCard className="text-blue-700 text-lg" />
                                </span>

                                <div>
                                    <p className="font-medium text-gray-800">UPI / Credit / Debit Card</p>
                                    <p className="text-xs text-gray-500">Pay Securely Online</p>
                                </div>

                            </div>
                            {/* -------------- */}

                        </div>



                    </section>
                    {/* --------------- */}

                    {/* online */}
                    <section>
                        <h2 className="text-lg font-semibold mb-3 text-gray-800">Order Summary</h2>
                        <div className="rounded-xl border bg-gray-50 p-4 space-y-2">
                            {
                                cartItems.map((item, index) => (
                                    <div key={index} className="flex justify-between text-sm text-gray-700">
                                        <span>{item.name} x {item.quantity}</span>
                                        <span>₹{item.price * item.quantity}</span>
                                    </div>
                                ))
                            }

                            <hr className="border-gray-200 my-2" />

                            <div className="flex justify-between font-medium text-gray-800">
                                <span>Subtotal</span>
                                <span>₹{totalAmount}</span>
                            </div>

                            <div className="flex justify-between text-gray-700">
                                <span>Delivery Fee</span>
                                <span>₹{deliveryFee == 0 ? "Free" : deliveryFee}</span>
                            </div>

                            <div className="flex justify-between text-lg text-[#ff4d2d] font-bold">
                                <span>Total</span>
                                <span>₹{deliveryFee + totalAmount}</span>
                            </div>

                        </div>

                    </section>

                    <button onClick={handlePlaceOrder} className="w-full cursor-pointer bg-[#ff4d2d] hover:bg-[#e65426] text-white py-3 
                rounded-xl font-semibold">{paymentMethod == "cod" ? "Place Order" : "Pay & Place Order"}</button>


                </div>

            </div>
        </>
    )
}

