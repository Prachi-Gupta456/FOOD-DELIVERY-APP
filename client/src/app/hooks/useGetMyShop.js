
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getMyShop } from "../services/api"
import { setShopData } from "../redux/slices/ownerSlice"

const useGetMyShop = (skip) => {

    const dispatch = useDispatch()
    const { userData } = useSelector(state => state.user)

    useEffect(() => {

          if(skip)return;

        const fetchShop = async () => {
            
            if(!userData || userData.role !== "owner")return;

            const result = await getMyShop()

            if (result.success) {
                dispatch(setShopData(result.shop))
            }
        }

        fetchShop();

    }, [skip,userData])
}

export default useGetMyShop;