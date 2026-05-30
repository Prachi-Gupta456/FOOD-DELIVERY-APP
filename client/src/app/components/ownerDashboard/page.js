"use client"

import { useRouter } from "next/navigation";
import Navbar from "../navbar/page";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { FaPen, FaUtensils } from "react-icons/fa";
import OwnerItemCard from "../OwnerItemCard/page";


export default function OwnerDashboard() {

    const { userData } = useSelector(state => state.user)
    const { shopData } = useSelector(state => state.owner)
    const router = useRouter()


   useEffect(() => {

        if (!userData )return;
        
        if(userData.role !== "owner") {
            router.push("/auth/signup")
            return
        }
    }, [userData?._id])


    return (
        <div className="w-screen min-h-screen pt-2 flex flex-col items-center bg-[#fff9f6]">
            <Navbar />

            {!shopData &&
                <div className="flex justify-center items-center p-4 sm:p-6 hover:z-10">
                    <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border
                border-gray-100 hover:shadow-xl transition-shadow duration-300">


                        <div className="flex flex-col items-center text-center">
                            <FaUtensils className="text-[#ff4d2d] w-16 h-16 sm:w-20 mb-4" />
                            <h2 className="text-xl sm:text-2xl font-bols text-gray-800 mb-2">Add Your Restaurant</h2>
                            <p className="text-gray-600 mb-4 text-sm sm:text-base">
                                Join our food delivery platform and reach more customers faster than ever. Grow your restaurant business with easy order management and reliable delivery support.
                            </p>

                            <button className="bg-[#ff4d2d] cursor-pointer text-white px-5 py-2 rounded-full
                        font-medium hover:bg-orange-600 transition-colors duration-200"
                                onClick={() => router.push("/components/saveShop")}>Get Started</button>

                        </div>

                    </div>
                </div>
            }

            {
                shopData &&
                <div className="w-full flex flex-col items-center gap-6 px-4 sm:px-6 cursor-pointer">

                    <h1 className="text-2xl sm:text-3xl text-gray-900 flex items-center gap-3 mt-8 text-center">
                        <FaUtensils className="text-[#ff4d2d] w-14 h-14" />
                        Welcome to {shopData.name}
                    </h1>

                    <div className="bg-white shadow-lg rounded-xl overflow-hidden border-orange-100
                        hover:shadow-2xl transition-all duration-300 w-full max-w-3xl relative">

                        <div onClick={() => router.push("/components/saveShop")} className="absolute top-4 right-4 bg-[#ff4d2d] text-white p-2 rounded-full shadow-md
                             hover:bg-orange-600 transition-colors cursor-pointer">
                            <FaPen />
                        </div>

                        <img src={shopData.image} alt={shopData.name} className="w-full h-48 sm:h-64 object-cover" />

                        <div className="p-4 sm:p-6">
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">{shopData.name}</h1>
                            <p className="text-gray-500">{shopData.city},{shopData.state}</p>
                            <p className="text-gray-500 mb-4">{shopData.address}</p>
                        </div>

                    </div>

                    {shopData?.items?.length == 0 &&
                        <div className="flex justify-center items-center p-4 sm:p-6">

                            <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border
                border-gray-100  hover:scale-102 hover:shadow-2xl transition-all duration-500 ease-out transition-shadow duration-300">

                                <div className="flex flex-col items-center text-center">
                                    <FaUtensils className="text-[#ff4d2d] w-16 h-16 sm:w-20 mb-4" />
                                    <h2 className="text-xl sm:text-2xl font-bols text-gray-800 mb-2">Add Your Food Item</h2>
                                    <p className="text-gray-600 mb-4 text-sm sm:text-base">
                                        Add your delicious food items and showcase your menu to hungry customers nearby. Upload your dishes easily, attract more orders, and grow your food business faster.
                                    </p>

                                    <button className="bg-[#ff4d2d] cursor-pointer text-white px-5 py-2 rounded-full
                        font-medium hover:bg-orange-600 transition-colors duration-200"
                                        onClick={() => router.push("/components/addFood")}>Add Food</button>

                                </div>

                            </div>
                        </div>
                    }

                    {
                        shopData.items.length > 0 &&
                        <div className="flex flex-col items-center gap-4 w-full max-w-3xl pb-5">{
                            shopData.items.map((item, index) => (
                                <OwnerItemCard data={item} key={index} />
                            ))
                        }</div>
                    }

                </div>

            }

        </div>
    )
}