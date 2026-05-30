import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import ownerSlice from "./slices/ownerSlice"
import mapSlice from "./slices/mapSlice"

const store = configureStore({
    reducer:{
        user:userSlice,
        owner:ownerSlice,
        map:mapSlice
    },
    devTools:true,
})

export default store;