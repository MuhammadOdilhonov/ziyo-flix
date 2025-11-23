"use client"

import { useState, useEffect } from "react"
import { FiSearch, FiFilter, FiEdit, FiTrash2, FiEye } from "react-icons/fi"

const DirectorUsers = () => {
    const [users, setUsers] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [filterRole, setFilterRole] = useState("all")

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        // Mock data - replace with actual API call
        const mockUsers = [
            {
                id: 1,
                name: "Ahmadjon Karimov",
                email: "ahmad@example.com",
                role: "user",
                status: "active",
                joinDate: "2024-01-15",
                fixCoins: 150,
            },
            {
                id: 2,
                name: "Malika Tosheva",
                email: "malika@example.com",
                role: "teacher",
                status: "active",
                joinDate: "2024-02-10",
                fixCoins: 750,
            },
        ]
        setUsers(mockUsers)
    }

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesRole = filterRole === "all" || user.role === filterRole
        return matchesSearch && matchesRole
    })

    const handleBlockUser = (userId) => {
        console.log("[v0] Blocking user:", userId)
        // Implement block user functionality
    }

    const handleDeleteUser = (userId) => {
        console.log("[v0] Deleting user:", userId)
        // Implement delete user functionality
    }

    return (
        <div className="director-users">
            <div className="users-header">
                <h1>Foydalanuvchilar boshqaruvi</h1>
                <p>Barcha foydalanuvchilarni ko'rish va boshqarish</p>
            </div>

            <div className="users-controls">
                <div className="search-box">
                    <FiSearch />
                    <input
                        type="text"
                        placeholder="Foydalanuvchi qidirish..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="filter-box">
                    <FiFilter />
                    <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
                        <option value="all">Barcha rollar</option>
                        <option value="user">O'quvchilar</option>
                        <option value="teacher">O'qituvchilar</option>
                        <option value="admin">Administratorlar</option>
                    </select>
                </div>
            </div>

            <div className="users-table">
                <table>
                    <thead>
                        <tr>
                            <th>Foydalanuvchi</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Status</th>
                            <th>FixCoin</th>
                            <th>Qo'shilgan sana</th>
                            <th>Amallar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user.id}>
                                <td>
                                    <div className="user-info">
                                        <div className="user-avatar">{user.name.charAt(0)}</div>
                                        <span>{user.name}</span>
                                    </div>
                                </td>
                                <td>{user.email}</td>
                                <td>
                                    <span className={`role-badge role-${user.role}`}>
                                        {user.role === "user" ? "O'quvchi" : user.role === "teacher" ? "O'qituvchi" : "Administrator"}
                                    </span>
                                </td>
                                <td>
                                    <span className={`status-badge status-${user.status}`}>
                                        {user.status === "active" ? "Faol" : "Bloklangan"}
                                    </span>
                                </td>
                                <td>{user.fixCoins} FC</td>
                                <td>{user.joinDate}</td>
                                <td>
                                    <div className="actions">
                                        <button className="action-btn" title="Ko'rish">
                                            <FiEye />
                                        </button>
                                        <button className="action-btn" title="Tahrirlash">
                                            <FiEdit />
                                        </button>
                                        <button className="action-btn danger" title="O'chirish" onClick={() => handleDeleteUser(user.id)}>
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default DirectorUsers
