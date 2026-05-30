"use client"
import { updateItemRating } from "@/app/services/api"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function UserOrderCard({ data }) {

    const router = useRouter()
    const [selectedRating, setSelectedRating] = useState()

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleString('en-GB', {
            day: "2-digit",
        })
    }

    const handleItemRating = async (itemId, rating) => {

        const result = await updateItemRating({ itemId, rating })

        if (result.success) {
            setSelectedRating(prev => ({
                ...prev, [itemId]: result.item.rating.average
            }))
        }
    }


    return (
        <div className="bg-white rounded-lg shadow p-4 space-y-4">

            <div className="flex justify-between border-b pb-2">

                <div>
                    <p className="font-semibold">
                        Order #{data?._id.slice(0, -6)}
                    </p>
                    <p className="text-sm text-gray-50">
                        Date: {formatDate(data?.createdAt)}
                    </p>

                </div>

                <div className="text-right">

                    {data?.paymentMethod == "cod" ? <p className="text-sm font-semibold text-gray-500">Payment Method: {data?.paymentMethod?.toUpperCase()}</p> :
                        <p className="text-sm text-gray-500 font-semibold">Payment: {data?.payment ? "Paid" : "Pending"}</p>}

                    <p className="font-medium text-blue-600">{data?.shopOrders?.[0].status}</p>
                </div>



            </div>

            {/* Shop Orders */}
            {
                data?.shopOrders?.map((shopOrder, index) => (

                    <div className="border rounded-lg p-3 bg-[#fffaf7] space-y-3" key={index}>

                        {/* shop name */}
                        <p>{shopOrder.shop.name}</p>

                        <div className="flex space-x-4 overflow-x-auto pb-2">
                            {
                                shopOrder.shopOrderItems?.map((item, index) => (
                                    <div key={index} className="shrink-0 w-40 border rounded-lg p-2 bg-white">
                                        <img src={item.item.image} alt="item-image" className="w-fullh-24 object-cover rounded" />
                                        <p className="text-sm font-semibold mt-1">{item.name}</p>
                                        <p className="text-xs text-gray-500">Qty : {item.quantity} X ₹{item.price}</p>

                                        {shopOrder.status == "delivered" &&
                                            <div className="flex space-x-1 mt-2">
                                                {
                                                    [1, 2, 3, 4, 5].map((star, index) => (
                                                        <button key={index} className={`cursor-pointer text-lg ${selectedRating?.[item.item._id] >= star ? `text-yellow-400` :
                                                            `text-gray-400`}`} onClick={() => handleItemRating(item.item._id, star)}>★</button>
                                                    ))
                                                }

                                            </div>
                                        }


                                    </div>
                                ))
                            }
                        </div>

                        <div className="flex justify-between items-center border-t pt-2">

                            <p className="font-semibold">Subtotal: ₹{shopOrder?.subtotal}</p>
                            <span className="text-sm font-medium text-blue-600">status: {shopOrder?.status}</span>
                        </div>

                    </div>
                ))
            }
            {/* ----------- */}

            <div className="flex justify-between items-center border-t pt-2">
                <p className="font-semibold">Total: ₹{data?.totalAmount}</p>
                <button onClick={() => router.push(`/components/trackOrder/${data?._id}`)}
                    className="active:bg-[#8d210f] cursor-pointer bg-[#ff4d2d] hover:bg-[#e64526] text-white px-4 
                py-2 rounded-lg text-sm">Track Order</button>
            </div>

        </div>
    )
}