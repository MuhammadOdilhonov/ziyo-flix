import axios from "axios"

// local server
// export const BaseUrl = "http://192.168.100.55:8000/api" // To'g'ri URLni tekshiring
// export const BaseUrlReels = "http://192.168.100.55:8000"

// // remote server
// export const BaseUrl = "http://159.198.77.122:8000/api" // To'g'ri URLni tekshiring
// export const BaseUrlReels = "http://159.198.77.122:8000"

// org server
export const BaseUrl = "https://ziyo-flix-service.uz/api" // To'g'ri URLni tekshiring
export const BaseUrlReels = "https://ziyo-flix-service.uz"

const apiService = axios.create({
    baseURL: BaseUrl,
    headers: {
        "Content-Type": "application/json",
    },
})

// Request interceptor: attach Authorization header if access token exists
apiService.interceptors.request.use(
    (config) => {
        try {
            const accessToken = localStorage.getItem("access")

            // Faqat token bo'lsa qo'shamiz
            if (accessToken) {
                config.headers = config.headers || {}
                config.headers["Authorization"] = `Bearer ${accessToken}`
            }
        } catch (_) {
            // localStorage not available or parse error, ignore
        }
        return config
    },
    (error) => Promise.reject(error)
)

export default apiService
