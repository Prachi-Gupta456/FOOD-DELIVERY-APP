import api from "../lib/axios"


const getErrorMessage = (error) => {
  return (
    error.response?.data?.msg ||
    error.message ||
    "Server Error.Try again later!"
  )
}

export const handleSignUp = async (data) => {
  try {
    const response = await api.post(`/api/auth/signup`, data)
    return response.data
  } catch (error) {
    console.log("❌ [Signup API Error]", error)

    return {
      success: false,
      msg: getErrorMessage(error)
    }
  }
}

export const handleSignIn = async (data) => {
  try {
    const response = await api.post(`/api/auth/signin`, data)
    return response.data
  } catch (error) {
    console.log("❌ [Signin API Error]", error)

    return {
      success: false,
      msg: getErrorMessage(error)
    }
  }
}

export const logout = async () => {
  try {
    const response = await api.get(`/api/auth/logout`)
    return response.data
  } catch (error) {
    console.log("❌ [Logout API Error]", error)
    return {
      success: false,
      msg: getErrorMessage(error)
    }
  }
}

export const sendOtp = async (data) => {
  console.log("Send otp: ", data)
  try {
    const response = await api.post(`/api/auth/send-otp`, data)
    return response.data
  } catch (error) {
    console.log("❌ [Send OTP Error]", error)

    return {
      success: false,
      msg: getErrorMessage(error)

    }
  }
}

export const verifyOtp = async (data) => {
  try {
    const response = await api.post(`/api/auth/verify-otp`, data)
    return response.data
  } catch (error) {
    console.log("❌ [Verify OTP Error]", error)

    return {
      success: false,
      msg: getErrorMessage(error)
    }
  }
}

export const resetPassword = async (data) => {
  try {
    const response = await api.post(`/api/auth/reset-password`, data)
    return response.data
  } catch (error) {

    console.log("❌ [Reset Password Error]", error)

    return {
      success: false,
      msg: getErrorMessage(error)
    }
  }
}

export const authenticateWithGoogle = async (data) => {
  try {
    const response = await api.post(`/api/auth/google-auth`, data)
    return response.data
  } catch (error) {

    console.log("❌ [Google Auth Error]", error)
    return {
      success: false,
      msg: getErrorMessage(error)
    }
  }
}

export const getCurrentUser = async () => {
  try {
    const response = await api.get(`/api/user/current-user`)
    return response.data
  } catch (error) {

    console.log("❌ [Get Current User Error]", error)
    return {
      success: false,
      msg: getErrorMessage(error)
    }
  }
}

export const getMyShop = async () => {
  try {
    const response = await api.get(`/api/shop/get-myshop`)
    return response.data
  } catch (error) {
    return {
      success: false,
      msg: getErrorMessage(error)
    }
  }
}

export const getLocation = async (lat, lon) => {
  try {

    const response = await api.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&format=json&apiKey=${process.env.NEXT_PUBLIC_GEOAPI_KEY}`)
    return response.data.results[0]

  }
  catch (error) {
    console.log("❌ [Get Location Error]", error)
    return {
      success: false,
      msg: getErrorMessage(error)
    }
  }
}

export const saveShopData = async (data) => {
  try {
    const response = await api.post(`/api/shop/save-shop`, data)
    return response.data
  } catch (error) {
    return {
      success: false,
      msg: getErrorMessage(error)
    }
  }
}

export const addFood = async (data) => {
  try {
    const response = await api.post(`/api/item/add-item`, data)
    return response.data
  } catch (error) {
    return {
      success: false,
      msg: getErrorMessage(error)
    }
  }
}

export const editFood = async (data, itemId) => {
  try {
    const response = await api.post(`/api/item/edit-item/${itemId}`, data)
    return response.data
  } catch (error) {
    return {
      success: false,
      msg: getErrorMessage(error)
    }
  }
}

export const updateItemRating = async (data) => {
  try {
    const response = await api.post(`/api/item/update-item-rating`, data)
    return response.data
  } catch (error) {
    return {
      success: false,
      msg: getErrorMessage(error)
    }
  }
}


export const deleteFood = async (itemId) => {
  try {
    const response = await api.delete(`/api/item/delete-item/${itemId}`)
    return response.data
  } catch (error) {
    return {
      success: false,
      msg: getErrorMessage(error)
    }
  }
}

export const fetchShopsByCity = async (city) => {
  try {
    const response = await api.get(`/api/shop/get-shop-by-city/${city}`)
    return response.data
  } catch (error) {
    return {
      success: false,
      msg: getErrorMessage(error)
    }
  }
}

export const fetchItemsByCity = async (city) => {
  try {
    const response = await api.get(`/api/item/get-item-by-city/${city}`)
    return response.data
  } catch (error) {
    return {
      success: false,
      msg: getErrorMessage(error)
    }
  }
}

export const fetchItemsByShop = async (shopId) => {
  try {
    const response = await api.get(`/api/item/get-item-by-shop/${shopId}`)
    return response.data
  } catch (error) {
    return {
      success: false,
      msg: getErrorMessage(error)
    }
  }
}

export const fetchLatLng = async (address) => {
  try {
    const response = await api.get(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&format=json&apiKey=${process.env.NEXT_PUBLIC_GEOAPI_KEY}`)
    return response.data.results[0]
  } catch (error) {
    return {
      success: false,
      msg: getErrorMessage(error)
    }
  }
}

export const placeOrder = async (data) => {
  try {
    const response = await api.post(`/api/order/place-order`, data)
    return response.data
  } catch (error) {
    return {
      success: false,
      msg: getErrorMessage(error)
    }
  }
}

export const getMyOrders = async () => {
  try {
    const response = await api.get(`/api/order/my-orders`)
    return response.data
  } catch (error) {
    return {
      success: false,
      msg: getErrorMessage(error)
    }
  }
}

export const updateOrder = async (shopId, orderId, data) => {
  try {
    const response = await api.post(`/api/order/update-order/${shopId}/${orderId}`, data)
    return response.data.data
  } catch (error) {
    return {
      success: false,
      msg: getErrorMessage(error)
    }
  }
}

export const handleUpdateLocation = async (data) => {
  try {
    const response = await api.post(`/api/user/update-user-location`, data)
    return response.data
  } catch (error) {
    return {
      success: false,
      msg: getErrorMessage(error)
    }
  }
}

export const getDeliveryBoyAssignment = async () => {
  try {
    const response = await api.get(`/api/order/get-assignments`)
    return response.data
  } catch (error) {
    return {
      success: false,
      msg: getErrorMessage(error)
    }
  }
}

export const handleAcceptOrder = async (assignmentId) => {
  try {
    const response = await api.get(`/api/order/accept-order/${assignmentId}`)
    return response.data
  } catch (error) {
    return {
      success: false,
      msg: getErrorMessage(error)
    }
  }
}

export const getCurrentOrder = async () => {
  try {
    const response = await api.get(`/api/order/get-current-order`)
    return response.data
  } catch (error) {
    return {
      success: false,
      msg: getErrorMessage(error)
    }
  }
}

export const getOrderById = async (orderId) => {
  try {
    const response = await api.get(`/api/order/get-order-by-id/${orderId}`)
    return response.data
  } catch (error) {
    return {
      success: false,
      msg: getErrorMessage(error)
    }
  }
}

export const sendDeliveryOtp = async (data) => {
  try {
    const response = await api.post(`/api/order/send-delivery-otp`, data)
    return response.data
  } catch (error) {
    return {
      success: false,
      msg: getErrorMessage(error)
    }
  }
}

export const verifyDeliveryOtp = async (data) => {
  try {
    const response = await api.post(`/api/order/verify-delivery-otp`, data)
    return response.data
  } catch (error) {
    return {
      success: false,
      msg: getErrorMessage(error)
    }
  }
}


export const searchItems = async (query, city) => {
  try {
    const response = await api.get(`/api/item/search-items?query=${query}&city=${city}`)
    return response.data
  } catch (error) {
    return {
      success: false,
      msg: getErrorMessage(error)
    }
  }
}


export const verifyPayment = async (data) => {
  try {
    const response = await api.post(`/api/order/verify-payment`, data)
    return response.data
  } catch (error) {
    return {
      success: false,
      msg: getErrorMessage(error)
    }
  }
}

export const getTodayDeliveries = async () => {
  try {
    const response = await api.get(`/api/order/get-today-deliveries`)
    return response.data
  } catch (error) {
    return {
      success: false,
      msg: getErrorMessage(error)
    }
  }
}
