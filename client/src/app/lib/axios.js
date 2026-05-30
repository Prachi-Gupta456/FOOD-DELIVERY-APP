import axios from "axios"
const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL

const api = axios.create({
    baseURL: BACKEND_API_URL,
    withCredentials: true
})

// response interceptor
api.interceptors.response.use((response) => response,

    //   if request fails
    async (error) => {
    
        // original failed request
        const originalRequest = error.config

        if (error.response?.status === 401 &&
            error.response?.data?.expired &&
            error.response?.data?.msg==="Access token expired" &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true

            try {
                // console.log("called for new access token")
                await axios.post(`${BACKEND_API_URL}/api/auth/refresh-token`,{},{withCredentials:true})

                // retry original request
                return api(originalRequest)
            } catch (refreshError) {
                
                // if refresh token also expired
                window.location.href="/auth/signin"

                return Promise.reject(refreshError)
            }
        }

        return Promise.reject(error)
    }

)

export default api;