"use client"

import { useState, useEffect } from "react"
import { FiUsers, FiVideo, FiDollarSign, FiTrendingUp, FiBarChart2 } from "react-icons/fi"

const DirectorDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalTeachers: 0,
        totalVideos: 0,
        totalRevenue: 0,
        monthlyGrowth: 0,
    })

    useEffect(() => {
        fetchDashboardStats()
    }, [])

    const fetchDashboardStats = async () => {
        // Mock data - replace with actual API call
        setStats({
            totalUsers: 1250,
            totalTeachers: 45,
            totalVideos: 320,
            totalRevenue: 15750,
            monthlyGrowth: 12.5,
        })
    }

    return (
        <div className="director-dashboard" data-theme={localStorage.getItem("theme") || "light"}>
            <div className="dashboard-header">
                <h1>Direktor Dashboard</h1>
                <p>Platformaning umumiy holati va statistikalar</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">
                        <FiUsers />
                    </div>
                    <div className="stat-content">
                        <h3>{stats.totalUsers}</h3>
                        <p>Jami foydalanuvchilar</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">
                        <FiVideo />
                    </div>
                    <div className="stat-content">
                        <h3>{stats.totalVideos}</h3>
                        <p>Jami video darsliklar</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">
                        <FiDollarSign />
                    </div>
                    <div className="stat-content">
                        <h3>{stats.totalRevenue} FixCoin</h3>
                        <p>Jami daromad</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">
                        <FiTrendingUp />
                    </div>
                    <div className="stat-content">
                        <h3>+{stats.monthlyGrowth}%</h3>
                        <p>Oylik o'sish</p>
                    </div>
                </div>
            </div>

            <div className="dashboard-charts">
                <div className="chart-container">
                    <h3>Foydalanuvchilar statistikasi</h3>
                    <div className="chart-placeholder">
                        <FiBarChart2 size={48} />
                        <p>Grafik bu yerda ko'rsatiladi</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DirectorDashboard
