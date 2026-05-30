"use client"

import { setSearchItems, setUserData } from "@/app/redux/slices/userSlice";
import { logout, searchItems } from "@/app/services/api";
import { useRouter } from "next/navigation";
import { useState,useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { FaCartShopping, FaLocationDot } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { TbReceipt2 } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function Navbar() {


    const [showInfo, setShowInfo] = useState(false)
    const [showSearch, setshowSearch] = useState(false)
    const { userData, currentCity, cartItems } = useSelector(state => state.user)
    const { shopData } = useSelector(state => state.owner)
    const { myOrders } = useSelector(state => state.user)
    const router = useRouter()
    const [query,setQuery]=useState("")
    const dispatch = useDispatch()

      const handleSearchItems = async () => {
    
            const result = await searchItems(query, currentCity)
            console.log(result)
            if (result.success) {
                dispatch(setSearchItems(result.items))
            }
    
        }
    
        useEffect(() => {
            if (query) {
                handleSearchItems()
            } else {
                dispatch(setSearchItems(null))
            }
        }, [query])

    const handleLogOut = async () => {
        const result = await logout()

        if (result.success) {
            toast.success("User Logged Out.")
            dispatch(setUserData(null))
        } else {
            toast.error("Server error")
        }
    }

    return (
        <div className="w-full h-20 flex items-center justify-between
        md:justify-center gap-7.5 px-5 fixed top-0 z-9999 bg-[#fff9f6] overflow-visible">

            {showSearch && userData?.role == "user" &&

                <div className="h-[70px] w-[90%] bg-white shadow-xl rounded-lg flex
           items-center gap-5 fixed top-20 left-[3%] md:hidden">

                    {/* location */}
                    <div className="flex items-center w-[30%] overflow-hidden gap-[10px] 
                    px-[10px] border-r-[2px] border-gray-400">

                        <FaLocationDot size={25} className="text-[#ff4d2d]" />
                        <div className="w-[80%] truncate text-gray-600">{currentCity || ""}</div>

                    </div>

                    {/* search area */}
                    <div className="w-[80%] flex gap-[10px] items-center">

                        <IoIosSearch size={25} className="text-[#ff4d2d]" />
                        <input type="text" placeholder="search delicious food..." className="px-1 text-gray-700 outline-0 w-full"
                        onChange={(e)=>setQuery(e.target.value)} value={query}/>

                    </div>

                </div>
            }


            <h1 className="text-3xl font-bold mb-2 text-[#ff4d2d]">SwadSutra</h1>

            {/* search bar and location wrapper */}{
                userData?.role === "user" &&

                <div className="md:w-[60%] lg:w-[40%] h-[70px] bg-white shadow-xl rounded-lg flex
           items-center gap-5 md:flex hidden">

                    {/* location */}
                    <div className="flex items-center w-[30%] overflow-hidden gap-[10px] 
                    px-[10px] border-r-[2px] border-gray-400">

                        <FaLocationDot size={25} className="text-[#ff4d2d]" />
                        <div className="w-[80%] truncate text-gray-600">{currentCity || ""}</div>

                    </div>

                    {/* search area */}
                    <div className="w-[80%] flex gap-[10px] items-center">

                        <IoIosSearch size={25} className="text-[#ff4d2d]" />
                        <input type="text" placeholder="search delicious food..." className="px-1 text-gray-700 outline-0 w-full" 
                         onChange={(e)=>setQuery(e.target.value)} value={query}/>


                    </div>

                </div>
            }

            <div className="flex items-center gap-4">

                {/* Small screen's search icon */}
                {userData?.role === "user" && (showSearch ? <RxCross2 size={25} className="text-[#ff4d2d] md:hidden" onClick={() => setshowSearch(prev => !prev)} /> :
                    <IoIosSearch size={25} className="text-[#ff4d2d] md:hidden" onClick={() => setshowSearch(prev => !prev)} />
                )}

                {/* owner */}
                {
                    userData?.role == "owner" ? (
                        <>
                            {
                                shopData && (
                                    <button onClick={() => router.push("/components/addFood")} className="flex items-center gap-2 rounded-full p-2 cursor-pointer bg-[#ff4d2d]/10 text-[#ff4d2d]">
                                        <FaPlus size={25} />
                                        <span className="hidden  sm:inline">Add Food Item</span>
                                    </button>
                                )
                            }


                            <div onClick={() => router.push("/components/myorders")} className="flex items-center gap-2 relative px-3 py-1 rounded-b-lg cursor-pointer font-medium bg-[#ff4d2d]/10 text-[#ff4d2d]">
                                <TbReceipt2 size={20} />
                                <span className="hidden md:inline">My Orders</span>
                                <span className="absolute -right-2 -top-2 text-xs font-bold text-white
                     bg-[#ff4d2d] rounded-full px-[6px] py-[1px]">{myOrders?.length}</span>
                            </div>

                        </>
                    ) : (


                        userData?.role == "user" && (
                            <>
                                <div onClick={() => router.push("/components/cart")} className="active:scale-99 relative cursor-pointer">
                                    <FaCartShopping size={20} className="text-[#ff4d2d]" />
                                    <span className="absolute right-[-9px] top-[-13px]">{cartItems?.length || 0}</span>
                                </div>
                                {/* My Orders */}
                                <button onClick={() => router.push("/components/myorders")} className="hidden md:block px-3 py-1 bg-[#ff4d2d]/10 rounded-lg text-sm font-medium text-[#ff4d2d]">My Orders</button>
                            </>

                        )

                    )

                }


                {/* Profile */}
                <div onClick={() => setShowInfo(prev => !prev)} className="w-10 h-10 rounded-full bg-[#ff4d2d] text-[18px] flex items-center justify-center font-semibold cursor-pointer text-white">
                    {userData?.fullName?.slice(0, 1).toUpperCase() || ""}
                </div>

                {showInfo &&
                    <div className={`${userData?.role == "deliveryBoy" ? "md:right-[20%] lg:right-[40%]" : "md:right-[10%] lg:right-[25%]"} fixed top-20 right-[10px] 
                 w-[180px] bg-white rounded-xl p-5 shadow-xl flex flex-col gap-[10px] z-[9999]`}>

                        <div className="text-[17px] font-semibold">{userData?.fullName || ""}</div>
                        {userData?.role == "user" &&
                            <div onClick={() => router.push("/components/myorders")} className="text-[#ff4d2d] font-semibold md:hidden cursor-pointer">My Orders</div>
                        }
                        <div onClick={handleLogOut} className="text-[#ff4d2d] font-semibold cursor-pointer">Log Out</div>

                    </div>
                }


            </div>

        </div>

    )


}