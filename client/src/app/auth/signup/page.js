"use client"

import { useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import SignupForm from "@/app/components/signupForm/page"

export default function SignUp() {

    const router = useRouter()
   
    const { userData } = useSelector(state => state.user)

    useEffect(() => {
        if (userData) {
            router.push("/")
        }
    }, [userData, router])


    return (

        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#fff9f6]" >

            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8 border border-[#ddd]">

                <h1 className="text-3xl font-bold mb-2 text-[#ff4d2d]">FoodSutra</h1>

                <p className="text-gray-600 font-semibold mb-6">
                    Hungry? 🍔 Create your account and get your favourite food delivered in just a few taps!
                </p>

                <div >
                    <SignupForm />
                </div>

            </div>

        </div>
    )
}
