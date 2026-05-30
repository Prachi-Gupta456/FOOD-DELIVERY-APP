"use client"

import { useRouter } from "next/navigation";
import { FaCircleCheck } from "react-icons/fa6";

export default function OrderPlaced() {

    const router = useRouter()

    return (
        <div className="min-h-screen bg-[#fff9f6] flex flex-col justify-center
        items-center text-center px-4 overflow-hidden relative">

            <FaCircleCheck className="text-green-500 text-6xl mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Placed!</h1>

            <div className="flex flex-col items-center p-3">
                <p >Your order has been placed successfully! </p>
               <p>
                    You can check your order status anytime in the <span className="font-semibold text-gray-800">"My Orders"</span> section.</p>
                <p> Thank you for shopping with us! </p>
            </div>

            <button onClick={() => router.push("/components/myorders")} className="bg-[#ff4d2d] cursor-pointer hover:bg-[#e64526] text-white px-6 py-3
            rouunded-lg text-lg font-medium transition">Back to my orders</button>

        </div>
    )
}