import apiService, { BaseUrl } from "./apiService"

// Login API: posts credentials, stores tokens and user, and returns payload
export const login = async ({ username, password }) => {
    const response = await apiService.post(`/users/login/`, { username, password })
    const data = response?.data || {}
    console.log(data);
    

    // Expecting: { refresh, access, user }
    if (data?.access) {
        localStorage.setItem("access", data.access)
    }
    if (data?.refresh) {
        localStorage.setItem("refresh", data.refresh)
    }
    if (data?.user) {
        localStorage.setItem("user", JSON.stringify(data.user))
    }

    return data
}

export default { login }


