import { Navigate, useLocation } from "react-router-dom"

const RequireAuth = ({ children }) => {
    const location = useLocation()
    const access = typeof window !== "undefined" ? localStorage.getItem("access") : null
    const user = typeof window !== "undefined" ? localStorage.getItem("user") : null

    if (!access || !user) {
        return <Navigate to="/login" replace state={{ from: location }} />
    }

    return children
}

export default RequireAuth


