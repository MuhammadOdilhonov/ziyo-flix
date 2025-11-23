import { Navigate, useLocation } from "react-router-dom"
import useSelectedChannel from "../hooks/useSelectedChannel"

function getStoredUser() {
    try {
        const raw = localStorage.getItem("user")
        return raw ? JSON.parse(raw) : null
    } catch {
        return null
    }
}

const RequireTeacherChannel = ({ children }) => {
    const location = useLocation()
    const { selectedChannel } = useSelectedChannel()
    const user = getStoredUser()

    // Must be authenticated by outer RequireAuth already
    if (!user) {
        return <Navigate to="/login" replace state={{ from: location }} />
    }

    // Only teachers may access
    if (user?.role !== "teacher") {
        return <Navigate to="/" replace />
    }

    // Allow accessing the channel selector route without a selection
    const isOnSelector = location.pathname.includes("/profile/teacher/channels")
    if (!selectedChannel && !isOnSelector) {
        return <Navigate to="/profile/teacher/channels" replace state={{ from: location }} />
    }

    return children
}

export default RequireTeacherChannel
