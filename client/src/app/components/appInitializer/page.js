"use client"

import useGetCity from "@/app/hooks/useGetcity"
import useGetCurrentUser from "@/app/hooks/useGetCurrentUser"
import useGetItemByCity from "@/app/hooks/useGetItemByCity"
import useGetMyOrders from "@/app/hooks/useGetMyOrders"
import useGetMyShop from "@/app/hooks/useGetMyShop"
import useGetShopByCity from "@/app/hooks/useGetShopByCity"
import useInitSocket from "@/app/hooks/useInitSocket"
import useUpdateLocation from "@/app/hooks/useUpdateLocation"
import { usePathname } from "next/navigation";


export default function AppInitializer() {

    const pathname = usePathname();

    const isAuthPage = pathname.startsWith("/auth/signin") || pathname.startsWith("/auth/signup");


    useInitSocket(isAuthPage);
    useGetCurrentUser(isAuthPage);
    useUpdateLocation(isAuthPage);
    useGetCity(isAuthPage);
    useGetMyShop(isAuthPage);
    useGetItemByCity(isAuthPage);
    useGetShopByCity(isAuthPage);
    useGetMyOrders(isAuthPage);


    return null
}