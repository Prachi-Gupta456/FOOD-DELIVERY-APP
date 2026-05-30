import { io } from "socket.io-client";

export const socketInstance = io(process.env.NEXT_PUBLIC_BACKEND_API_URL, {
    withCredentials: true,
    autoConnect:false
})
