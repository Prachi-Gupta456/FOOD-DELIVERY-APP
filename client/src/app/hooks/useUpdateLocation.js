import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleUpdateLocation } from "../services/api";
import { setUserData } from "../redux/slices/userSlice";

export default function useUpdateLocation(skip) {

    const role = useSelector(state => state.user.userData?.role)
    const dispatch = useDispatch()

    useEffect(() => {

        if (skip || role !== "deliveryBoy") return;
        if (!navigator.geolocation) return;

        const watchId = navigator.geolocation.watchPosition(async (pos) => {
            const { longitude, latitude } = pos.coords
            const result = await handleUpdateLocation({ longitude, latitude })
            if (result.success) {
                dispatch(setUserData(result.user))
            }
        }, (err) => console.log(err))

        return () => navigator.geolocation.clearWatch(watchId)

    }, [skip, role])
}