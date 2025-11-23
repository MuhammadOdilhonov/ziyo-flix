"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
    FiClipboard,
    FiPlus,
    FiEdit,
    FiTrash2,
    FiEye,
    FiClock,
    FiUsers,
    FiCheck,
    FiX,
    FiSave,
    FiDownload,
    FiUpload,
    FiCalendar,
    FiBarChart2,
    FiFileText
} from "react-icons/fi"
import { teacherAPI } from "../../api/apiTeacher"

const AssignmentManagement = () => {
    const navigate = useNavigate()
    const { channelSlug, courseSlug, videoId } = useParams()
    const [loading, setLoading] = useState(true)
    const [assignments, setAssignments] = useState([])
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [editingAssignment, setEditingAssignment] = useState(null)
    const [newAssignment, setNewAssignment] = useState({
        title: '',
        description: '',
        due_days_after_completion: 7,
        max_points: 100,
        allow_multiple_submissions: false,
        is_active: true
    })

    useEffect(() => {
        if (videoId) {
            fetchAssignments()
        }
    }, [videoId])

    const fetchAssignments = async () => {
        try {
            setLoading(true)
            const response = await teacherAPI.getVideoAssignments(channelSlug, courseSlug, videoId)
            setAssignments(response.data.assignments || [])
        } catch (error) {
            console.error('Assignments fetch error:', error)
            // Mock data fallback
            setAssignments([
                {
                    id: 1,
                    course_video: 74,
                    title: "Homework 1",
                    description: "Solve the problems in the attached PDF.",
                    due_days_after_completion: 7,
                    max_points: 100,
                    allow_multiple_submissions: false,
                    is_active: true,
                    created_at: "2025-09-20T13:08:50.105495Z",
                    submissions_count: 1,
                    graded_count: 0,
                    avg_grade: null
                }
            ])
        } finally {
            setLoading(false)
        }
    }

    const handleCreateAssignment = async () => {
        try {
            const response = await teacherAPI.createVideoAssignment(channelSlug, courseSlug, videoId, newAssignment)
            setAssignments(prev => [...prev, response.data])
            setShowCreateModal(false)
            setNewAssignment({
                title: '',
                description: '',
                due_days_after_completion: 7,
                max_points: 100,
                allow_multiple_submissions: false,
                is_active: true
            })
        } catch (error) {
            console.error('Assignment creation error:', error)
            alert('Vazifa yaratishda xatolik!')
        }
    }

    const handleUpdateAssignment = async (assignmentId, updatedData) => {
        try {
            const response = await teacherAPI.updateVideoAssignment(channelSlug, courseSlug, videoId, assignmentId, updatedData)
            setAssignments(prev => prev.map(a => a.id === assignmentId ? response.data : a))
            setEditingAssignment(null)
        } catch (error) {
            console.error('Assignment update error:', error)
            alert('Vazifa yangilashda xatolik!')
        }
    }

    const handleDeleteAssignment = async (assignmentId) => {
        if (!window.confirm('Vazifani o\'chirishni xohlaysizmi?')) return

        try {
            await teacherAPI.deleteVideoAssignment(channelSlug, courseSlug, videoId, assignmentId)
            setAssignments(prev => prev.filter(a => a.id !== assignmentId))
        } catch (error) {
            console.error('Assignment deletion error:', error)
            alert('Vazifa o\'chirishda xatolik!')
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('uz-UZ', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const isOverdue = (dueDate) => {
        return new Date(dueDate) < new Date()
    }

    const getStatusColor = (assignment) => {
        if (!assignment.is_active) return 'inactive'
        // Overdue logic olib tashlandi - due_days_after_completion ishlatiladi
        return 'active'
    }

    if (loading) {
        return (
            <div className="assignment-management">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Vazifalar yuklanmoqda...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="assignment-management">
            <div className="page-header">
                <div className="header-content">
                    <h1><FiClipboard /> Vazifa boshqaruvi</h1>
                    <p>Video uchun vazifalar yarating va boshqaring</p>
                </div>
                <div className="header-actions">
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowCreateModal(true)}
                    >
                        <FiPlus /> Vazifa yaratish
                    </button>
                </div>
            </div>

            {assignments.length === 0 ? (
                <div className="empty-state">
                    <FiClipboard size={64} />
                    <h3>Vazifalar mavjud emas</h3>
                    <p>Bu video uchun hali vazifalar yaratilmagan</p>
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowCreateModal(true)}
                    >
                        <FiPlus /> Birinchi vazifani yaratish
                    </button>
                </div>
            ) : (
                <div className="assignments-list">
                    {assignments.map((assignment) => (
                        <div key={assignment.id} className={`assignment-card ${getStatusColor(assignment)}`}>
                            <div className="assignment-header">
                                <div className="assignment-title">
                                    <h3>{assignment.title}</h3>
                                    <span className={`status-badge ${getStatusColor(assignment)}`}>
                                        {!assignment.is_active ? 'Nofaol' :
                                            'Faol'}
                                    </span>
                                </div>
                                <div className="assignment-actions">
                                    <button
                                        className="btn btn-outline btn-sm"
                                        onClick={() => navigate(`/profile/teacher/assignments/${assignment.id}/submissions`)}
                                    >
                                        <FiEye /> Topshiriqlar
                                    </button>
                                    <button
                                        className="btn btn-secondary btn-sm"
                                        onClick={() => setEditingAssignment(assignment)}
                                    >
                                        <FiEdit /> Tahrirlash
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDeleteAssignment(assignment.id)}
                                    >
                                        <FiTrash2 /> O'chirish
                                    </button>
                                </div>
                            </div>

                            <div className="assignment-content">
                                <p className="assignment-description">{assignment.description}</p>

                                <div className="assignment-meta">
                                    <div className="meta-item">
                                        <FiCalendar />
                                        <span>Muddat: {assignment.due_days_after_completion} kun (video tugagandan keyin)</span>
                                    </div>
                                    <div className="meta-item">
                                        <FiBarChart2 />
                                        <span>Maksimal ball: {assignment.max_points}</span>
                                    </div>
                                    <div className="meta-item">
                                        <FiUsers />
                                        <span>Topshiriqlar: {assignment.submissions_count}</span>
                                    </div>
                                    <div className="meta-item">
                                        <FiCheck />
                                        <span>Baholangan: {assignment.graded_count}</span>
                                    </div>
                                </div>

                                {assignment.avg_grade && (
                                    <div className="assignment-stats">
                                        <div className="stat-item">
                                            <span className="stat-label">O'rtacha baho:</span>
                                            <span className="stat-value">{assignment.avg_grade.toFixed(1)}/{assignment.max_points}</span>
                                        </div>
                                    </div>
                                )}

                                <div className="assignment-settings">
                                    <div className="setting-item">
                                        <span>Ko'p marta topshirish:</span>
                                        <span className={assignment.allow_multiple_submissions ? 'enabled' : 'disabled'}>
                                            {assignment.allow_multiple_submissions ? 'Ruxsat etilgan' : 'Ruxsat etilmagan'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Assignment Modal */}
            {showCreateModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h2>Yangi vazifa yaratish</h2>
                            <button onClick={() => setShowCreateModal(false)}>×</button>
                        </div>
                        <div className="modal-content">
                            <div className="form-group">
                                <label>Vazifa sarlavhasi *</label>
                                <input
                                    type="text"
                                    value={newAssignment.title}
                                    onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                                    className="form-input"
                                    placeholder="Vazifa sarlavhasini kiriting"
                                />
                            </div>

                            <div className="form-group">
                                <label>Tavsif *</label>
                                <textarea
                                    value={newAssignment.description}
                                    onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                                    className="form-textarea"
                                    rows="4"
                                    placeholder="Vazifa haqida batafsil ma'lumot"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Muddat (video tugagandan keyin necha kun) *</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="365"
                                        value={newAssignment.due_days_after_completion}
                                        onChange={(e) => setNewAssignment({ ...newAssignment, due_days_after_completion: parseInt(e.target.value) || 7 })}
                                        className="form-input"
                                        placeholder="Masalan: 7 kun"
                                    />
                                    <small className="form-help">Video tugagandan keyin necha kun ichida topshirish kerak</small>
                                </div>

                                <div className="form-group">
                                    <label>Maksimal ball</label>
                                    <input
                                        type="number"
                                        value={newAssignment.max_points}
                                        onChange={(e) => setNewAssignment({ ...newAssignment, max_points: parseInt(e.target.value) })}
                                        className="form-input"
                                        min="1"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={newAssignment.allow_multiple_submissions}
                                        onChange={(e) => setNewAssignment({ ...newAssignment, allow_multiple_submissions: e.target.checked })}
                                    />
                                    Ko'p marta topshirishga ruxsat berish
                                </label>
                            </div>

                            <div className="form-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={newAssignment.is_active}
                                        onChange={(e) => setNewAssignment({ ...newAssignment, is_active: e.target.checked })}
                                    />
                                    Vazifa faol
                                </label>
                            </div>

                            <div className="modal-actions">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setShowCreateModal(false)}
                                >
                                    Bekor qilish
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={handleCreateAssignment}
                                    disabled={!newAssignment.title || !newAssignment.description || !newAssignment.due_days_after_completion}
                                >
                                    <FiPlus /> Vazifa yaratish
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Assignment Modal */}
            {editingAssignment && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h2>Vazifani tahrirlash</h2>
                            <button onClick={() => setEditingAssignment(null)}>×</button>
                        </div>
                        <div className="modal-content">
                            <div className="form-group">
                                <label>Vazifa sarlavhasi *</label>
                                <input
                                    type="text"
                                    value={editingAssignment.title}
                                    onChange={(e) => setEditingAssignment({ ...editingAssignment, title: e.target.value })}
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label>Tavsif *</label>
                                <textarea
                                    value={editingAssignment.description}
                                    onChange={(e) => setEditingAssignment({ ...editingAssignment, description: e.target.value })}
                                    className="form-textarea"
                                    rows="4"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Muddat (video tugagandan keyin necha kun) *</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="365"
                                        value={editingAssignment.due_days_after_completion}
                                        onChange={(e) => setEditingAssignment({ ...editingAssignment, due_days_after_completion: parseInt(e.target.value) || 7 })}
                                        className="form-input"
                                        placeholder="Masalan: 7 kun"
                                    />
                                    <small className="form-help">Video tugagandan keyin necha kun ichida topshirish kerak</small>
                                </div>

                                <div className="form-group">
                                    <label>Maksimal ball</label>
                                    <input
                                        type="number"
                                        value={editingAssignment.max_points}
                                        onChange={(e) => setEditingAssignment({ ...editingAssignment, max_points: parseInt(e.target.value) })}
                                        className="form-input"
                                        min="1"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={editingAssignment.allow_multiple_submissions}
                                        onChange={(e) => setEditingAssignment({ ...editingAssignment, allow_multiple_submissions: e.target.checked })}
                                    />
                                    Ko'p marta topshirishga ruxsat berish
                                </label>
                            </div>

                            <div className="form-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={editingAssignment.is_active}
                                        onChange={(e) => setEditingAssignment({ ...editingAssignment, is_active: e.target.checked })}
                                    />
                                    Vazifa faol
                                </label>
                            </div>

                            <div className="modal-actions">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setEditingAssignment(null)}
                                >
                                    Bekor qilish
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => handleUpdateAssignment(editingAssignment.id, editingAssignment)}
                                >
                                    <FiSave /> Saqlash
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AssignmentManagement
