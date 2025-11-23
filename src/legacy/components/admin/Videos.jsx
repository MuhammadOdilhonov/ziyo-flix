"use client"

import { useState, useEffect } from "react"
import { FiCheck, FiX, FiEye } from "react-icons/fi"

const AdminVideos = () => {
    const [videos, setVideos] = useState([])
    const [filter, setFilter] = useState("pending")

    useEffect(() => {
        fetchVideos()
    }, [])

    const fetchVideos = async () => {
        // Mock data - replace with actual API call
        const mockVideos = [
            {
                id: 1,
                title: "JavaScript Asoslari - 1-dars",
                teacher: "Malika Tosheva",
                duration: "45:30",
                category: "Programming",
                status: "pending",
                uploadDate: "2024-03-15",
                thumbnail: "/placeholder.svg?height=120&width=200",
                price: 50,
            },
            {
                id: 2,
                title: "React Hooks Tutorial",
                teacher: "Ahmadjon Karimov",
                duration: "32:15",
                category: "Programming",
                status: "approved",
                uploadDate: "2024-03-14",
                thumbnail: "/placeholder.svg?height=120&width=200",
                price: 75,
            },
        ]
        setVideos(mockVideos)
    }

    const handleApprove = (videoId) => {
        console.log("[v0] Approving video:", videoId)
        setVideos(videos.map((video) => (video.id === videoId ? { ...video, status: "approved" } : video)))
    }

    const handleReject = (videoId, reason) => {
        console.log("[v0] Rejecting video:", videoId, "Reason:", reason)
        setVideos(
            videos.map((video) => (video.id === videoId ? { ...video, status: "rejected", rejectionReason: reason } : video)),
        )
    }

    const filteredVideos = videos.filter((video) => {
        if (filter === "all") return true
        return video.status === filter
    })

    return (
        <div className="admin-videos">
            <div className="videos-header">
                <h1>Video darsliklar boshqaruvi</h1>
                <p>O'qituvchilar yuklagan videolarni tasdiqlash va rad etish</p>
            </div>

            <div className="videos-filters">
                <button className={filter === "pending" ? "active" : ""} onClick={() => setFilter("pending")}>
                    Kutilayotgan ({videos.filter((v) => v.status === "pending").length})
                </button>
                <button className={filter === "approved" ? "active" : ""} onClick={() => setFilter("approved")}>
                    Tasdiqlangan ({videos.filter((v) => v.status === "approved").length})
                </button>
                <button className={filter === "rejected" ? "active" : ""} onClick={() => setFilter("rejected")}>
                    Rad etilgan ({videos.filter((v) => v.status === "rejected").length})
                </button>
                <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>
                    Barchasi ({videos.length})
                </button>
            </div>

            <div className="videos-grid">
                {filteredVideos.map((video) => (
                    <div key={video.id} className="video-card">
                        <div className="video-thumbnail">
                            <img src={video.thumbnail || "/placeholder.svg"} alt={video.title} />
                            <div className="video-duration">{video.duration}</div>
                            <div className={`video-status status-${video.status}`}>
                                {video.status === "pending" && "Kutilmoqda"}
                                {video.status === "approved" && "Tasdiqlangan"}
                                {video.status === "rejected" && "Rad etilgan"}
                            </div>
                        </div>

                        <div className="video-content">
                            <h3>{video.title}</h3>
                            <p className="video-teacher">O'qituvchi: {video.teacher}</p>
                            <p className="video-category">Kategoriya: {video.category}</p>
                            <p className="video-price">Narx: {video.price} FixCoin</p>
                            <p className="video-date">Yuklangan: {video.uploadDate}</p>

                            {video.status === "pending" && (
                                <div className="video-actions">
                                    <button className="btn btn-success" onClick={() => handleApprove(video.id)}>
                                        <FiCheck /> Tasdiqlash
                                    </button>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => {
                                            const reason = prompt("Rad etish sababini kiriting:")
                                            if (reason) handleReject(video.id, reason)
                                        }}
                                    >
                                        <FiX /> Rad etish
                                    </button>
                                    <button className="btn btn-secondary">
                                        <FiEye /> Ko'rish
                                    </button>
                                </div>
                            )}

                            {video.status === "rejected" && video.rejectionReason && (
                                <div className="rejection-reason">
                                    <strong>Rad etish sababi:</strong> {video.rejectionReason}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AdminVideos
