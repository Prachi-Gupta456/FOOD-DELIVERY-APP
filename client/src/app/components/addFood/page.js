"use client"

import { addFood } from "@/app/services/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaUtensils } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { useDispatch } from "react-redux";
import { setShopData } from "@/app/redux/slices/ownerSlice";


export default function AddFood() {

    const router = useRouter()
    const dispatch = useDispatch()

    const [name, setName] = useState("")
    const [category, setCategory] = useState("")
    const [foodType, setFoodType] = useState("")
    const [price, setPrice] = useState(0)
    const [frontendImg, setFrontendImg] = useState(null)
    const [backendImg, setBackendImg] = useState(null)
    const [pending, setPending] = useState(false)


    const handleImage = (e) => {

        const file = e.target.files?.[0]

        if (!file) return;

        if (frontendImg) {
            URL.revokeObjectURL(frontendImg)
        }

        setBackendImg(file)
        setFrontendImg(URL.createObjectURL(file))
    }

    useEffect(() => {

        return () => {
            if (frontendImg) {
                URL.revokeObjectURL(frontendImg)
            }
        }
    }, [frontendImg])

    const handleForm = async (e) => {

        e.preventDefault()
        setPending(true)
        const form = new FormData()

        form.append("name", name)
        form.append("category", category)
        form.append("foodType", foodType)
        form.append("price", price)
        form.append("food-image", backendImg)

        const result = await addFood(form)

        if (!result.success) {
            toast.error("Network Error.")
            setPending(false)
            setName("")
            setCategory("Snacks")
            setFoodType("veg")
            setPrice(0)
            setFrontendImg(null)
            setBackendImg(null)
            return
        }

        dispatch(setShopData(result.shop))
        toast.success(result.msg)
        setPending(false)

        setName("")
        setCategory("")
        setFoodType("")
        setPrice(0)
        setFrontendImg(null)
        setBackendImg(null)

    }


    return (
        <div className="flex justify-center items-center flex-col p-6 
        bg-gradient-to-br from-orange-50 relative to-white min-h-screen">

            <div onClick={() => router.push("/")} className="absolute cursor-pointer top-[20px] left-[20px] z-[10] mb-[10px]">
                <IoIosArrowBack size={35} className="text-[#ff4d2d]" />
            </div>

            <div className="max-w-lg w-full bg-white shadow-xl rounded-2xl p-8 border border-orange-100">

                <div className="flex flex-col items-center mb-6">

                    <div className="bg-orange-100 rounded-full mb-4 p-4">
                        <FaUtensils className="text-[#ff4d2d] h-16 w-16" />
                    </div>

                    <div className="text-3xl font-extrabold text-gray-900">
                        Add Food
                    </div>

                </div>

                {/* form */}
                <form onSubmit={handleForm} className="space-y-5">

                    {/* Food Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input value={name} id="name" type="text" placeholder="Enter Food Name" onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2
                    border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"/>
                    </div>
                    {/* ======== */}

                    {/* Food Image */}
                    <div>
                        <label htmlFor="shop-image" className="block text-sm font-medium text-gray-700 mb-1">Food Image</label>
                        <input id="shop-image" type="file" accept="image/*" onChange={handleImage} className="w-full px-4 py-2 
                    border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"/>
                    </div>

                    {frontendImg &&
                        <div className="mt-4">
                            <img src={frontendImg} alt="Food Image" className="w-full h-48 object-cover rounded-lg border "></img>
                        </div>
                    }
                    {/* ----------- */}

                    {/* Food Type*/}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Food Type</label>
                        <select value={foodType} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none cursor-pointer" value={foodType} onChange={(e) => setFoodType(e.target.value)}>
                            <option value="">Select Food Type</option>
                            <option value="veg">veg</option>
                            <option value="non-veg">non-veg</option>
                        </select>
                    </div>
                    {/* ========== */}

                    {/* Food Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Food Category</label>
                        <select value={category} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none cursor-pointer" value={category} onChange={(e) => setCategory(e.target.value)}>
                            <option className="mb-2 font-medium" value="">Select Category</option>
                            <option className="mb-2" value="Snacks">Snacks</option>
                            <option className="mb-2" value="Main Course">Main Course</option>
                            <option className="mb-2" value="Desserts">Desserts</option>
                            <option className="mb-2" value="Pizza">Pizza</option>
                            <option className="mb-2" value="Burger">Burger</option>
                            <option className="mb-2" value="Sandwiches">Sandwiches</option>
                            <option className="mb-2" value="South Indian">South Indian</option>
                            <option className="mb-2" value="North Indian">North Indian</option>
                            <option className="mb-2" value="Chinese">Chinese</option>
                            <option className="mb-2" value="Fast Food">Fast Food</option>
                            <option value="Others">Others</option>
                        </select>
                    </div>
                    {/* ======== */}

                    {/*price */}
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                        <input value={price} id="price" type="number" placeholder="Enter Food Price" onChange={(e) => setPrice(e.target.value)} className="w-full px-4 py-2
                    border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"/>
                    </div>
                    {/* ======== */}

                    <button disabled={pending} className={`w-full px-6 py-3 rounded-lg font-semibold
                    shadow-md  transition-all duration-200  ${pending ? "bg-gray-400 cursor-not-allowed" :
                            "bg-[#ff4d2d] cursor-pointer text-white hover:bg-orange-600 hover:shadow-lg active:bg-gray-400"} `}>
                        {pending ? "Saving..." : "Save"}
                    </button>

                </form>
                {/* ------- */}


            </div>


        </div>
    )
}
