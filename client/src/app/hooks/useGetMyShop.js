import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getMyShop } from "../services/api"
import { setShopData } from "../redux/slices/ownerSlice"

const useGetMyShop = (skip) => {

    const dispatch = useDispatch()
    const userId = useSelector(state => state.user.userData?._id)
    const role = useSelector(state => state.user.userData?.role)

    useEffect(() => {

        if (skip || !userId || role !== "owner") return;

        const fetchShop = async () => {
            const result = await getMyShop()

            if (result.success) {
                dispatch(setShopData(result.shop))
            }
        }

        fetchShop();

    }, [skip, userId, role])
}

export default useGetMyShop;