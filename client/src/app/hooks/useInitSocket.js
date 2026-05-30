"use client"

import { useEffect } from "react";
import { socketInstance } from "../socket";
import { useSelector } from "react-redux";

export default function useInitSocket() {

    const { userData } = useSelector(state => state.user)

    useEffect(() => {

        socketInstance.connect()

        socketInstance.on("connect", () => {
            console.log("socket connected: ", socketInstance.id)

            if (userData) {
                socketInstance.emit("identity", { userId: userData._id })
            }

        })

        return () => socketInstance.disconnect()

    }, [userData?._id])
}