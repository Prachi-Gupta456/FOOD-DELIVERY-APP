import { useEffect } from "react";
import {  useDispatch, useSelector } from "react-redux";
import { handleUpdateLocation } from "../services/api";
import { setUserData } from "../redux/slices/userSlice";

export default function useUpdateLocation(skip) {

     const { userData } = useSelector(state => state.user)
     const dispatch=useDispatch()

    useEffect(() => {

            if(skip)return;

      if(!userData || userData.role !== "deliveryBoy")return;

      const watchId =   navigator.geolocation.watchPosition(async(pos)=>{
            const {longitude,latitude} = pos.coords
            const result =  await handleUpdateLocation({longitude,latitude})
            if(result.success){
            dispatch(setUserData(result.user))
            }
           },(err)=>console.log(err))


         
        },[skip,userData])
    }
