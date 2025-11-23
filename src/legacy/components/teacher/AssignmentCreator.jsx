"use client"

import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { FiClipboard, FiSave } from "react-icons/fi"

const AssignmentCreator = ({ assignmentData, onSave, onCancel }) => {
    const navigate = useNavigate()
    const location = useLocation()
    const params = new URLSearchParams(location.search)
    const videoId = params.get("videoId")

    const [form, setForm] = useState({
        title: assignmentData?.title || "",
        description: assignmentData?.description || "",
        instructions: assignmentData?.instructions || "",
        dueDaysAfterCompletion: assignmentData?.due_days_after_completion || 7,
        maxScore: assignmentData?.max_points || 100,
        attachment: null,
        type: assignmentData?.type || "project"
    })

    useEffect(() => {
        document.title = "Vazifa yaratish — Teacher"
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!form.title.trim() || !form.description.trim()) {
            alert("Majburiy maydonlarni to'ldiring")
            return
        }
        
        // API uchun ma'lumotlarni tayyorlash
        const assignmentPayload = {
            title: form.title,
            description: form.description,
            instructions: form.instructions,
            due_days_after_completion: form.dueDaysAfterCompletion,
            max_points: form.maxScore,
            type: form.type,
            is_active: true
        }
        
        if (onSave) {
            onSave(assignmentPayload)
        } else {
            // Fallback - eski funksionallik
            console.log("[AssignmentCreator] Create for video:", videoId, assignmentPayload)
            const titleParam = encodeURIComponent(form.title)
            navigate(`/profile/teacher/videos/upload?assignmentDone=1${videoId ? `&videoId=${videoId}` : ""}&title=${titleParam}`)
        }
    }

    return (
        <div className="teacher-assignment-creator">
            <div className="creator-header">
                <h1><FiClipboard /> Vazifa yaratish</h1>
                {videoId && <p>Video ID: {videoId}</p>}
            </div>

            <div className="creator-card">
                <form onSubmit={handleSubmit} className="creator-form">
                    <div className="form-group">
                        <label>Vazifa nomi *</label>
                        <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Masalan: Funksiyalar bilan ishlash" />
                    </div>

                    <div className="form-group">
                        <label>Tavsif *</label>
                        <textarea rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Vazifa haqida qisqacha ma'lumot" />
                    </div>

                    <div className="form-group">
                        <label>Ko'rsatmalar *</label>
                        <textarea rows="4" value={form.instructions} onChange={(e) => setForm({ ...form, instructions: e.target.value })} placeholder="Talabalar uchun batafsil ko'rsatmalar" />
                    </div>

                    <div className="form-group">
                        <label>Vazifa turi</label>
                        <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                            <option value="project">Loyiha</option>
                            <option value="coding">Kodlash</option>
                            <option value="design">Dizayn</option>
                            <option value="essay">Insho</option>
                            <option value="research">Tadqiqot</option>
                        </select>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Muddat (video tugagandan keyin necha kun)</label>
                            <input 
                                type="number" 
                                min="1" 
                                max="365" 
                                value={form.dueDaysAfterCompletion} 
                                onChange={(e) => setForm({ ...form, dueDaysAfterCompletion: Number.parseInt(e.target.value) || 7 })} 
                                placeholder="Masalan: 7 kun"
                            />
                            <small className="form-help">Video tugagandan keyin necha kun ichida topshirish kerak</small>
                        </div>
                        <div className="form-group">
                            <label>Maksimal ball</label>
                            <input type="number" min="1" max="100" value={form.maxScore} onChange={(e) => setForm({ ...form, maxScore: Number.parseInt(e.target.value) || 1 })} />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Fayl biriktirish (ixtiyoriy)</label>
                        <input type="file" onChange={(e) => setForm({ ...form, attachment: e.target.files?.[0] || null })} />
                    </div>

                    <div className="form-actions">
                        <button 
                            type="button" 
                            className="btn btn-secondary" 
                            onClick={() => onCancel ? onCancel() : navigate(-1)}
                        >
                            Bekor qilish
                        </button>
                        <button type="submit" className="btn btn-primary">
                            <FiSave /> {assignmentData ? 'Yangilash' : 'Saqlash'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AssignmentCreator


