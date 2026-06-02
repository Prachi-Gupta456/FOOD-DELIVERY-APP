import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLocation } from "../services/api.js";
import { setCurrentAddress, setCurrentCity, setCurrentState } from "../redux/slices/userSlice";
import { setAddress, setLocation } from "../redux/slices/mapSlice.js";

export default function useGetCity(skip) {

    const dispatch = useDispatch()
    const { userData } = useSelector(state => state.user)

    useEffect(() => {

       if(skip)return;

        navigator.geolocation.getCurrentPosition(async (pos) => {
            const { latitude, longitude } = pos.coords

            const result = await getLocation(latitude, longitude)

            dispatch(setCurrentCity(result.city || result.county))
            dispatch(setCurrentState(result.state))
            dispatch(setCurrentAddress(result.address_line2 || result.address_line1))

            // map
            dispatch(setLocation({ lat: latitude, lon: longitude }))
            dispatch(setAddress(result.address_line2))

        }, (error) => {
            console.log(error.message)
        })
    }, [skip,userData])
}
