"use client"
import { removeCartItem, updateQuantity } from "@/app/redux/slices/userSlice";
import { CiTrash } from "react-icons/ci";
import { FaMinus, FaPlus } from "react-icons/fa";
import { useDispatch } from "react-redux";

export default function CartItemCard({ data }) {

    const dispatch = useDispatch()

    const handleIncrease = (id, currentQty) => {
            dispatch(updateQuantity({ id, quantity: currentQty + 1 }))
    }

    const handleDecrease = (id, currentQty) => {
         if (currentQty > 1) {
        dispatch(updateQuantity({ id, quantity: currentQty - 1 }))
         }
    }

    const updateCart = (id)=>{
        dispatch(removeCartItem({id}))
    }

    return (
        <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow border">
           
            <div className="flex items-center gap-4">

                {data?.image && <img src={data.image} alt="item-image" className="w-20 h-20 object-cover rounded-lg border" />}
                <div>
                    <h1 className="font-medium text-gray-800">{data?.name}</h1>
                    <p className="text-sm text-gray-500">{data?.price}X{data?.quantity}</p>
                    <p className="font-bold tex/pt-gray-900">₹{data?.price*data?.quantity}</p>
                </div>
            </div>

            <div className="flex items-center gap-3">

                <button onClick={() => handleDecrease(data?.id, data?.quantity)} className="p-2 cursor-pointer bg-gray-100 rounded-full hover:bg-gray-200">
                    <FaMinus size={12} />
                </button>
                <span>{data?.quantity}</span>

                <button onClick={() => handleIncrease(data?.id, data?.quantity)} className="p-2 cursor-pointer bg-gray-100 rounded-full hover:bg-gray-200">
                    <FaPlus size={12} />
                </button>

                <button onClick={() => updateCart(data?.id)} className="cursor-pointer p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200">
                    <CiTrash size={18} />
                </button>

            </div>
        </div>
    )
}