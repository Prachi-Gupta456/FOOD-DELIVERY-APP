"use client"
import { addToCart } from "@/app/redux/slices/userSlice"
import { useState } from "react"
import { FaDrumstickBite, FaLeaf, FaMinus, FaPlus, FaRegStar, FaShoppingCart, FaStar } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"


export default function FoodCard({ data }) {

    const [quantity, setQuantity] = useState(0)
    const dispatch = useDispatch()
    const { cartItems } = useSelector(state => state.user)

    const renderStars = (rating) => {
        const stars = []

        for (let i = 1; i <= 5; i++) {
            stars.push((i <= rating) ? (<FaStar className="text-yellow-500 text-lg" key={i} />) : (<FaRegStar className="text-yellow-500 text-lg" key={i} />))
        }

        return stars;
    }

    const handleCart = (item) => {

        if (quantity > 0) {
            const cartItem = {
                id: item._id,
                name: item.name,
                price: item.price,
                image: item.image,
                shop: item.shop,
                quantity: quantity,
                foodType: item.foodType
            }

            dispatch(addToCart(cartItem))
            setQuantity(0)
        }

    }

    return (

        <div className="group w-[250px] rounded-2xl border-2 border-[#ff4d2d] bg-white
        shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">

            <div className="cursor-grab relative w-full h-[170px] flex justify-center items-center bg-white">

                <div className="opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 absolute top-3 right-3 bg-white rounded-full p-1 shadow z-50">
                    {data?.foodType == "veg" ? <FaLeaf size={20} className="text-green-600 text-lg" /> :
                        <FaDrumstickBite size={20} className="text-red-600 text-lg" />
                    }
                </div>

                {data?.image && <img src={data.image} alt="item-image" className="object-cover transition-transform duration-300 hover:scale-105" />}

            </div>

            <div className="flex flex-1 flex-col p-4">
                <h1 className="font-semibold text-gray-900 text-base truncate">{data?.name?.charAt(0).toUpperCase() + data?.name?.slice(1)}</h1>

                <div className="flex items-center gap-1 mt-1">
                    {renderStars(data?.rating?.average || 0)}
                    <span className="text-sm font-medium text-gray-500">{data?.rating?.count || 0}</span>
                </div>

            </div>

            <div className="flex items-center justify-between mt-auto p-4">

                <span className="font-bold text-gray-900 text-lg">{data?.price}</span>

                <div className="flex items-center border rounded-full overflow-hidden shadow-sm">

                    {/* Minus Button */}
                    <button onClick={() => setQuantity(prev => prev > 0 ? prev - 1 : prev)} className="cursor-pointer active:scale-95 px-2 py-1 hover:bg-gray-100 transition">
                        <FaMinus size={12} />
                    </button>
                    <span>{quantity}</span>

                    {/* Plus Button */}
                    <button onClick={() => setQuantity(prev => prev + 1)} className="cursor-pointer active:scale-95 px-2 py-1 hover:bg-gray-100 transition">
                        <FaPlus size={12} />
                    </button>

                    {/* Shopping Cart Button */}
                    <button onClick={() => handleCart(data)} className={`cursor-pointer bg-[#ff4d2d] active:scale-98 text-white px-3 py-2 transition-colors
                         ${cartItems.some(item => item.id == data?._id) ? "bg-gray-800" : "bg-[#ff4d2d]"}`}>
                        <FaShoppingCart size={16} />
                    </button>


                </div>

            </div>

        </div >
    )
}