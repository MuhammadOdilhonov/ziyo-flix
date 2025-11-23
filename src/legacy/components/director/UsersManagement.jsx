import React, { useState, useEffect } from 'react';
import { FiUsers, FiUserCheck, FiPlus, FiEdit2, FiTrash2, FiMail, FiUser, FiX, FiSearch } from 'react-icons/fi';
import { FaGraduationCap } from 'react-icons/fa';
import * as directorAPI from '../../api/apiDirectorProfile';

const UsersManagement = ({ role = 'user' }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        role: role,
        password: '',
    });

    useEffect(() => {
        fetchUsers();
    }, [role]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await directorAPI.getUsersByRole(role);
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
            alert('Foydalanuvchilarni yuklashda xatolik yuz berdi');
        } finally {
            setLoading(false);
        }
    };

    const openModal = (user = null) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                username: user.username,
                email: user.email || '',
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                role: user.role,
                password: '',
            });
        } else {
            setEditingUser(null);
            setFormData({
                username: '',
                email: '',
                first_name: '',
                last_name: '',
                role: role,
                password: '',
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingUser(null);
    };

    const openDetailModal = (user) => {
        setSelectedUser(user);
        setShowDetailModal(true);
    };

    const closeDetailModal = () => {
        setShowDetailModal(false);
        setSelectedUser(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            username: formData.username,
            email: formData.email,
            first_name: formData.first_name,
            last_name: formData.last_name,
            role: formData.role,
        };

        if (formData.password) {
            data.password = formData.password;
        }

        try {
            if (editingUser) {
                await directorAPI.updateUser(editingUser.id, data);
                alert('Foydalanuvchi muvaffaqiyatli yangilandi!');
            } else {
                await directorAPI.createUser(data);
                alert('Foydalanuvchi muvaffaqiyatli yaratildi!');
            }
            closeModal();
            fetchUsers();
        } catch (error) {
            console.error('Error saving user:', error);
            alert('Foydalanuvchini saqlashda xatolik yuz berdi');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Foydalanuvchini o\'chirmoqchimisiz?')) return;

        try {
            await directorAPI.deleteUser(id);
            alert('Foydalanuvchi muvaffaqiyatli o\'chirildi!');
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Foydalanuvchini o\'chirishda xatolik yuz berdi');
        }
    };

    const getRoleInfo = () => {
        switch (role) {
            case 'user':
                return {
                    title: 'Foydalanuvchilar',
                    icon: FiUsers,
                    color: 'blue',
                    description: 'Tizim foydalanuvchilarini boshqaring'
                };
            case 'teacher':
                return {
                    title: 'O\'qituvchilar',
                    icon: FaGraduationCap,
                    color: 'green',
                    description: 'O\'qituvchilarni boshqaring'
                };
            case 'admin':
                return {
                    title: 'Administratorlar',
                    icon: FiUserCheck,
                    color: 'purple',
                    description: 'Administratorlarni boshqaring'
                };
            default:
                return {
                    title: 'Foydalanuvchilar',
                    icon: FiUsers,
                    color: 'blue',
                    description: 'Foydalanuvchilarni boshqaring'
                };
        }
    };

    const roleInfo = getRoleInfo();
    const RoleIcon = roleInfo.icon;

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="um">
            <div className="um__header">
                <div className="um__header-content">
                    <div className="um__header-icon" data-color={roleInfo.color}>
                        <RoleIcon />
                    </div>
                    <div>
                        <h1>{roleInfo.title}</h1>
                        <p>{roleInfo.description}</p>
                    </div>
                </div>
                <button className="um__add-btn" onClick={() => openModal()}>
                    <FiPlus />
                    Yangi Qo'shish
                </button>
            </div>

            <div className="um__controls">
                <div className="um__search">
                    <FiSearch />
                    <input
                        type="text"
                        placeholder="Qidirish..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="um__stats">
                    <span className="um__count">Jami: {users.length}</span>
                </div>
            </div>

            {loading ? (
                <div className="um__loading">
                    <div className="um__spinner"></div>
                    <p>Yuklanmoqda...</p>
                </div>
            ) : filteredUsers.length === 0 ? (
                <div className="um__empty">
                    <RoleIcon />
                    <h3>Foydalanuvchilar yo'q</h3>
                    <p>Yangi foydalanuvchi qo'shish uchun yuqoridagi tugmani bosing</p>
                </div>
            ) : (
                <div className="um__table-container">
                    <table className="um__table">
                        <thead>
                            <tr>
                                <th>Foydalanuvchi</th>
                                <th>Email</th>
                                <th>Ism Familiya</th>
                                <th>Rol</th>
                                <th>Amallar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user.id} onClick={() => openDetailModal(user)} style={{ cursor: 'pointer' }}>
                                    <td>
                                        <div className="um__user-cell">
                                            <div className="um__avatar">
                                                {user.avatar ? (
                                                    <img src={user.avatar} alt={user.username} />
                                                ) : (
                                                    <FiUser />
                                                )}
                                            </div>
                                            <span className="um__username">{user.username}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="um__email">
                                            {user.email ? (
                                                <>
                                                    <FiMail />
                                                    <span>{user.email}</span>
                                                </>
                                            ) : (
                                                <span className="um__no-data">Email yo'q</span>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <span className="um__name">
                                            {user.first_name || user.last_name
                                                ? `${user.first_name} ${user.last_name}`.trim()
                                                : <span className="um__no-data">Ism yo'q</span>
                                            }
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`um__role-badge um__role-badge--${user.role}`}>
                                            {user.role === 'user' && 'Foydalanuvchi'}
                                            {user.role === 'teacher' && 'O\'qituvchi'}
                                            {user.role === 'admin' && 'Administrator'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="um__actions" onClick={(e) => e.stopPropagation()}>
                                            <button
                                                className="um__action-btn um__action-btn--edit"
                                                onClick={() => openModal(user)}
                                                title="Tahrirlash"
                                            >
                                                <FiEdit2 />
                                            </button>
                                            <button
                                                className="um__action-btn um__action-btn--delete"
                                                onClick={() => handleDelete(user.id)}
                                                title="O'chirish"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showModal && (
                <div className="um__modal-overlay" onClick={closeModal}>
                    <div className="um__modal" onClick={(e) => e.stopPropagation()}>
                        <div className="um__modal-header">
                            <h2>{editingUser ? 'Foydalanuvchini Tahrirlash' : 'Yangi Foydalanuvchi'}</h2>
                            <button className="um__close-btn" onClick={closeModal}>
                                <FiX />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="um__form">
                            <div className="um__form-body">
                                <div className="um__form-row">
                                    <div className="um__form-group">
                                        <label>Username *</label>
                                        <input
                                            type="text"
                                            value={formData.username}
                                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                            placeholder="username"
                                            required
                                        />
                                    </div>

                                    <div className="um__form-group">
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="email@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="um__form-row">
                                    <div className="um__form-group">
                                        <label>Ism</label>
                                        <input
                                            type="text"
                                            value={formData.first_name}
                                            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                            placeholder="Ism"
                                        />
                                    </div>

                                    <div className="um__form-group">
                                        <label>Familiya</label>
                                        <input
                                            type="text"
                                            value={formData.last_name}
                                            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                            placeholder="Familiya"
                                        />
                                    </div>
                                </div>

                                <div className="um__form-row">
                                    <div className="um__form-group">
                                        <label>Rol *</label>
                                        <select
                                            value={formData.role}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                            required
                                        >
                                            <option value="user">Foydalanuvchi</option>
                                            <option value="teacher">O'qituvchi</option>
                                            <option value="admin">Administrator</option>
                                        </select>
                                    </div>

                                    <div className="um__form-group">
                                        <label>Parol {!editingUser && '*'}</label>
                                        <input
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            placeholder={editingUser ? "O'zgartirish uchun kiriting" : "Parol"}
                                            required={!editingUser}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="um__modal-footer">
                                <button type="button" className="um__btn um__btn--secondary" onClick={closeModal}>
                                    Bekor qilish
                                </button>
                                <button type="submit" className="um__btn um__btn--primary">
                                    {editingUser ? 'Yangilash' : 'Yaratish'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showDetailModal && selectedUser && (
                <div className="um__modal-overlay" onClick={closeDetailModal}>
                    <div className="um__modal um__modal--detail" onClick={(e) => e.stopPropagation()}>
                        <div className="um__modal-header">
                            <h2>Foydalanuvchi Ma'lumotlari</h2>
                            <button className="um__close-btn" onClick={closeDetailModal}>
                                <FiX />
                            </button>
                        </div>

                        <div className="um__modal-body">
                            <div className="um__detail-hero">
                                <div className="um__detail-avatar">
                                    {selectedUser.avatar ? (
                                        <img src={selectedUser.avatar} alt={selectedUser.username} />
                                    ) : (
                                        <FiUser />
                                    )}
                                </div>
                                <h3 className="um__detail-username">{selectedUser.username}</h3>
                                <span className={`um__role-badge um__role-badge--${selectedUser.role}`}>
                                    {selectedUser.role === 'user' && 'Foydalanuvchi'}
                                    {selectedUser.role === 'teacher' && 'O\'qituvchi'}
                                    {selectedUser.role === 'admin' && 'Administrator'}
                                </span>
                            </div>

                            <div className="um__detail-grid">
                                <div className="um__detail-item">
                                    <div className="um__detail-icon">
                                        <FiUser />
                                    </div>
                                    <div className="um__detail-content">
                                        <span className="um__detail-title">Username</span>
                                        <span className="um__detail-text">{selectedUser.username}</span>
                                    </div>
                                </div>

                                <div className="um__detail-item">
                                    <div className="um__detail-icon">
                                        <FiMail />
                                    </div>
                                    <div className="um__detail-content">
                                        <span className="um__detail-title">Email</span>
                                        <span className="um__detail-text">
                                            {selectedUser.email || <span className="um__no-data">Email yo'q</span>}
                                        </span>
                                    </div>
                                </div>

                                <div className="um__detail-item">
                                    <div className="um__detail-icon">
                                        <FiUser />
                                    </div>
                                    <div className="um__detail-content">
                                        <span className="um__detail-title">Ism</span>
                                        <span className="um__detail-text">
                                            {selectedUser.first_name || <span className="um__no-data">Ism yo'q</span>}
                                        </span>
                                    </div>
                                </div>

                                <div className="um__detail-item">
                                    <div className="um__detail-icon">
                                        <FiUser />
                                    </div>
                                    <div className="um__detail-content">
                                        <span className="um__detail-title">Familiya</span>
                                        <span className="um__detail-text">
                                            {selectedUser.last_name || <span className="um__no-data">Familiya yo'q</span>}
                                        </span>
                                    </div>
                                </div>

                                <div className="um__detail-item">
                                    <div className="um__detail-icon">
                                        <FiUserCheck />
                                    </div>
                                    <div className="um__detail-content">
                                        <span className="um__detail-title">Rol</span>
                                        <span className="um__detail-text">
                                            {selectedUser.role === 'user' && 'Foydalanuvchi'}
                                            {selectedUser.role === 'teacher' && 'O\'qituvchi'}
                                            {selectedUser.role === 'admin' && 'Administrator'}
                                        </span>
                                    </div>
                                </div>

                                <div className="um__detail-item">
                                    <div className="um__detail-icon">
                                        <FiUser />
                                    </div>
                                    <div className="um__detail-content">
                                        <span className="um__detail-title">User ID</span>
                                        <span className="um__detail-text">#{selectedUser.id}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="um__modal-footer">
                            <button 
                                className="um__btn um__btn--secondary" 
                                onClick={closeDetailModal}
                            >
                                Yopish
                            </button>
                            <button 
                                className="um__btn um__btn--primary" 
                                onClick={() => {
                                    closeDetailModal();
                                    openModal(selectedUser);
                                }}
                            >
                                <FiEdit2 />
                                Tahrirlash
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersManagement;
