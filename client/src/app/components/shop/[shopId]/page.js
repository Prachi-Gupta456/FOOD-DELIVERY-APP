"use client"

import { fetchItemsByShop, searchItems } from "@/app/services/api"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { FaStore, FaUtensils } from "react-icons/fa"
import { FaLocationDot } from "react-icons/fa6"
import FoodCard from "../../foodCard/page"
import { IoIosArrowRoundBack } from "react-icons/io"

export default function Shop() {

    const { shopId } = useParams()
    const router = useRouter()
    const [items, setItems] = useState([])
    const [shop, setShop] = useState(null)


    useEffect(() => {

        const fetchItems = async () => {

            const result = await fetchItemsByShop(shopId)
            console.log(result)
            if (!result.success) {
                router.push("/")
            }
            setItems(result.data.items)
            setShop(result.data.shop)
        }
        fetchItems()
    }, [shopId])


    return (
        <div className="min-h-screen bg-gray-50">
            <div className="absolute top-4 left04 z-[20]  
              flex items-center bg-black/50 hover:bg-black/70 px-3 py-2 transition
              cursor-pointer" onClick={() => router.push("/")}>
                <IoIosArrowRoundBack size={35} className="text-[#ff4d2d]" />
            </div>


            {
                shop &&
                <div className="relative w-full h-64 md:h-80 lg:h-96">

                    {/* shop image */}
                    <img src={shop.image} alt="shop-image" className="w-full h-full object-cover" />

                    <div className="absolute inset-0 bg-gradientt-to-b from-black/70
                 to-black/30 flex flex-col justify-center items-center text-center px-4">

                        {/* shop icon */}
                        <FaStore className="text-white text-4xl mb-3 drop-shadow-md" />

                        {/* shop name */}
                        <h1 className="text-3xl md:text-5xl font-extrabold text-white
                         drop-shadow-lg">{shop.name}</h1>

                        <div className="flex items-center gap-[10px]">

                            {/* location icon */}
                            <FaLocationDot size={22} color="red" />

                            {/* shop address */}
                            <p className="text-lg font-medium text-gray-200 mt-[10px]">
                                {shop.address} </p>

                        </div>

                    </div>
                </div>
            }

            <div className="max-w-7xl mx-auto px-6 py-10">

                <h2 className="flex items-center justify-center gap-3 text-3xl font-bold
                mb-10 text-gray-800"><FaUtensils color="red" />Our Menu</h2>

                {/* Menu  */}
                {items.length > 0 ? (
                    <div className="flex flex-wrap justify-center gap-8">
                        {items.map((item, index) => (
                            <FoodCard data={item} key={index} />
                        ))}
                    </div>
                ) : <p className="text-center text-gray-500 text-lg">No Items Available</p>}


            </div>

        </div>
    )
}