import { getCurrentUser } from "@/app/services/api"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { setUserData } from "../redux/slices/userSlice"

const useGetCurrentUser = (skip) => {

    const dispatch = useDispatch()

    useEffect(() => {

          if(skip)return;

        const fetchUser = async () => {
            const result = await getCurrentUser()

            if (result.success) {
                dispatch(setUserData(result.user))
            }
        }

        fetchUser();

    }, [skip])

}

export default useGetCurrentUser;