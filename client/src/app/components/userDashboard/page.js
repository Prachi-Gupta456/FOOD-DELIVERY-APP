"use client"
import { categories } from "@/app/category";
import Navbar from "../navbar/page";
import CategoryCard from "../categoryCard/page";
import { FaCircleChevronLeft, FaCircleChevronRight } from "react-icons/fa6";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import FoodCard from "../foodCard/page";
import Loader from "@/app/components/loader/page";
import { useRouter } from "next/navigation";


export default function UserDashboard() {

    const [shoploading, setShopLoading] = useState(true)
    const [itemloading, setItemLoading] = useState(true)
    const cateScrollRef = useRef()
    const shopScrollRef = useRef()
    const router = useRouter()
    const { userData, currentCity, shopsInMyCity, itemsInMyCity } = useSelector(state => state.user)
    const { searchItems } = useSelector(state => state.user)
    const [showLeftCateBtn, setShowLeftCateBtn] = useState(false)
    const [showRightCateBtn, setShowRightCateBtn] = useState(false)
    const [showLeftShopBtn, setShowLeftShopBtn] = useState(false)
    const [showRightShopBtn, setShowRightShopBtn] = useState(false)
    const [filteredItems, setFilteredItems] = useState(itemsInMyCity || [])

    useEffect(() => {

        if (!userData )return;
        
        if(userData.role !== "user") {
            router.push("/auth/signup")
            return
        }
    }, [userData?._id])

    
    const FilterItemsByCategory = (category) => {
        if (category == "All") {
            setFilteredItems(itemsInMyCity)
        } else {
            const updatedItems = itemsInMyCity.filter(i => i.category == category)
            setFilteredItems(updatedItems)
        }
    }


    const updateButton = (ref, setLeftBtn, setRightBtn) => {
        const element = ref.current

        if (element) {
            setLeftBtn(element.scrollLeft > 0)
            setRightBtn(element.scrollLeft + element.clientWidth < element.scrollWidth)
        }
    }

    const scrollHandler = (ref, direction) => {
        if (ref.current) {
            ref.current.scrollBy({
                left: direction == "left" ? -200 : 200,
                behavior: "smooth"
            })
        }
    }


    useEffect(() => {

        const shopElement = shopScrollRef.current
        const cateElement = cateScrollRef.current

        const handleCateScroll = () => {
            updateButton(cateScrollRef, setShowLeftCateBtn, setShowRightCateBtn)
        }

        const handleShopScroll = () => {
            updateButton(shopScrollRef, setShowLeftShopBtn, setShowRightShopBtn)
        }

        if (cateElement) {
            updateButton(cateScrollRef, setShowLeftCateBtn, setShowRightCateBtn)
            cateElement.addEventListener("scroll", handleCateScroll)
        }

        if (shopElement) {
            updateButton(shopScrollRef, setShowLeftShopBtn, setShowRightShopBtn)
            shopElement.addEventListener("scroll", handleShopScroll)
        }

        return () => {
            if (cateElement) {
                cateElement.removeEventListener("scroll", handleCateScroll)
            }
            if (shopElement) {
                shopElement.removeEventListener("scroll", handleShopScroll)
            }
        }

    }, [categories, shopsInMyCity])

    useEffect(() => {
        if (shopsInMyCity) {
            setShopLoading(false)
        }
        if (itemsInMyCity) {
            setItemLoading(false)
        }
    }, [shopsInMyCity, itemsInMyCity])


    return (
        <div className="w-screen min-h-screen flex flex-col gap-5 items-center bg-[#fff9f6] overflow-y-auto">
            <Navbar />

            {/* show searched items */}
            {
                searchItems && searchItems.length > 0 && (
                    <div className="w-full max-w-6xl flex flex-col gap-5 items-start
                    p-5 bg-white shadow-md rounded-2xl mt-4">

                        <h1 className="text-gray-900 text-2xl sm:text-3xl font-semibold 
                        border-b border-gray-200 pb-2">
                            Search Results
                        </h1>

                        <div className="w-full h-auto flex flex-wrap justify-center gap-6">
                            {searchItems.map((item) => (
                                <FoodCard data={item} key={item._id} />
                            ))}
                        </div>

                    </div>
                )
            }

            {/* Show food categories */}

            <div className="cursor-grab w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]">

                <h1 className="text-gray-800 text-2xl sm:text-3xl">Inspiration for your first order</h1>

                <div className="w-full relative">


                    {showLeftCateBtn && <button onClick={() => scrollHandler(cateScrollRef, "left")} className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white 
        p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10">
                        <FaCircleChevronLeft />
                    </button>
                    }


                    <div className="w-full flex overflow-x-auto gap-4 pb-2" ref={cateScrollRef}> {
                        categories.map((cate, index) => (
                            <CategoryCard name={cate.category} image={cate.image} key={index} onClick={() => FilterItemsByCategory(cate.category)} />
                        ))
                    }
                    </div>

                    {showRightCateBtn && <button onClick={() => scrollHandler(cateScrollRef, "right")} className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white 
        p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10">
                        <FaCircleChevronRight />
                    </button>
                    }

                </div>

            </div>
            {/* ======================= */}

            {/* Show Shops in user's city*/}

            <div className="cursor-grab w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]">
                <h1 className="text-gray-800 text-2xl sm:text-3xl">Best Shops in {currentCity ? currentCity : "Your City"}</h1>

                {shoploading ? <Loader /> :
                     
                     shopsInMyCity.length === 0 ? <p className="text-lg text-[#ff4d2d] font-medium">No Shops found in your city!</p>:
                    <div className="w-full relative">

                        {showLeftShopBtn && <button onClick={() => scrollHandler(shopScrollRef, "left")}
                            className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white  
                            p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10">
                            <FaCircleChevronLeft />
                        </button>
                        }


                        <div className="w-full flex overflow-x-auto gap-4 pb-2" ref={shopScrollRef}> {
                            shopsInMyCity?.map((shop, index) => (
                                <CategoryCard name={shop.name} image={shop.image} key={index} onClick={() => router.push(`/components/shop/${shop._id}`)} />
                            ))
                        }
                        </div>

                        {showRightShopBtn && <button onClick={() => scrollHandler(shopScrollRef, "right")} className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white 
        p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10">
                            <FaCircleChevronRight />
                        </button>
                        }

                    </div>}


            </div>
            {/* ======================== */}

            {/* Suggested Food Items  in your city*/}

            <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]">
                <h1 className="text-gray-800 text-2xl sm:text-3xl">Suggested Food Items in your City</h1>

                {itemloading ? <Loader /> :
                itemsInMyCity.length === 0 ? <p className="text-lg text-[#ff4d2d] font-medium">No Food items found in your city!</p>:
                    <div className="w-full h-auto flex flex-wrap gap-5 justify-center">
                        {
                            filteredItems?.map((item, index) => (
                                <FoodCard data={item} key={index} />
                            ))
                        }
                    </div>
                }

            </div>

            {/* ======================== */}


        </div>
    )
}