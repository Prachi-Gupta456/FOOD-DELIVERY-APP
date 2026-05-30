"use client"
import SignInForm from "@/app/components/signInForm/page"
import { useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function SignIn() {

    const router = useRouter()
    const {userData} = useSelector(state => state.user)

    useEffect(()=>{
        if(userData){
            router.push("/")
        }
    },[userData,router])


    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#fff9f6]" >

            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8 border border-[#ddd]">

                <h1 className="text-3xl font-bold mb-2 text-[#ff4d2d]" >FoodSutra</h1>
                <p className="text-gray-600 font-semibold mb-6">
                    Hungry? 🍔 Login to your account and get your favourite food delivered in just a few taps!
                </p>

                <div >
                    <SignInForm />
                </div>

            </div>

        </div>
    )
}
