import apiService from "./apiService"

// Signup user and store tokens + user in localStorage
// Expected payload: { username, email, password, role, first_name, last_name }
export const register = async (payload) => {
    const response = await apiService.post(`/users/signup/`, payload)
    const data = response?.data || {}

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

export default { register }


