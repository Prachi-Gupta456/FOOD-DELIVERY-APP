'use client'
import { useState } from "react"
import Link from "next/link"
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { IoIosArrowRoundBack } from "react-icons/io"
import { toast } from "react-toastify";
import { resetPassword, sendOtp, verifyOtp } from "@/app/services/api"
import { ClipLoader } from "react-spinners";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {

    const [showPassword, setShowPassword] = useState(false)
    const [step, setStep] = useState(1)
    const [email, setEmail] = useState("")
    const [otp, setOtp] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [pending, setPending] = useState(false)
    const router=useRouter()

    const handleSendOtp = async () => {

        setPending(true)
        if (!email) {
            toast.warn("Email is required.")
            setPending(false)
            return
        }

        setPending(true)

        const result = await sendOtp({ email })

        if (result.success) {
            toast.success(result.msg)

        } else {
            toast.error(result.msg)
        }

        setPending(false)
        setStep(2)
    }

    const handleVerifyOtp = async () => {

        setPending(true)
        if (!otp) {
            toast.warn("OTP is required.")
            setPending(false)
            return
        }

        setPending(true)

        const result = await verifyOtp({ email, otp })

        if (result.success) {
            toast.success("OTP verification completed.")
        } else {
            toast.error(result.msg)
        }
        setPending(false)
        setStep(3)
    }

    const handleResetPassword = async () => {

        if (newPassword !== confirmPassword) {
            return toast.warn("Both Password should be same.")
        }

        setPending(true)
        const result = await resetPassword({ email: email, newPassword: newPassword, confirmPassword: confirmPassword })

        if (result.success) {
            toast.success(result.msg)
        } else {
            toast.error(result.msg)
        }
        setPending(false)
        router.push("/auth/signup")
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#fff9f6]" >

            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8 border border-[#ddd]">

                <div className="flex items-center justify-center gap-4 mb-4">
                    <Link href="/auth/signIn"><IoIosArrowRoundBack size={30} className="text-[#ff4d2d]" /></Link>
                    <h1 className="text-2xl font-bold text-center text-[#ff4d2d]">Forgot Password</h1>
                </div>

                {step == 1 &&
                    <div>
                        <div className="mb-6">
                            <label htmlFor="email" className="block text-gray-600 font-medium mb-1">Email</label>
                            <input type="text" id="email" onChange={(e) => setEmail(e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:outline-none
            focus:border-orange-500 border-[#ddd]"  placeholder="Enter Your Email"></input>
                        </div>

                        <button onClick={handleSendOtp}
                            className="w-full mt-2 px-3 py-2 cursor-pointer flex items-center 
            justify-center rounded-lg border transition duration-200 gap-2 bg-[#ff4d2d] border-[#ddd] text-amber-50
             font-semibold hover:bg-[#e64323]"
                        >{pending ? <ClipLoader size={20} color="white" /> : "Send OTP"}</button>
                    </div>
                }

                {step == 2 &&
                    <div>
                        <div className="mb-6">
                            <label htmlFor="otp" className="block text-gray-600 font-medium mb-1">OTP</label>
                            <input type="text" id="otp" onChange={(e) => setOtp(e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:outline-none
            focus:border-orange-500 border-[#ddd]"  placeholder="Enter OTP"></input>
                        </div>

                        <button onClick={handleVerifyOtp}
                            className="w-full mt-2 px-3 py-2 cursor-pointer flex items-center 
            justify-center rounded-lg border transition duration-200 gap-2 bg-[#ff4d2d] border-[#ddd] text-amber-50
             font-semibold hover:bg-[#e64323]"
                        >{pending ? <ClipLoader size={20} color="white" /> : "Verify"}</button>
                    </div>
                }

                {step == 3 &&
                    <div className="mb-3">
                        <div className="mb-1">
                            <label htmlFor="newPassword" className="block text-gray-600 font-medium mb-1">New Password</label>
                            <div className="relative">

                                <input type={!showPassword ? "password" : "text"} id="newPassword" onChange={(e) => setNewPassword(e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:outline-none
                             focus:border-orange-500 border-[#ddd] mb-3" placeholder="New Password"></input>
                                <button className="absolute right-3 top-3.5 text-gray-500 cursor-pointer" onClick={() => setShowPassword(prev => !prev)}>{!showPassword ? <FaEye /> : <FaEyeSlash />}</button>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-gray-600 font-medium mb-1">Confirm Password</label>
                            <div className="relative">

                                <input type={!showPassword ? "password" : "text"} id="confirmPassword" onChange={(e) => setConfirmPassword(e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:outline-none
                             focus:border-orange-500 border-[#ddd] mb-3" placeholder="Confirm Password"></input>
                                <button className="absolute right-3 top-3.5 text-gray-500 cursor-pointer" onClick={() => setShowPassword(prev => !prev)}>{!showPassword ? <FaEye /> : <FaEyeSlash />}</button>
                            </div>
                        </div>

                        <button onClick={handleResetPassword}
                            className="w-full mt-2 px-3 py-2 cursor-pointer flex items-center 
            justify-center rounded-lg border transition duration-200 gap-2 bg-[#ff4d2d] border-[#ddd] text-amber-50
             font-semibold hover:bg-[#e64323]"
                        >{pending ? <ClipLoader size={20} color="white" /> : "Reset Password"}</button>

                    </div>
                }

            </div>

        </div>
    )
}