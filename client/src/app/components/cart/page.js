"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { IoIosArrowRoundBack } from "react-icons/io"
import { useSelector } from "react-redux"
import CartItemCard from "../cartItemCard/page"

export default function CartPage() {
    
    const { userData, cartItems, totalAmount } = useSelector(state => state.user)
    const router = useRouter()

    useEffect(() => {
        if (!userData) {
            router.push("/")
        }

    }, [userData])

    return (
        <div className="min-h-screen bg-[#fff9f6] flex justify-center p-6">

            <div className="w-full max-w-[800px]">

                <div className="flex items-center gap-5 mb-6">

                    <div className="cursor-pointer hover:bg-gray-300 hover:rounded-full z-10" onClick={() => router.push("/")}>
                        <IoIosArrowRoundBack size={35} className="text-[#ff4d2d]" />
                    </div>
                    <h1 className="text-2xl font-bold text-start">Your Cart</h1>
                </div>

                {cartItems?.length == 0 ?
                    <>
                        {/* <p className="text-gray-500 text-lg text-center">Your Cart is Empty.</p> */}
                        <img src="/emptyCart.jpeg" className="h-full mix-blend-darken max-w-full" alt="empty-cart" />
                    </> :
                    (
                        <>
                            <div className="space-y-4">
                                {
                                    cartItems?.map((item, index) => (
                                        <CartItemCard data={item} key={index} />
                                    ))
                                }
                            </div>

                            <div className="mt-6 bg-white p-4 rounded-xl shadow flex justify-between items-center border">
                                <h1 className="text-lg font-semibold">Total Amount </h1>
                                <span className="text-xl font-bold text-[#ff4d2d]">₹{totalAmount}</span>
                            </div>

                            <div className="mt-4 flex justify-end">
                                <button onClick={() => router.push("/components/checkOut")} className="bg-[#ff4d2d]  cursor-pointer text-white px-6 py-3 rounded-lg font-medium active:scale-98 active:bg-gray-400 transition text-lg">Proceed to CheckOut</button>
                            </div>

                        </>
                    )

                }


            </div>
        </div>
    )
}