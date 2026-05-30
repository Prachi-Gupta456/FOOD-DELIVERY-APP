import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        userData: null,
        currentCity: null,
        currentState: null,
        currentAddress: null,
        shopsInMyCity: null,
        itemsInMyCity: null,
        totalAmount: 0,
        cartItems: [],
        myOrders: null,
        searchItems: null
    },
    reducers: {
        setUserData: (state, action) => {
            state.userData = action.payload
        },
        setCurrentCity: (state, action) => {
            state.currentCity = action.payload
        },
        setCurrentState: (state, action) => {
            state.currentState = action.payload
        },
        setCurrentAddress: (state, action) => {
            state.currentAddress = action.payload
        },
        setShopsInMyCity: (state, action) => {
            state.shopsInMyCity = action.payload
        },
        setItemsInMyCity: (state, action) => {
            state.itemsInMyCity = action.payload
        },
        addToCart: (state, action) => {
            const cartItem = action.payload

            // check whether item is already in cart
            const existingItem = state.cartItems.find(item => item.id == cartItem.id)

            if (existingItem) {
                existingItem.quantity += cartItem.quantity
            } else {
                state.cartItems.push(cartItem)
            }

            state.totalAmount = state.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

        },
        updateQuantity: (state, action) => {
            const { id, quantity } = action.payload
            const item = state.cartItems.find(i => i.id == id)
            if (item) {
                item.quantity = quantity
            }
            state.totalAmount = state.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

        },
        removeCartItem: (state, action) => {
            const { id } = action.payload

            state.cartItems = state.cartItems.filter(i => i.id !== id)
            state.totalAmount = state.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
        },
        setMyOrders: (state, action) => {
            state.myOrders = action.payload
        },
        addMyOrder: (state, action) => {
            state.myOrders = [action.payload, ...state.myOrders]
        },
        updateOrderStatus: (state, action) => {

            const { orderId, shopId, status } = action.payload
            const order = state.myOrders.find(o => o._id.toString() == orderId.toString())
            
            if (order?.shopOrders && order.shopOrders?.shop?._id == shopId) {
                order.shopOrders.status = status
            }
        },
        updateRealTimeOrderStatus: (state, action) => {

            const { orderId, shopId, status } = action.payload
            const order = state.myOrders.find(o => o._id.toString() == orderId.toString())

            if (order) {
                const shopOrder = order.shopOrders.find(
                    so => (so.shop?._id || so.shop).toString() === shopId.toString()
                )
                if (shopOrder) {
                    shopOrder.status = status
                }
            }
        },
        setSearchItems: (state, action) => {
            state.searchItems = action.payload
        }
    }
})

export const { setSearchItems, setUserData, updateOrderStatus, addMyOrder,
    setMyOrders, updateQuantity, removeCartItem, setCurrentCity, addToCart,
    setItemsInMyCity, setShopsInMyCity, setCurrentState, setCurrentAddress, updateRealTimeOrderStatus } = userSlice.actions


export default userSlice.reducer;