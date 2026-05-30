"use client"

import useGetCurrentUser from "@/app/hooks/useGetCurrentUser"
import { useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import UserDashboard from "./components/userDashboard/page"
import DeliveryBoyDashboard from "./components/deliveryBoyDashboard/page"
import OwnerDashboard from "./components/ownerDashboard/page"


export default function Home() {

  useGetCurrentUser()

  const { userData } = useSelector(state => state.user)
  const router = useRouter()

  useEffect(() => {
    if (!userData) {
      router.push("/auth/signup")
    }
  }, [userData, router])

  return (
    <div className="w-screen min-h-screen pt-25 flex flex-col items-center bg-[#fff9f6]">

      {
        userData?.role === "owner" && <OwnerDashboard />
      }
      {
        userData?.role === "user" && <UserDashboard />
      }
      {
        userData?.role === "deliveryBoy" && <DeliveryBoyDashboard/>
      }

    </div>
  )
}

