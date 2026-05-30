"use client"

import { saveShopData } from "@/app/services/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaUtensils } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { setShopData } from "@/app/redux/slices/ownerSlice";

export default function SaveShop() {

    const { shopData } = useSelector(state => state.owner)
    const { currentCity, currentState, currentAddress } = useSelector(state => state.user)
    const router = useRouter()
    const dispatch = useDispatch()

    const [name, setName] = useState("")
    const [city, setCity] = useState("")
    const [state, setState] = useState("")
    const [address, setAddress] = useState("")
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

    const handleForm = async (e) => {

        e.preventDefault()
        setPending(true)
        const form = new FormData()

        form.append("name", name)
        form.append("city", city)
        form.append("state", state)
        form.append("address", address)
        form.append("shop-image", backendImg)


        const result = await saveShopData(form)

        if (!result.success) {
            toast.error("Try Again..")
            setPending(false)
            setName("")
            setCity("")
            setState("")
            setAddress("")
            setBackendImg(null)
            setFrontendImg(null)
            return
        }

        dispatch(setShopData(result.shop))
        toast.success(result.msg)
        setPending(false)

        setName("")
        setCity("")
        setState("")
        setAddress("")
        setBackendImg(null)
        setFrontendImg(null)

    }
    useEffect(() => {

        return () => {
            if (frontendImg) {
                URL.revokeObjectURL(frontendImg)
            }
        }
    }, [frontendImg])

    useEffect(() => {
        if (currentCity) {
            setCity(currentCity)
        }

        if (currentState) {
            setState(currentState)
        }

        if (currentAddress) {
            setAddress(currentAddress)
        }


    }, [currentCity, currentState, currentAddress])

    useEffect(() => {

        if (shopData) {
            setName(shopData.name)
            setState(shopData.state)
            setCity(shopData.city)
            setAddress(shopData.address)
            setFrontendImg(shopData.image)
            setBackendImg(shopData.image)
        }
    }, [shopData])





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
                        {shopData ? "Edit Shop" : "Add Shop"}
                    </div>

                </div>

                {/* form */}
                <form onSubmit={handleForm} className="space-y-5">

                    {/* Shop Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input value={name} id="name" type="text" placeholder="Enter Shop Name" onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2
                    border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"/>
                    </div>
                    {/* ======== */}

                    {/* Shop Image */}
                    <div>
                        <label htmlFor="shop-image" className="block text-sm font-medium text-gray-700 mb-1">Shop Image</label>
                        <input id="shop-image" type="file" accept="image/*" onChange={handleImage} className="w-full px-4 py-2 
                    border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"/>
                    </div>

                    {frontendImg &&
                        <div className="mt-4">
                            <img src={frontendImg} alt="Shop Image" className="w-full h-48 object-cover rounded-lg border "></img>
                        </div>
                    }

                    {/* ----------- */}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* City */}
                        <div>
                            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                            <input value={city} id="city" type="text" placeholder="City" onChange={(e) => setCity(e.target.value)} className="w-full px-4 py-2
                    border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"/>
                        </div>

                        {/* State */}
                        <div>
                            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State</label>
                            <input value={state} id="state" type="text" placeholder="State" onChange={(e) => setState(e.target.value)} className="w-full px-4 py-2
                    border rounded-lg focus:outline-none focus:ring-2  focus:ring-orange-500"/>
                        </div>
                        {/* ---------- */}


                    </div>

                    {/* Shop Address */}
                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <input id="address" value={address} type="text" placeholder="Enter Shop Address" onChange={(e) => setAddress(e.target.value)} className="w-full px-4 py-2
                    border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"/>
                    </div>
                    {/* ------------------- */}

                    <button disabled={pending} className={`w-full   px-6 py-3 rounded-lg font-semibold
                    shadow-md  transition-all duration-200  ${pending ? "bg-gray-400 cursor-not-allowed" : "bg-[#ff4d2d] cursor-pointer text-white hover:bg-orange-600 hover:shadow-lg active:bg-gray-400"} `}>
                        {pending ? "Saving..." : "Save"}
                    </button>

                </form>
                {/* ------- */}


            </div>


        </div>
    )
}