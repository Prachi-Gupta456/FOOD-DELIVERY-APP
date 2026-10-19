'use client'
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react"
import Link from "next/link";
import { handleSignIn } from "@/app/services/api";
import { toast } from "react-toastify";
import GoogleAuth from "@/app/firebase/auth";
import { authenticateWithGoogle } from "@/app/services/api";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserData } from "@/app/redux/slices/userSlice";

export default function signInForm() {

    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [pending, setPending] = useState(false)
    const dispatch = useDispatch()

    const handleGoogleAuth = async () => {

        const result = await GoogleAuth()

        if (!result.success) {
            return toast.warn(result.msg)
        }

        setPending(true)

        const user = result.user

        const data = { email: user.email }

        const res = await authenticateWithGoogle(data)

        if (res.success) {
            // update state 
            dispatch(setUserData(res.user))
            // -----------
            toast.success("Sign In successful 🎉")
        } else {
            toast.error(res.msg)
        }

        setPending(false)

    }

    const handleSubmit = async (e) => {

        e.preventDefault();

        setPending(true)

        const data = { email, password }

        const result = await handleSignIn(data)

        if (result.success) {
            // update state 
            dispatch(setUserData(result.user))
            // -----------
            toast.success("Login successful 🎉")
        } else {
            toast.error(result.msg)
        }

        setPending(false)

    }

    return (
        <form method="post" onSubmit={handleSubmit} className="flex flex-col gap-2">

            <div>
                <label htmlFor="email" className="block text-gray-600 font-medium mb-1">Email</label>
                <input type="text" required id="email" onChange={(e) => setEmail(e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:outline-none
            focus:border-orange-500 border-[#ddd]"  placeholder="Enter Your Email"></input>
            </div>


            <div>
                <label htmlFor="password" className="block text-gray-600 font-medium mb-1">Password</label>

                <div className="relative">

                    <input type={!showPassword ? "password" : "text"} required id="password" onChange={(e) => setPassword(e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:outline-none
            focus:border-orange-500 border-[#ddd] mb-3" placeholder="Enter Your Password"></input>
                    <button type="button" className="absolute right-3 top-3.5 text-gray-500 cursor-pointer" onClick={() => setShowPassword(prev => !prev)}>{!showPassword ? <FaEye /> : <FaEyeSlash />}</button>

                </div>
            </div>

            <Link href="/auth/forgot-password" className="text-right text-[#ff4d2d] font-semibold hover:underline">Forgot Password</Link>


            <button disabled={pending}
                className="w-full mt-2 px-3 py-2 cursor-pointer flex items-center 
            justify-center rounded-lg border transition duration-200 gap-2 bg-[#ff4d2d] border-[#ddd] text-amber-50
             font-semibold hover:bg-[#e64323]"
            >{pending ? <ClipLoader size={20} color="white" /> : "Sign In"}</button>

            <button type="button" onClick={handleGoogleAuth}
                className="w-full px-3 py-2 cursor-pointer flex items-center 
            justify-center rounded-lg border transition duration-200  gap-2
             font-semibold border-gray-400 hover:bg-gray-200 "
            ><FcGoogle size={25} /><span>Sign In with Google</span></button>

            <p className="mt-3 text-center font-semibold text-gray-600">Want to create an Account ? <Link href="/auth/signup" className="text-[#ff4d2d] underline ">Sign Up</Link></p>

        </form>
    )
}