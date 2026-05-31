import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchShopsByCity } from "../services/api"
import { setShopsInMyCity } from "../redux/slices/userSlice"

const useGetShopByCity = (skip) => {
    
    const { currentCity } = useSelector(state => state.user)
    const dispatch = useDispatch()

    useEffect(() => {

          if(skip)return;

        const fetchShops = async () => {
            const result = await fetchShopsByCity(currentCity)
            if(result.shops){
            dispatch(setShopsInMyCity(result.shops))
            }
        }

        fetchShops()
    }, [currentCity])
}

export default useGetShopByCity;