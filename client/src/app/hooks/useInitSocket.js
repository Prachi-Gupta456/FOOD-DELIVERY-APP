"use client"

import { useEffect } from "react";
import { socketInstance } from "../socket";
import { useSelector } from "react-redux";

export default function useInitSocket(skip) {

    const { userData } = useSelector(state => state.user)

    useEffect(() => {

           if(skip)return;

        socketInstance.connect()

        socketInstance.on("connect", () => {
            console.log("socket connected: ", socketInstance.id)

            if (userData) {
                socketInstance.emit("identity", { userId: userData._id })
            }

        })

        return () => socketInstance.disconnect()

    }, [skip,userData?._id])
}
