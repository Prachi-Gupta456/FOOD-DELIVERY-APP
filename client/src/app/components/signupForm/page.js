"use client"

import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react"
import Link from "next/link";
import { handleSignUp, authenticateWithGoogle } from "@/app/services/api";
import { toast } from "react-toastify";
import GoogleAuth from "@/app/firebase/auth";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserData } from "@/app/redux/slices/userSlice";


export default function SignupForm() {

    const [showPassword, setShowPassword] = useState(false)
    const PreferredRoles = ["user", "owner", "deliveryBoy"]
    const [role, SetRole] = useState("user")
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [contact, setContact] = useState("")
    const [password, setPassword] = useState("")
    const [pending, setPending] = useState(false)
    const dispatch = useDispatch()

    const handleGoogleAuth = async () => {

        if (!contact || !role) {
            return toast.warn("Contact and Role is required");
        }

        if (contact.length != 10) {
            return toast.warn("Phone number must be of 10 digits.")
        }

        const result = await GoogleAuth()

        if (!result.success) {
            return toast.warn(result.msg)
        }

        setPending(true)

        const user = result.user

        const data = { fullName: user.fullName, email: user.email, contact, role }

        const res = await authenticateWithGoogle(data)

        if (!res.success) {
            toast.error("Something went wrong..")
            setPending(false)
            return
        }

        toast.success("Signup successful 🎉")

        // update state 
         dispatch(setUserData(res.user))
        // -----------

        setContact("")
        SetRole("")
        setPending(false)

    }

    const handleSubmit = async (e) => {

        e.preventDefault();

        setPending(true)

        const data = { fullName, email, contact, password, role }

        const result = await handleSignUp(data)

        if (result.success) {
            // update state 
            dispatch(setUserData(result.user))
            // -----------
            toast.success("Signup successful 🎉")
        }
        else {
            toast.error(result.msg)
        }
        setPending(false)

        setFullName("")
        setContact("")
        setEmail("")
        setPassword("")
    }

    return (
        <form method="post" onSubmit={handleSubmit} className="flex flex-col gap-3">

            {/* FullName */}
            <div>
                <label htmlFor="fullName" className="block text-gray-600 font-medium mb-1">Full Name</label>
                <input value={fullName} type="text" required id="fullName" onChange={(e) => setFullName(e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:outline-none
            focus:border-orange-500 border-[#ddd]"  placeholder="Enter Your Full Name"></input>
            </div>

            {/* Email */}

            <div>
                <label htmlFor="email" className="block text-gray-600 font-medium mb-1">Email</label>
                <input type="text" value={email} required id="email" onChange={(e) => setEmail(e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:outline-none
            focus:border-orange-500 border-[#ddd]"  placeholder="Enter Your Email"></input>
            </div>

            {/* Contact */}

            <div>
                <label htmlFor="contact" className="block text-gray-600 font-medium mb-1">Contact</label>
                <input type="text" value={contact} required id="contact" onChange={(e) => setContact(e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:outline-none
            focus:border-orange-500 border-[#ddd] " placeholder="Enter Your Phone number"></input>
            </div>

            {/* Password */}

            <div>
                <label htmlFor="password" className="block text-gray-600 font-medium mb-1">Password</label>

                <div className="relative">

                    <input type={!showPassword ? "password" : "text"} value={password} required id="password" name="password" onChange={(e) => setPassword(e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:outline-none
            focus:border-orange-500 border-[#ddd] mb-3" placeholder="Enter Your Password"></input>
                    <button type="button" className="absolute right-3 top-3.5 text-gray-500 cursor-pointer" onClick={() => setShowPassword(prev => !prev)}>{!showPassword ? <FaEye /> : <FaEyeSlash />}</button>

                </div>
            </div>

            {/* Role */}

            <div>
                <label htmlFor="role" className="block text-gray-600 font-medium mb-1">Role</label>

                <div className="flex gap-2">
                    {
                        PreferredRoles.map((r, index) => (
                            <button type="button" key={index} onClick={() => SetRole(r)}
                                className="cursor-pointer flex-1 border rounded-lg px-3 py-2 text-center font-medium transition-colors border-[#ff4d2d] text-[#ff4d2d]"
                                style={
                                    role === r ? { backgroundColor: "#ff4d2d", color: "white" } : { backgroundColor: "#fff" }
                                }
                            >{r}
                            </button>
                        )
                        )
                    }
                </div>
            </div>

            {/* Sign Up Button */}

            <button disabled={pending}
                className="w-full mt-2 px-3 py-2 cursor-pointer flex items-center 
            justify-center rounded-lg border transition duration-200 gap-2 bg-[#ff4d2d] border-[#ddd] text-amber-50
             font-semibold hover:bg-[#e64323]"
            >{pending ? <ClipLoader size={20} color="white" /> : "Sign Up"}</button>

            <button type="button" onClick={handleGoogleAuth}
                className="w-full px-3 py-2 cursor-pointer flex items-center 
            justify-center rounded-lg border transition duration-200  gap-2
             font-semibold border-gray-400 hover:bg-gray-200 "
            ><FcGoogle size={25} /><span>Sign up with Google</span></button>

            <p className="mt-3 text-center font-semibold text-gray-600">Already have an account ? <Link href="/auth/signin" className="text-[#ff4d2d] underline ">Sign in</Link></p>

        </form>
    )
}


