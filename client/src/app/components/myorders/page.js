"use client"

import { useRouter } from "next/navigation";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import UserOrderCard from "../userOrderCard/page";
import OwnerOrderCard from "../ownerOrderCard/page";
import { useEffect } from "react";
import { socketInstance } from "@/app/socket";
import { setMyOrders, updateRealTimeOrderStatus } from "@/app/redux/slices/userSlice";



export default function MyOrders() {

    const router = useRouter()
    const { userData, myOrders } = useSelector(state => state.user)
    const dispatch = useDispatch()


    useEffect(() => {

        socketInstance?.on("newOrder", (data) => {
            if (data?.shopOrders?.owner?._id == userData?._id) {
                dispatch(setMyOrders([data, ...myOrders]))
            }
        })


        socketInstance?.on("update-order-status", ({ orderId, shopId, status, userId }) => {
            if (userId == userData?._id) {
                dispatch(updateRealTimeOrderStatus({ orderId, shopId, status }))
            }
        })



        return () => {

            socketInstance?.off("newOrder")
            socketInstance?.off("update-order-status")
        }

    }, [userData?._id])


    return (

        <div className="w-full min-h-screen bg-[#fff9f6] flex justify-center px-4">

            <div className="w-full max-w-[800px] p-4">

                <div className="flex items-center gap-5 mb-6">

                    <div className="cursor-pointer z-[10]" onClick={() => router.push("/")}>
                        <IoIosArrowRoundBack size={35} className="text-[#ff4d2d]" />
                    </div>

                    <h1 className="text-2xl font-bold text-start">My Orders</h1>

                </div>

               
                        {
                            myOrders?.length === 0 && (
                            <div className="flex flex-col items-center justify-center mt-10 p-6">

                                <p className="font-semibold text-[#ff4d2d] text-2xl">
                                    No orders yet!
                                </p>

                                <p className="text-gray-500 text-sm mt-2">
                                    Your orders will appear here.
                                </p>

                            </div>
                        )
                    }

                <div className="space-y-6">
                    {
                        myOrders?.map((order, index) => (
                            userData?.role == "user" ? (
                                <UserOrderCard data={order} key={index} />
                            ) :
                                userData?.role == "owner" ? (
                                    <OwnerOrderCard data={order} key={index} />
                                ) : null
                        ))
                    }

                </div>

            </div>
        </div>
    )
}