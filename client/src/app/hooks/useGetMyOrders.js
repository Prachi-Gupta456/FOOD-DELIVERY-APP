import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getMyOrders} from "../services/api"
import { setMyOrders } from "../redux/slices/userSlice"

const useGetMyOrders = () => {

    const dispatch = useDispatch()
      const { userData } = useSelector(state => state.user)

    useEffect(() => {

        const fetchOrders = async () => {
            const result = await getMyOrders()

            if (result.success) {
                dispatch(setMyOrders(result.orders))
            }
        }

        fetchOrders();
        
    }, [userData])
}

export default useGetMyOrders;