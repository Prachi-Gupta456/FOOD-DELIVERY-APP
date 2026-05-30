"use client"
import { deleteFood } from "@/app/services/api";
import { useRouter } from "next/navigation";
import { FaPen, FaTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";

export default function OwnerItemCard({ data }) {

    const router = useRouter()

    const handleDeleteItem = async (itemId) => {

        if (window.confirm("Are you sure you want to delete this item?")) {
            const result = await deleteFood(itemId)
            if (result.success) {
                toast.success("Item removed successfully.")
            } else {
                toast.warn("Try after some time.")
            }
        }

        router.push("/")

    }

    return (

        <div className="flex bg-white rounded-lg shadow-md overflow-hidden border hover:shadow-2xl hover:scale-102 transition-all border-[#ff4d2d] w-full max-w-2xl">

            <div className="w-36 h-full flex-shrink-0 bg-gray-50">

                {data?.image ?
                    <img src={data?.image} alt="Food-item image" className="w-full h-full object-cover" /> :
                    <p>Loading..</p>
                }

            </div>

            <div className="flex flex-col justify-between p-3 flex-1">

                <h2 className="text-base font-semibold text-[#ff4d2d]">{data?.name?.charAt(0).toUpperCase() + data?.name?.slice(1)}</h2>
                <p><span className="font-medium text-gray-70">Category:</span> {data?.category}</p>
                <p><span className="font-medium text-gray-70">Food Type:</span> {data?.foodType}</p>

                <div className="flex items-center justify-between">

                    <div className="text-[#ff4d2d] font-bold">₹{data?.price}</div>

                    <div className="flex items-center gap-2">

                        <div onClick={() => handleDeleteItem(data?._id)} className="p-2 cursor-pointer rounded-full hover:bg-[#ff4d2d]/10 text-[#ff4d2d]">
                            <FaTrashAlt size={16} />
                        </div>

                        <div className="p-2 cursor-pointer rounded-full hover:bg-[#ff4d2d]/10 text-[#ff4d2d]"
                            onClick={() => router.push(`/components/editFoodItem/${data?._id}`)}>
                            <FaPen size={16} />
                        </div>


                    </div>

                </div>

            </div>

        </div>

    )
}