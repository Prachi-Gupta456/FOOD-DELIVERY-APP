import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchItemsByCity } from "../services/api"
import { setItemsInMyCity } from "../redux/slices/userSlice"

const useGetItemByCity = (skip) => {
    
    const { currentCity } = useSelector(state => state.user)
    const dispatch = useDispatch()

    useEffect(() => {

          if(skip)return;

        const fetchItems = async () => {
            const result = await fetchItemsByCity(currentCity)
            if(result.items){
            dispatch(setItemsInMyCity(result.items))
            }
        }

        fetchItems()
    }, [skip,currentCity])
}

export default useGetItemByCity;
