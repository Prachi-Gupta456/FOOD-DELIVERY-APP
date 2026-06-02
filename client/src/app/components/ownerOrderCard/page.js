"use client"
import { updateOrderStatus } from "@/app/redux/slices/userSlice";
import { updateOrder } from "@/app/services/api";
import {useState } from "react";
import { MdPhone } from "react-icons/md";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

export default function OwnerOrderCard({ data }) {

    const dispatch = useDispatch()
    const [availableBoys, setAvailableBoys] = useState([])

    const handleUpdateStatus = async (orderId, shopId, status) => {

        const result = await updateOrder(shopId, orderId, { status })
        
        if (result.success) {
            dispatch(updateOrderStatus({ shopId, orderId, status: result.shopOrder.status }))
            setAvailableBoys(result.availableBoys)
        }

    }

    return (
        <div className="bg-white rounded-lg shadow p-4 space-y-4">

            {/* Owner Info */}
            <div>
                <h2 className="text-lg font-semibold text-gray-800">{data?.user?.fullName}</h2>
                <p className="text-sm text-gray-500">{data?.user?.email}</p>
                <p className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <MdPhone /> <span>{data?.user?.contact}</span> </p>

                {data?.paymentMethod == "online" ?
                    <p className="gap-2 text-sm font-semibold text-gray-600">Payment: {data?.payment ? "Paid" : "Pending"}</p> :
                    <p className="gap-2 text-sm font-semibold text-gray-600">Payment Method: {data?.paymentMethod || ""}</p>
                }
            </div>
            {/* -------- */}

            {/* Address */}
            <div className="flex items-start flex-col gap-2 text-gray-600 text-sm">
                <p>{data?.deliveryAddress?.text}</p>
                <p className="text-xs text-gray-500">Lat: {data?.deliveryAddress?.latitude} , Lon: {data?.deliveryAddress?.longitude}</p>
            </div>
            {/* -------- */}

            {/* Items */}
            <div className="flex space-x-4 overflow-x-auto pb-2">
                {
                    data?.shopOrders?.shopOrderItems?.map((item, index) => (
                        <div key={index} className="shrink-0 w-40 border rounded-lg p-2 bg-white">
                            <img src={item?.item?.image} alt="item-image" className="w-full h-24 object-cover rounded" />
                            <p className="text-sm font-semibold mt-1">{item?.name}</p>
                            <p className="text-xs text-gray-500">Qty : {item?.quantity} X ₹{item?.price}</p>
                        </div>
                    )
                    )
                }
            </div>
            {/* ------- */}

            {/* status */}

            <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-100">

                <span className="text-sm font-semibold text-gray-500">Status:
                    <span className="font-semibold capitalize text-[#ff4d2d]"> {data?.shopOrders?.status}</span>
                </span>

                <select disabled={data?.shopOrders?.status === "out of delivery"} value={data?.shopOrders?.status}
                    onChange={(e) => handleUpdateStatus(data?._id, data?.shopOrders?.shop?._id, e.target.value)}
                    className="cursor-pointer rounded-md border px-3 py-1 text-sm focus:outline-none focus:ring-2 border-[#ff4d2d]">

                    <option value="pending">Pending</option>
                    <option value="preparing">Preparing</option>
                    <option value="out of delivery">Out of Delivery</option>

                </select>
            </div>
            {/* ------- */}


            {data?.shopOrders?.status == "out of delivery" &&
                <div className="mt-3 p-2 border rounded-lg text-sm bg-orange-50">


                    {availableBoys.length > 0 ? (
                        availableBoys.map((b, index) => (
                            <div key={index} className="flex flex-col gap-1">
                                
                                    <p className="font-semibold">Available Delivery Boys:</p>
                                    <div className="text-gray-600 font-semibold">{b.fullName}-{b.contact}</div>
                                </div>

                    
                        ))
                    ) :
                        <div>Waiting for delivery boy to accept...</div>
                    }
                </div>
            }

            <div className="text-right font-bold text-gray-800 text-sm">
                Total: ₹{data?.shopOrders?.subtotal}
            </div>
        </div>

    )
}

