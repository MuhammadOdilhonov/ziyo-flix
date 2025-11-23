"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { BsArrowLeft, BsUpload, BsFileEarmarkText, BsCheckCircle, BsTrash, BsAward } from "react-icons/bs"
import Skeleton from "../common/Skeleton"
import { getAssignmentsByVideo, submitAssignment } from "../../api/apiAssignments"

const AssignmentUpload = () => {
    const { tutorialSlug, lessonId } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const fileInputRef = useRef(null)

    // Get lesson data from location state
    const lessonData = location.state?.lesson

    const [selectedFile, setSelectedFile] = useState(null)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadCompleted, setUploadCompleted] = useState(false)
    const [assignmentScore, setAssignmentScore] = useState(null)
    const [feedback, setFeedback] = useState("")
    const [dragActive, setDragActive] = useState(false)
    const [assignments, setAssignments] = useState([])
    const [loadingAssignments, setLoadingAssignments] = useState(true)
    const [selectedAssignment, setSelectedAssignment] = useState(null)
    const [textAnswer, setTextAnswer] = useState("")
    const [externalLink, setExternalLink] = useState("")

    const maxFileSize = 10 * 1024 * 1024 // 10MB
    const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
        "image/jpeg",
        "image/png",
        "application/zip",
        "application/x-zip-compressed",
    ]

    // Kech topshirish tekshirish funksiyasi
    const checkIfOverdue = (assignment, videoCompletedAt) => {
        if (!assignment.due_days_after_completion || !videoCompletedAt) return false
        
        const completedDate = new Date(videoCompletedAt)
        const dueDate = new Date(completedDate.getTime() + (assignment.due_days_after_completion * 24 * 60 * 60 * 1000))
        const now = new Date()
        
        return now > dueDate
    }

    // Qolgan vaqtni hisoblash
    const getTimeRemaining = (assignment, videoCompletedAt) => {
        if (!assignment.due_days_after_completion || !videoCompletedAt) return null
        
        const completedDate = new Date(videoCompletedAt)
        const dueDate = new Date(completedDate.getTime() + (assignment.due_days_after_completion * 24 * 60 * 60 * 1000))
        const now = new Date()
        
        const diffMs = dueDate - now
        if (diffMs <= 0) return null
        
        const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000))
        const diffHours = Math.floor((diffMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
        
        if (diffDays > 0) return `${diffDays} kun ${diffHours} soat`
        return `${diffHours} soat`
    }

    useEffect(() => {
        let mounted = true
            ; (async () => {
                try {
                    setLoadingAssignments(true)
                    const res = await getAssignmentsByVideo(lessonId)
                    if (!mounted) return
                    const list = Array.isArray(res.results) ? res.results : []
                    setAssignments(list)
                    setSelectedAssignment(list[0] || null)
                } catch (_) {
                    if (mounted) {
                        setAssignments([])
                        setSelectedAssignment(null)
                    }
                } finally {
                    if (mounted) setLoadingAssignments(false)
                }
            })()
        return () => { mounted = false }
    }, [lessonId])

    const handleFileSelect = (file) => {
        if (!file) return

        // Check file size
        if (file.size > maxFileSize) {
            alert("Fayl hajmi 10MB dan oshmasligi kerak!")
            return
        }

        // Check file type
        if (!allowedTypes.includes(file.type)) {
            alert("Faqat PDF, Word, Text, Rasm va ZIP fayllar qabul qilinadi!")
            return
        }

        setSelectedFile(file)
    }

    const handleFileInputChange = (e) => {
        const file = e.target.files[0]
        handleFileSelect(file)
    }

    const handleDrag = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0])
        }
    }

    const handleUpload = async () => {
        if (!selectedAssignment) {
            alert("Vazifa topilmadi")
            return
        }

        if (!selectedFile && !textAnswer && !externalLink) {
            alert("Hech bo'lmaganda matn, havola yoki fayl kiriting/yuklang")
            return
        }

        // Kech topshirish tekshirish
        const videoCompletedAt = lessonData?.completed_at || localStorage.getItem(`video_completed_${lessonId}`)
        if (checkIfOverdue(selectedAssignment, videoCompletedAt)) {
            const confirmSubmit = window.confirm(
                "Bu vazifa muddati o'tgan! Kech topshirilgan vazifalar ball kamayishi bilan baholanishi mumkin. Davom etasizmi?"
            )
            if (!confirmSubmit) return
        }

        setIsUploading(true)
        setUploadProgress(0)

        try {
            await submitAssignment({
                assignment_id: selectedAssignment.id,
                text_answer: textAnswer,
                external_link: externalLink,
                attachment: selectedFile,
                onUploadProgress: (evt) => {
                    if (evt.total) {
                        const percent = Math.round((evt.loaded / evt.total) * 100)
                        setUploadProgress(percent)
                    }
                },
            })

            setIsUploading(false)
            setUploadCompleted(true)

            // Optional: keep minimal local record
            const assignmentResults = JSON.parse(localStorage.getItem("assignmentResults") || "{}")
            assignmentResults[lessonId] = {
                score: null,
                passed: null,
                fileName: selectedFile?.name || null,
                submittedAt: new Date().toISOString(),
            }
            localStorage.setItem("assignmentResults", JSON.stringify(assignmentResults))
        } catch (e) {
            console.error("Assignment submit failed", e)
            setIsUploading(false)
            alert("Yuborishda xatolik yuz berdi")
        }
    }

    const generateFeedback = (score) => {
        if (score >= 90) {
            return "A'lo! Vazifa juda yaxshi bajarilgan. Barcha talablar to'liq bajarilgan."
        } else if (score >= 80) {
            return "Yaxshi! Vazifa yaxshi bajarilgan, lekin ba'zi joylarni yaxshilash mumkin."
        } else if (score >= 70) {
            return "Qoniqarli. Vazifa asosiy talablarni qondiradi, lekin qo'shimcha ishlov berish talab qilinadi."
        } else {
            return "Vazifani qayta ko'rib chiqing. Ba'zi muhim qismlar etishmayapti yoki noto'g'ri bajarilgan."
        }
    }

    const formatFileSize = (bytes) => {
        if (bytes === 0) return "0 Bytes"
        const k = 1024
        const sizes = ["Bytes", "KB", "MB", "GB"]
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    }

    const handleGoBack = () => {
        navigate(`/tutorials/${tutorialSlug}`)
    }

    const removeFile = () => {
        setSelectedFile(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    // Do not block page if lessonData is missing; we can render using API data

    return (
        <div className="assignment-page">
            <div className="assignment-page-container">
                {/* Header */}
                <div className="assignment-page-header">
                    <button className="assignment-page-back" onClick={handleGoBack}>
                        <BsArrowLeft size={20} />
                        Orqaga
                    </button>
                    <h1 className="assignment-page-title">{lessonData?.title || selectedAssignment?.title || "Vazifa"}</h1>
                </div>

                {!uploadCompleted && (
                    <div className="assignment-page-content">
                        {/* Assignment Description */}
                        <div className="assignment-page-description">
                            {loadingAssignments ? (
                                <div className="skeleton-card">
                                    <Skeleton width="60%" height={24} rounded={6} />
                                    <div style={{ marginTop: 12 }}>
                                        <Skeleton lines={3} />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 12, marginTop: 14 }}>
                                        <Skeleton height={18} />
                                        <Skeleton height={18} />
                                        <Skeleton height={18} />
                                    </div>
                                </div>
                            ) : assignments.length === 0 ? (
                                <div className="skeleton-card" style={{ textAlign: 'center' }}>
                                    <h3 style={{ margin: 0 }}>Vazifa topilmadi</h3>
                                    <p style={{ opacity: 0.9 }}>Ushbu dars uchun vazifa mavjud emas.</p>
                                </div>
                            ) : (
                                <>
                                    <h2>{selectedAssignment?.title || "Vazifa"}</h2>
                                    <p>{selectedAssignment?.description || lessonData?.assignmentDescription || "Dars bo'yicha amaliy vazifani bajaring va natijani yuklang."}</p>

                                    <div className="assignment-page-meta">
                                        <p><strong>Maks. ball:</strong> {selectedAssignment?.max_points ?? "-"}</p>
                                        <p><strong>Topshirish muddati:</strong> {selectedAssignment?.due_days_after_completion ? `${selectedAssignment.due_days_after_completion} kun (video tugagandan keyin)` : "-"}</p>
                                        <p><strong>Bir nechta topshirish:</strong> {selectedAssignment?.allow_multiple_submissions ? "Ha" : "Yo'q"}</p>
                                    </div>

                                    <div className="assignment-page-requirements">
                                        <h3>Talablar:</h3>
                                        <ul>
                                            <li>Fayl hajmi 10MB dan oshmasligi kerak</li>
                                            <li>Qabul qilinadigan formatlar: PDF, Word, Text, Rasm, ZIP</li>
                                            <li>Agar baholash tizimi bo'lsa, o'qituvchi belgilagan mezonlar bo'yicha baholanadi</li>
                                            <li>Faqat videoni to'liq ko'rgandan keyin yuklash mumkin</li>
                                        </ul>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Text/Link and File Upload Area */}
                        <div className="assignment-page-upload">
                            <div className="assignment-page-textlink">
                                <label className="assignment-page-label">Matnli javob (ixtiyoriy)</label>
                                <textarea
                                    className="assignment-page-textarea"
                                    rows={4}
                                    value={textAnswer}
                                    onChange={(e) => setTextAnswer(e.target.value)}
                                    placeholder="Javobingizni bu yerga yozing..."
                                />

                                <label className="assignment-page-label">Tashqi havola (ixtiyoriy)</label>
                                <input
                                    type="url"
                                    className="assignment-page-input"
                                    value={externalLink}
                                    onChange={(e) => setExternalLink(e.target.value)}
                                    placeholder="https://"
                                />
                            </div>

                            <div
                                className={`assignment-page-dropzone ${dragActive ? "active" : ""} ${selectedFile ? "has-file" : ""}`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                                onClick={() => !selectedFile && fileInputRef.current?.click()}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    onChange={handleFileInputChange}
                                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.zip"
                                    style={{ display: "none" }}
                                />

                                {!selectedFile ? (
                                    <div className="assignment-page-dropzone-content">
                                        <BsUpload size={48} />
                                        <h3>Faylni yuklash</h3>
                                        <p>Faylni bu yerga sudrab olib keling yoki bosib tanlang</p>
                                        <span className="assignment-page-file-types">PDF, Word, Text, Rasm, ZIP (max 10MB)</span>
                                    </div>
                                ) : (
                                    <div className="assignment-page-selected-file">
                                        <BsFileEarmarkText size={48} />
                                        <div className="assignment-page-file-info">
                                            <h4>{selectedFile.name}</h4>
                                            <p>{formatFileSize(selectedFile.size)}</p>
                                        </div>
                                        <button
                                            className="assignment-page-remove-file"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                removeFile()
                                            }}
                                        >
                                            <BsTrash size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {!isUploading && (
                                loadingAssignments || assignments.length === 0 ? (
                                    <Skeleton height={40} rounded={10} />
                                ) : (
                                    <button className="assignment-page-upload-btn" onClick={handleUpload}>
                                        <BsUpload size={16} />
                                        Vazifani yuborish
                                    </button>
                                )
                            )}

                            {isUploading && (
                                <div className="assignment-page-progress">
                                    <div className="assignment-page-progress-bar">
                                        <div className="assignment-page-progress-fill" style={{ width: `${uploadProgress}%` }} />
                                    </div>
                                    <span className="assignment-page-progress-text">Yuklanmoqda... {Math.round(uploadProgress)}%</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {uploadCompleted && (
                    <div className="assignment-page-results">
                        <div className="assignment-page-success">
                            <div className="assignment-page-file-info">
                                <h4>Yuklangan fayl:</h4>
                                <div className="assignment-page-uploaded-file">
                                    <BsFileEarmarkText size={20} />
                                    <span>{selectedFile?.name}</span>
                                    <span className="file-size">({formatFileSize(selectedFile?.size || 0)})</span>
                                </div>
                            </div>
                        </div>

                        <div className="assignment-page-actions">
                            {assignmentScore !== null ? (
                                <button className="assignment-page-continue-btn" onClick={handleGoBack}>
                                    <BsAward size={16} />
                                    Keyingi darsga o'tish
                                </button>
                            ) : (
                                <button
                                    className="assignment-page-retry-btn"
                                    onClick={() => {
                                        setUploadCompleted(false)
                                        setAssignmentScore(null)
                                        setSelectedFile(null)
                                        setUploadProgress(0)
                                    }}
                                >
                                    Vazifani qayta yuklash
                                </button>
                            )}
                            <button className="assignment-page-back-btn" onClick={handleGoBack}>
                                Darslar ro'yxatiga qaytish
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AssignmentUpload
