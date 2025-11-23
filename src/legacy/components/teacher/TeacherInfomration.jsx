"use client"

import { useState, useEffect, useCallback } from "react"
import {
    FiPlus, FiEdit, FiTrash2, FiEye, FiUsers, FiStar, FiDollarSign,
    FiCalendar, FiBook, FiPlay, FiAward, FiTrendingUp, FiClock,
    FiBookOpen, FiVideo, FiGlobe, FiCheck, FiX, FiImage, FiTag, FiMoreVertical,
    FiFileText, FiClipboard, FiMinus, FiSave, FiList, FiSettings
} from "react-icons/fi"
import { useNavigate, useParams } from "react-router-dom"
import { teacherCoursesAPI } from "../../api/apiTeacherInformationCourses"
import { courseTypeTestsAPI } from "../../api/apiCourseTypeTests"
import { courseTypeAssignmentsAPI } from "../../api/apiCourseTypeAssignments"
import useSelectedChannel from "../../hooks/useSelectedChannel"
import { BaseUrlReels } from "../../api/apiService"

const TeacherInfomration = () => {
    const [courses, setCourses] = useState([])
    const [categories, setCategories] = useState([])
    const [languages, setLanguages] = useState([])
    const [loading, setLoading] = useState(true)
    const [statusFilter, setStatusFilter] = useState('all') // all, approved, moderation, rejected
    const [showReasonModal, setShowReasonModal] = useState(false)
    const [selectedReason, setSelectedReason] = useState(null)

    console.log("TeacherInfomration component rendered")
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showDetailModal, setShowDetailModal] = useState(false)
    const [editingCourse, setEditingCourse] = useState(null)
    const [selectedCourse, setSelectedCourse] = useState(null)
    const [courseForm, setCourseForm] = useState({
        title: "",
        slug: "",
        description: "",
        language: "",
        categories: [],
        is_free: true,
        price: "",
        level: "beginner",
        is_new: false,
        is_bestseller: false,
        is_serial: true,
        certificate_available: true,
        cover: null,
        thumbnail: null,
        purchase_scope: "course"
    })

    // Oylar tizimi uchun state
    const [showMonthsModal, setShowMonthsModal] = useState(false)
    const [showCreateMonthModal, setShowCreateMonthModal] = useState(false)
    const [courseMonths, setCourseMonths] = useState([])
    const [editingMonth, setEditingMonth] = useState(null)
    const [monthMenuOpen, setMonthMenuOpen] = useState(null)
    const [courseMenuOpen, setCourseMenuOpen] = useState(null)
    const [monthForm, setMonthForm] = useState({
        name: "",
        description: "",
        price: "",
        is_free: true
    })

    // Test va vazifa yaratish uchun state
    const [showTestModal, setShowTestModal] = useState(false)
    const [showAssignmentModal, setShowAssignmentModal] = useState(false)
    const [selectedMonth, setSelectedMonth] = useState(null)
    const [testForm, setTestForm] = useState({
        title: "",
        description: "",
        time_limit_minutes: 30,
        attempts_allowed: 2,
        pass_score: 70,
        is_active: true,
        questions: []
    })
    const [assignmentForm, setAssignmentForm] = useState({
        title: "",
        description: "",
        due_days_after_completion: 7,
        max_points: 100,
        allow_multiple_submissions: false,
        is_active: true
    })

    // Test va vazifalarni ko'rish uchun state
    const [showViewTestsModal, setShowViewTestsModal] = useState(false)
    const [showViewAssignmentsModal, setShowViewAssignmentsModal] = useState(false)
    const [monthTests, setMonthTests] = useState([])
    const [monthAssignments, setMonthAssignments] = useState([])
    const [loadingTests, setLoadingTests] = useState(false)
    const [loadingAssignments, setLoadingAssignments] = useState(false)
    const [showTestDetailModal, setShowTestDetailModal] = useState(false)
    const [showAssignmentDetailModal, setShowAssignmentDetailModal] = useState(false)
    const [selectedTest, setSelectedTest] = useState(null)
    const [selectedAssignment, setSelectedAssignment] = useState(null)

    const navigate = useNavigate()
    const { channelSlug } = useParams()
    const { selectedChannel } = useSelectedChannel() // Destructure qilish

    // Rasm URL ni to'g'ri formatga keltirish
    const getImageUrl = useCallback((imagePath) => {
        if (!imagePath) return "https://bilgi.uz/upload/resize_cache/iblock/6e9/1dj1lspzqfnq210mfyxuvjxojnkr59ii/0_350_2/920__95_6824759.png"
        if (imagePath.startsWith('http')) return imagePath
        return `${BaseUrlReels}${imagePath.startsWith('/') ? imagePath : '/' + imagePath}`
    }, [])

    // Slug avtomatik yaratish
    const generateSlug = useCallback((title) => {
        if (!title) return ""
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '') // Faqat harflar, raqamlar, probel va tire
            .replace(/\s+/g, '-') // Probellarni tire bilan almashtirish
            .replace(/-+/g, '-') // Ko'p tirelarni bitta tire bilan almashtirish
            .trim()
    }, [])

    // Fetch funksiyalarini avval e'lon qilamiz
    const fetchCourses = useCallback(async (slug) => {
        if (!slug) return

        try {
            console.log("fetchCourses called with slug:", slug)
            setLoading(true)
            const response = await teacherCoursesAPI.getChannelCourses(slug)
            console.log("Courses response:", response)
            setCourses(response.results || response || [])
        } catch (error) {
            console.error("Error fetching courses:", error)
            setCourses([]) // Faqat bo'sh array
        } finally {
            setLoading(false)
        }
    }, [])

    const fetchCategories = useCallback(async () => {
        try {
            console.log("fetchCategories called")
            const response = await teacherCoursesAPI.getCourseCategories()
            console.log("Categories response:", response)
            setCategories(response || [])
        } catch (error) {
            console.error("Error fetching categories:", error)
            setCategories([]) // Faqat bo'sh array
        }
    }, [])


    // Languages ni API dan yuklash
    const fetchLanguages = useCallback(async () => {
        try {
            console.log("fetchLanguages called")
            const response = await teacherCoursesAPI.getLanguages()
            console.log("Languages response:", response)
            setLanguages(response.results || response || [])
        } catch (error) {
            console.error("Error fetching languages:", error)
            setLanguages([])
        }
    }, [])

    // Oylar (course types) ni yuklash
    const fetchCourseMonths = useCallback(async (courseSlug) => {
        try {
            console.log("fetchCourseMonths called with slug:", courseSlug)
            const response = await teacherCoursesAPI.getCourseTypes(courseSlug)
            console.log("Course months response:", response)
            setCourseMonths(response.results || response || [])
        } catch (error) {
            console.error("Error fetching course months:", error)
            setCourseMonths([])
        }
    }, [])

    useEffect(() => {
        fetchLanguages()
    }, [])

    // useEffect ni fetch funksiyalardan keyin qo'yamiz
    useEffect(() => {
        console.log("TeacherInfomration useEffect:", { selectedChannel, channelSlug })

        // channelSlug dan yoki selectedChannel dan foydalanish
        const slug = channelSlug || selectedChannel?.slug

        if (slug) {
            console.log("Fetching data for slug:", slug)
            fetchCourses(slug)
            fetchCategories()
        } else {
            console.log("No slug available, setting loading to false")
            setLoading(false)
        }
    }, [channelSlug, fetchCourses, fetchCategories]) // Dependencies qo'shamiz

    const fetchCourseDetail = async (slug) => {
        try {
            const response = await teacherCoursesAPI.getCourseDetail(slug)
            setSelectedCourse(response)
            setShowDetailModal(true)
        } catch (error) {
            console.error("Error fetching course detail:", error)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        console.log("=== FORM SUBMIT STARTED ===")
        console.log("Current courseForm:", courseForm)
        console.log("editingCourse:", editingCourse)

        try {
            setLoading(true)
            
            // Form validation
            if (!courseForm.title.trim()) {
                alert("Kurs nomi kiritilishi shart!")
                setLoading(false)
                return
            }

            if (!courseForm.description.trim()) {
                alert("Kurs tavsifi kiritilishi shart!")
                setLoading(false)
                return
            }

            if (!courseForm.language) {
                alert("Til tanlanishi shart!")
                setLoading(false)
                return
            }

            if (!courseForm.categories || courseForm.categories.length === 0) {
                alert("Kamida bitta kategoriya tanlanishi shart!")
                setLoading(false)
                return
            }

            // Purchase scope validation
            if (courseForm.purchase_scope === 'course' && !courseForm.is_free && (!courseForm.price || courseForm.price <= 0)) {
                alert("Pullik kurs uchun narx kiritilishi shart!")
                setLoading(false)
                return
            }

            const slug = channelSlug || selectedChannel?.slug

            console.log("Debug - selectedChannel:", selectedChannel)
            console.log("Debug - channelSlug:", channelSlug)

            // Kanal ID ni to'g'ri olish
            let channelId = null
            if (selectedChannel?.id) {
                channelId = selectedChannel.id
            } else if (channelSlug) {
                // Agar slug bor bo'lsa, localStorage dan kanal topish
                const storedChannels = JSON.parse(localStorage.getItem('myTeacherChannels') || '[]')
                console.log("Debug - storedChannels:", storedChannels)
                const foundChannel = storedChannels.find(ch => ch.slug === channelSlug || ch.username === channelSlug)
                console.log("Debug - foundChannel:", foundChannel)
                channelId = foundChannel?.id

                // Agar localStorage da yo'q bo'lsa, selectedChannel dan olish
                if (!channelId) {
                    const storedSelectedChannel = JSON.parse(localStorage.getItem('selectedChannel') || 'null')
                    console.log("Debug - storedSelectedChannel:", storedSelectedChannel)
                    channelId = storedSelectedChannel?.id
                }
            }

            console.log("Debug - channelId:", channelId)

            if (!channelId) {
                alert("Kanal tanlanmagan! Iltimos, avval kanal tanlang.")
                setLoading(false)
                return
            }

            const formData = {
                ...courseForm,
                channel: channelId,
                slug: courseForm.slug || generateSlug(courseForm.title)
            }

            console.log("Submitting course data:", formData)
            console.log("Form validation passed, sending to API...")

            if (editingCourse) {
                console.log("Updating existing course:", editingCourse.slug)
                const updatedCourse = await teacherCoursesAPI.updateCourse(editingCourse.slug, formData)
                console.log("Update response:", updatedCourse)
                setCourses(courses.map(course =>
                    course.id === editingCourse.id ? { ...course, ...updatedCourse } : course
                ))
                alert("Kurs muvaffaqiyatli yangilandi!")
            } else {
                console.log("Creating new course...")
                const newCourse = await teacherCoursesAPI.createCourse(formData)
                console.log("Create response:", newCourse)
                setCourses([...courses, newCourse])
                alert("Yangi kurs muvaffaqiyatli yaratildi!")
            }

            resetForm()
            if (slug) {
                fetchCourses(slug) // Refresh courses list
            }
        } catch (error) {
            console.error("Error saving course:", error)
            alert("Xatolik yuz berdi: " + (error.response?.data?.message || error.message || "Noma'lum xatolik"))
        } finally {
            setLoading(false)
        }
    }

    const resetForm = () => {
        setCourseForm({
            title: "",
            slug: "",
            description: "",
            language: "",
            categories: [],
            is_free: true,
            price: "",
            level: "beginner",
            is_new: false,
            is_bestseller: false,
            is_serial: true,
            certificate_available: true,
            cover: null,
            thumbnail: null,
            purchase_scope: "course"
        })
        setEditingCourse(null)
        setShowCreateModal(false)
    }

    const handleEdit = (course) => {
        setEditingCourse(course)
        setCourseForm({
            title: course.title,
            slug: course.slug || generateSlug(course.title),
            description: course.description || "",
            language: course.language || "",
            categories: course.categories || [],
            is_free: course.is_free,
            price: course.price || "",
            level: course.level || "beginner",
            is_new: course.is_new || false,
            is_bestseller: course.is_bestseller || false,
            is_serial: course.is_serial || true,
            certificate_available: course.certificate_available || true,
            cover: null,
            thumbnail: null,
            purchase_scope: course.purchase_scope || "course"
        })
        setShowCreateModal(true)
    }

    const handleDelete = async (courseId) => {
        if (window.confirm("Kursni o'chirishni xohlaysizmi?")) {
            try {
                await teacherCoursesAPI.deleteCourse(courseId)
                setCourses(courses.filter(course => course.id !== courseId))
            } catch (error) {
                console.error("Error deleting course:", error)
            }
        }
    }

    const getLevelText = (level) => {
        const levels = {
            beginner: "Boshlang'ich",
            intermediate: "O'rta",
            advanced: "Yuqori"
        }
        return levels[level] || level
    }

    const formatPrice = (price) => {
        return price ? `${price} FC` : "Bepul"
    }

    // Oylar uchun handle funksiyalari
    const handleMonthSubmit = async (e) => {
        e.preventDefault()

        try {
            const monthData = {
                course: selectedCourse.id,
                name: monthForm.name,
                slug: generateSlug(monthForm.name),
                description: monthForm.description,
                created_by: selectedChannel?.id,
                price: (selectedCourse.purchase_scope === 'course_type' && !monthForm.is_free) ? parseFloat(monthForm.price) : null
            }

            console.log("Creating/Updating month:", monthData)

            if (editingMonth) {
                await teacherCoursesAPI.updateCourseType(editingMonth.slug, monthData)
            } else {
                await teacherCoursesAPI.createCourseType(monthData)
            }

            // Form ni tozalash va modalni yopish
            setMonthForm({
                name: "",
                description: "",
                price: "",
                is_free: true
            })
            setEditingMonth(null)
            setShowCreateMonthModal(false)

            // Oylar ro'yxatini yangilash
            await fetchCourseMonths(selectedCourse.slug)

        } catch (error) {
            console.error("Error saving month:", error)
            alert("Xatolik yuz berdi: " + (error.response?.data?.message || error.message))
        }
    }

    const handleEditMonth = (month) => {
        setEditingMonth(month)
        setMonthForm({
            name: month.name,
            description: month.description,
            price: month.price || "",
            is_free: !month.price
        })
        setShowCreateMonthModal(true)
        setMonthMenuOpen(null)
    }

    const handleDeleteMonth = async (month) => {
        if (window.confirm(`"${month.name}" ni o'chirishni xohlaysizmi?`)) {
            try {
                await teacherCoursesAPI.deleteCourseType(month.slug)
                await fetchCourseMonths(selectedCourse.slug)
                setMonthMenuOpen(null)
            } catch (error) {
                console.error("Error deleting month:", error)
                alert("Xatolik yuz berdi!")
            }
        }
    }

    // Test yaratish funksiyalari
    const handleCreateTest = (month) => {
        setSelectedMonth(month)
        setTestForm({
            title: `${month.name} - Oylik test`,
            description: `${month.name} oyi uchun yakuniy test`,
            time_limit_minutes: 30,
            attempts_allowed: 2,
            pass_score: 70,
            is_active: true,
            questions: [
                {
                    text: "",
                    order: 1,
                    points: 1,
                    options: [
                        { text: "", is_correct: false, order: 1 },
                        { text: "", is_correct: false, order: 2 }
                    ]
                }
            ]
        })
        setShowTestModal(true)
        setMonthMenuOpen(null)
    }

    const handleTestSubmit = async (e) => {
        e.preventDefault()
        
        try {
            const testData = {
                course_type: selectedMonth.id,
                title: testForm.title,
                description: testForm.description,
                time_limit_minutes: testForm.time_limit_minutes,
                attempts_allowed: testForm.attempts_allowed,
                pass_score: testForm.pass_score,
                is_active: testForm.is_active,
                questions: testForm.questions.filter(q => q.text.trim())
            }

            console.log('Creating test:', testData)
            await courseTypeTestsAPI.createTest(testData)
            
            setShowTestModal(false)
            setSelectedMonth(null)
            alert('Test muvaffaqiyatli yaratildi!')
            
        } catch (error) {
            console.error('Error creating test:', error)
            alert('Test yaratishda xatolik: ' + error.message)
        }
    }

    // Vazifa yaratish funksiyalari
    const handleCreateAssignment = (month) => {
        setSelectedMonth(month)
        const dueDate = new Date()
        dueDate.setDate(dueDate.getDate() + 30) // 30 kun keyingi sana
        
        setAssignmentForm({
            title: `${month.name} - Oylik vazifa`,
            description: `${month.name} oyi uchun yakuniy vazifa`,
            due_days_after_completion: 7, // 7 kun default
            max_points: 100,
            allow_multiple_submissions: false,
            is_active: true
        })
        setShowAssignmentModal(true)
        setMonthMenuOpen(null)
    }

    const handleAssignmentSubmit = async (e) => {
        e.preventDefault()
        
        try {
            const assignmentData = {
                course_type: selectedMonth.id,
                title: assignmentForm.title,
                description: assignmentForm.description,
                due_days_after_completion: assignmentForm.due_days_after_completion,
                max_points: assignmentForm.max_points,
                allow_multiple_submissions: assignmentForm.allow_multiple_submissions,
                is_active: assignmentForm.is_active
            }

            console.log('Creating assignment:', assignmentData)
            await courseTypeAssignmentsAPI.createAssignment(assignmentData)
            
            setShowAssignmentModal(false)
            setSelectedMonth(null)
            alert('Vazifa muvaffaqiyatli yaratildi!')
            
        } catch (error) {
            console.error('Error creating assignment:', error)
            alert('Vazifa yaratishda xatolik: ' + error.message)
        }
    }

    // Test savol qo'shish/o'chirish
    const addQuestion = () => {
        setTestForm(prev => ({
            ...prev,
            questions: [...prev.questions, {
                text: "",
                order: prev.questions.length + 1,
                points: 1,
                options: [
                    { text: "", is_correct: false, order: 1 },
                    { text: "", is_correct: false, order: 2 }
                ]
            }]
        }))
    }

    const removeQuestion = (index) => {
        setTestForm(prev => ({
            ...prev,
            questions: prev.questions.filter((_, i) => i !== index)
        }))
    }

    const updateQuestion = (index, field, value) => {
        setTestForm(prev => ({
            ...prev,
            questions: prev.questions.map((q, i) => 
                i === index ? { ...q, [field]: value } : q
            )
        }))
    }

    const addOption = (questionIndex) => {
        setTestForm(prev => ({
            ...prev,
            questions: prev.questions.map((q, i) => 
                i === questionIndex ? {
                    ...q,
                    options: [...q.options, {
                        text: "",
                        is_correct: false,
                        order: q.options.length + 1
                    }]
                } : q
            )
        }))
    }

    const removeOption = (questionIndex, optionIndex) => {
        setTestForm(prev => ({
            ...prev,
            questions: prev.questions.map((q, i) => 
                i === questionIndex ? {
                    ...q,
                    options: q.options.filter((_, oi) => oi !== optionIndex)
                } : q
            )
        }))
    }

    const updateOption = (questionIndex, optionIndex, field, value) => {
        setTestForm(prev => ({
            ...prev,
            questions: prev.questions.map((q, i) => 
                i === questionIndex ? {
                    ...q,
                    options: q.options.map((o, oi) => 
                        oi === optionIndex ? { ...o, [field]: value } : o
                    )
                } : q
            )
        }))
    }

    // Test va vazifalarni ko'rish funksiyalari
    const handleViewTests = async (month) => {
        setSelectedMonth(month)
        setLoadingTests(true)
        setShowViewTestsModal(true)
        setMonthMenuOpen(null)
        
        try {
            console.log('Fetching tests for:', {
                channelSlug: selectedChannel?.slug,
                courseSlug: selectedCourse?.slug,
                courseTypeSlug: month.slug
            })
            
            const response = await courseTypeTestsAPI.getTestsByCourseType(
                selectedChannel?.slug,
                selectedCourse?.slug,
                month.slug
            )
            
            console.log('Tests response:', response)
            
            // API response structure ni handle qilish
            if (response && response.course_type_test) {
                setMonthTests([response.course_type_test])
            } else if (Array.isArray(response)) {
                setMonthTests(response)
            } else if (response) {
                setMonthTests([response])
            } else {
                setMonthTests([])
            }
        } catch (error) {
            console.error('Error fetching tests:', error)
            setMonthTests([])
        } finally {
            setLoadingTests(false)
        }
    }

    const handleViewAssignments = async (month) => {
        setSelectedMonth(month)
        setLoadingAssignments(true)
        setShowViewAssignmentsModal(true)
        setMonthMenuOpen(null)
        
        try {
            console.log('Fetching assignments for month:', month)
            
            const response = await courseTypeAssignmentsAPI.getAssignmentsByCourseType(month.id)
            
            console.log('Assignments response:', response)
            
            // API response structure ni handle qilish
            if (Array.isArray(response)) {
                setMonthAssignments(response)
            } else if (response) {
                setMonthAssignments([response])
            } else {
                setMonthAssignments([])
            }
        } catch (error) {
            console.error('Error fetching assignments:', error)
            setMonthAssignments([])
        } finally {
            setLoadingAssignments(false)
        }
    }

    const handleViewTestDetail = (test) => {
        setSelectedTest(test)
        setShowTestDetailModal(true)
    }

    const handleViewAssignmentDetail = (assignment) => {
        setSelectedAssignment(assignment)
        setShowAssignmentDetailModal(true)
    }

    const handleDeleteTest = async (testId) => {
        if (window.confirm('Haqiqatan ham bu testni o\'chirmoqchimisiz?')) {
            try {
                await courseTypeTestsAPI.deleteTest(testId)
                // Refresh tests list
                const response = await courseTypeTestsAPI.getTestsByCourseType(
                    selectedChannel?.slug,
                    selectedCourse?.slug,
                    selectedMonth.slug
                )
                
                if (response && response.course_type_test) {
                    setMonthTests([response.course_type_test])
                } else if (Array.isArray(response)) {
                    setMonthTests(response)
                } else if (response) {
                    setMonthTests([response])
                } else {
                    setMonthTests([])
                }
                
                alert('Test muvaffaqiyatli o\'chirildi!')
            } catch (error) {
                console.error('Error deleting test:', error)
                alert('Test o\'chirishda xatolik: ' + error.message)
            }
        }
    }

    const handleDeleteAssignment = async (assignmentslug) => {
        if (window.confirm('Haqiqatan ham bu vazifani o\'chirmoqchimisiz?')) {
            try {
                await courseTypeAssignmentsAPI.deleteAssignment(assignmentslug)
                // Refresh assignments list
                const response = await courseTypeAssignmentsAPI.getAssignmentsByCourseType(selectedMonth.id)
                
                if (Array.isArray(response)) {
                    setMonthAssignments(response)
                } else if (response) {
                    setMonthAssignments([response])
                } else {
                    setMonthAssignments([])
                }
                
                alert('Vazifa muvaffaqiyatli o\'chirildi!')
            } catch (error) {
                console.error('Error deleting assignment:', error)
                alert('Vazifa o\'chirishda xatolik: ' + error.message)
            }
        }
    }

    // Format date function
    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('uz-UZ', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    // Filter courses by status
    const filteredCourses = courses.filter(course => {
        if (statusFilter === 'all') return true
        return course.status === statusFilter
    })

    // Get status badge class
    const getStatusBadgeClass = (status) => {
        switch(status) {
            case 'approved': return 'status-approved'
            case 'moderation': return 'status-moderation'
            case 'rejected': return 'status-rejected'
            default: return 'status-moderation'
        }
    }

    // Get status text
    const getStatusText = (status) => {
        switch(status) {
            case 'approved': return 'Tasdiqlangan'
            case 'moderation': return 'Moderatsiyada'
            case 'rejected': return 'Rad etilgan'
            default: return 'Moderatsiyada'
        }
    }

    // Handle reason click
    const handleReasonClick = (course) => {
        setSelectedReason({
            title: course.title,
            reason: course.reason
        })
        setShowReasonModal(true)
    }

    // Get status counts
    const getStatusCounts = () => {
        return {
            all: courses.length,
            approved: courses.filter(c => c.status === 'approved').length,
            moderation: courses.filter(c => c.status === 'moderation').length,
            rejected: courses.filter(c => c.status === 'rejected').length
        }
    }

    const statusCounts = getStatusCounts()

    if (loading) {
        return (
            <div className="teacher-courses loading">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Kurslar yuklanmoqda...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="teacher-courses">
            {/* Header */}
            <div className="tc-header">
                <div className="tc-header-content">
                    <h1>Kurslar Boshqaruvi</h1>
                    <p>Kanal kurslaringizni yarating va boshqaring</p>
                </div>
                <button className="tc-create-btn" onClick={() => setShowCreateModal(true)}>
                    <FiPlus />
                    Yangi kurs
                </button>
            </div>

            {/* Status Filter Tabs */}
            <div className="tc-status-filters">
                <button 
                    className={`tc-filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setStatusFilter('all')}
                >
                    <span className="filter-label">Barchasi</span>
                    <span className="filter-count">{statusCounts.all}</span>
                </button>
                <button 
                    className={`tc-filter-btn ${statusFilter === 'approved' ? 'active' : ''}`}
                    onClick={() => setStatusFilter('approved')}
                >
                    <FiCheck />
                    <span className="filter-label">Tasdiqlangan</span>
                    <span className="filter-count">{statusCounts.approved}</span>
                </button>
                <button 
                    className={`tc-filter-btn ${statusFilter === 'moderation' ? 'active' : ''}`}
                    onClick={() => setStatusFilter('moderation')}
                >
                    <FiClock />
                    <span className="filter-label">Moderatsiyada</span>
                    <span className="filter-count">{statusCounts.moderation}</span>
                </button>
                <button 
                    className={`tc-filter-btn ${statusFilter === 'rejected' ? 'active' : ''}`}
                    onClick={() => setStatusFilter('rejected')}
                >
                    <FiX />
                    <span className="filter-label">Rad etilgan</span>
                    <span className="filter-count">{statusCounts.rejected}</span>
                </button>
            </div>

            {/* Stats Cards */}
            <div className="tc-stats-grid">
                <div className="tc-stat-card">
                    <div className="tc-stat-icon courses">
                        <FiBook />
                    </div>
                    <div className="tc-stat-content">
                        <h3>{courses.length}</h3>
                        <p>Jami kurslar</p>
                    </div>
                </div>
                <div className="tc-stat-card">
                    <div className="tc-stat-icon students">
                        <FiUsers />
                    </div>
                    <div className="tc-stat-content">
                        <h3>{courses.reduce((sum, course) => sum + (course.students_count || 0), 0)}</h3>
                        <p>Jami o'quvchilar</p>
                    </div>
                </div>
                <div className="tc-stat-card">
                    <div className="tc-stat-icon videos">
                        <FiVideo />
                    </div>
                    <div className="tc-stat-content">
                        <h3>{courses.reduce((sum, course) => sum + (course.videos_count || 0), 0)}</h3>
                        <p>Jami videolar</p>
                    </div>
                </div>
                <div className="tc-stat-card">
                    <div className="tc-stat-icon earnings">
                        <FiDollarSign />
                    </div>
                    <div className="tc-stat-content">
                        <h3>{courses.reduce((sum, course) => sum + parseFloat(course.price || 0), 0)} FC</h3>
                        <p>Jami narx</p>
                    </div>
                </div>
            </div>

            {/* Courses Grid */}
            <div className="tc-courses-grid">
                {filteredCourses.length === 0 ? (
                    <div className="tc-empty-state">
                        <FiBook className="empty-icon" />
                        <h3>Hali kurslar yo'q</h3>
                        <p>Birinchi kursingizni yarating va o'quvchilarni jalb qiling</p>
                        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
                            <FiPlus /> Yangi kurs yaratish
                        </button>
                    </div>
                ) : (
                    filteredCourses.map((course) => (
                        <div key={course.id} className="tc-course-card"  onClick={() => {
                            navigate(`/profile/teacher/${channelSlug}/videos`, {state: {selectedCourse: course }})}} >
                            {/* Status Badge */}
                            <div className={`tc-status-badge ${getStatusBadgeClass(course.status)}`}>
                                {course.status === 'approved' && <FiCheck />}
                                {course.status === 'moderation' && <FiClock />}
                                {course.status === 'rejected' && <FiX />}
                                <span>{getStatusText(course.status)}</span>
                            </div>

                            <div className="tc-course-thumbnail">
                                <img
                                    src={getImageUrl(course.thumbnail || course.cover)}
                                    alt={course.title}
                                    onError={(e) => {
                                        e.target.src = "/placeholder.svg"
                                    }}
                                />
                                <div className="tc-course-overlay">
                                    <div className="tc-course-badges">
                                        {course.is_new && <span className="badge new">Yangi</span>}
                                        {course.is_bestseller && <span className="badge bestseller">Top</span>}
                                        {course.is_free ? (
                                            <span className="badge free">Bepul</span>
                                        ) : (
                                            <span className="badge paid">{formatPrice(course.price)}</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="tc-course-content">
                                <div className="tc-course-header">
                                    <h3>{course.title}</h3>
                                    <div className="tc-course-level">
                                        <FiAward />
                                        <span>{getLevelText(course.level)}</span>
                                    </div>
                                </div>

                                <div className="tc-course-stats">

                                    <div className="tc-stat-item">
                                        <FiCalendar />
                                        <span>{course.course_types_count || 0} oy</span>
                                    </div>
                                    <div className="tc-stat-item">
                                        <FiVideo />
                                        <span>{course.videos_count || 0} video</span>
                                    </div>
                                    <div className="tc-stat-item">
                                        <FiUsers />
                                        <span>{course.students_count || 0} o'quvchi</span>
                                    </div>
                                </div>

                                <div className="tc-course-meta">
                                    <div className="tc-course-date">
                                        <FiCalendar />
                                        <span>{new Date(course.created_at).toLocaleDateString('uz-UZ')}</span>
                                    </div>
                                    {course.certificate_available && (
                                        <div className="tc-certificate">
                                            <FiAward />
                                            <span>Sertifikat</span>
                                        </div>
                                    )}
                                </div>

                                {/* Rejection Reason */}
                                {course.status === 'rejected' && course.reason && (
                                    <div className="tc-rejection-reason">
                                        <button 
                                            className="tc-reason-btn"
                                            onClick={() => handleReasonClick(course)}
                                        >
                                            <FiFileText />
                                            <span>Rad etilish sababini ko'rish</span>
                                        </button>
                                    </div>
                                )}

                                <div className="tc-course-menu">
                                    <button
                                        className="tc-course-menu-btn"
                                        onClick={() => setCourseMenuOpen(courseMenuOpen === course.id ? null : course.id)}
                                    >
                                        <FiMoreVertical />
                                    </button>
                                    {courseMenuOpen === course.id && (
                                        <div className="tc-course-dropdown">
                                            <button
                                                className="tc-dropdown-item"
                                                onClick={() => {
                                                    fetchCourseMonths(course.slug)
                                                    setSelectedCourse(course)
                                                    setShowMonthsModal(true)
                                                    setCourseMenuOpen(null)
                                                }}
                                            >
                                                <FiBookOpen />
                                                <span>Oylar</span>
                                            </button>
                                            <button
                                                className="tc-dropdown-item"
                                                onClick={() => {
                                                    navigate(`/profile/teacher/${channelSlug}/videos`, {
                                                        state: { selectedCourse: course }
                                                    })
                                                    setCourseMenuOpen(null)
                                                }}
                                            >
                                                <FiVideo />
                                                <span>Videolar</span>
                                            </button>
                                            <button
                                                className="tc-dropdown-item"
                                                onClick={() => {
                                                    fetchCourseDetail(course.slug)
                                                    setCourseMenuOpen(null)
                                                }}
                                            >
                                                <FiEye />
                                                <span>Ko'rish</span>
                                            </button>
                                            <button
                                                className="tc-dropdown-item"
                                                onClick={() => {
                                                    handleEdit(course)
                                                    setCourseMenuOpen(null)
                                                }}
                                            >
                                                <FiEdit />
                                                <span>Tahrirlash</span>
                                            </button>
                                            <button
                                                className="tc-dropdown-item danger"
                                                onClick={() => {
                                                    handleDelete(course.slug)
                                                    setCourseMenuOpen(null)
                                                }}
                                            >
                                                <FiTrash2 />
                                                <span>O'chirish</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Create/Edit Modal */}
            {showCreateModal && (
                <div className="tc-modal-overlay" onClick={() => setShowCreateModal(false)}>
                    <div className="tc-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="tc-modal-header">
                            <h2>{editingCourse ? "Kursni tahrirlash" : "Yangi kurs yaratish"}</h2>
                            <button className="tc-modal-close" onClick={resetForm}>
                                <FiX />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="tc-course-form">
                            <div className="tc-form-row">
                                <div className="tc-form-group">
                                    <label>Kurs nomi *</label>
                                    <input
                                        type="text"
                                        value={courseForm.title}
                                        onChange={(e) => {
                                            const newTitle = e.target.value
                                            setCourseForm({
                                                ...courseForm,
                                                title: newTitle,
                                                slug: generateSlug(newTitle) // Avtomatik slug yaratish
                                            })
                                        }}
                                        placeholder="Masalan: Python Boshlang'ich"
                                        required
                                    />
                                </div>

                                <div className="tc-form-group">
                                    <label>Slug (URL) *</label>
                                    <input
                                        type="text"
                                        value={courseForm.slug}
                                        onChange={(e) => setCourseForm({ ...courseForm, slug: e.target.value })}
                                        placeholder="python-boshlangich"
                                        required
                                    />
                                    <small>URL da ishlatiladi. Faqat harflar, raqamlar va tire (-)</small>
                                </div>
                            </div>

                            <div className="tc-form-row">
                                <div className="tc-form-group">
                                    <label>Til *</label>
                                    <select
                                        value={courseForm.language}
                                        onChange={(e) => setCourseForm({ ...courseForm, language: e.target.value })}
                                        required
                                    >
                                        <option value="">Tilni tanlang</option>
                                        {languages.map(lang => (
                                            <option key={lang.id} value={lang.id}>{lang.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="tc-form-group">
                                <label>Tavsif *</label>
                                <textarea
                                    value={courseForm.description}
                                    onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                                    placeholder="Kurs haqida batafsil ma'lumot"
                                    rows="4"
                                    required
                                />
                            </div>

                            <div className="tc-form-group">
                                <label>Kategoriyalar *</label>
                                <div className="tc-categories-grid">
                                    {categories.map(category => (
                                        <label key={category.id} className="tc-category-item">
                                            <input
                                                type="checkbox"
                                                checked={courseForm.categories.includes(category.id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setCourseForm({
                                                            ...courseForm,
                                                            categories: [...courseForm.categories, category.id]
                                                        })
                                                    } else {
                                                        setCourseForm({
                                                            ...courseForm,
                                                            categories: courseForm.categories.filter(id => id !== category.id)
                                                        })
                                                    }
                                                }}
                                            />
                                            <span className="tc-category-name">{category.name}</span>
                                            <div
                                                className="tc-category-color"
                                                style={{ backgroundColor: category.color }}
                                            ></div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="tc-form-row">
                                <div className="tc-form-group">
                                    <label>Daraja *</label>
                                    <select
                                        value={courseForm.level}
                                        onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value })}
                                        required
                                    >
                                        <option value="beginner">Boshlang'ich</option>
                                        <option value="intermediate">O'rta</option>
                                        <option value="advanced">Yuqori</option>
                                    </select>
                                </div>

                                <div className="tc-form-group">
                                    <label>Narx turi *</label>
                                    <div className="tc-price-toggle">
                                        <label className="tc-toggle-item">
                                            <input
                                                type="radio"
                                                name="is_free"
                                                checked={courseForm.is_free}
                                                onChange={() => setCourseForm({ ...courseForm, is_free: true, price: "" })}
                                            />
                                            <span>Bepul</span>
                                        </label>
                                        <label className="tc-toggle-item">
                                            <input
                                                type="radio"
                                                name="is_free"
                                                checked={!courseForm.is_free}
                                                onChange={() => setCourseForm({ ...courseForm, is_free: false })}
                                            />
                                            <span>Pullik</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {!courseForm.is_free && (
                                <>
                                    <div className="tc-form-group">
                                        <label>To'lov turi *</label>
                                        <select
                                            value={courseForm.purchase_scope}
                                            onChange={(e) => setCourseForm({
                                                ...courseForm,
                                                purchase_scope: e.target.value,
                                                price: e.target.value === 'course_type' ? "" : courseForm.price
                                            })}
                                        >
                                            <option value="course">Butun kurs bo'yicha sotib olish</option>
                                            <option value="course_type">Faqat CourseType bo'yicha sotib olish</option>
                                        </select>
                                    </div>

                                    {courseForm.purchase_scope === 'course' && !courseForm.is_free && (
                                        <div className="tc-form-group">
                                            <label>Narx (FixCoin) *</label>
                                            <input
                                                type="number"
                                                value={courseForm.price}
                                                onChange={(e) => setCourseForm({ ...courseForm, price: parseFloat(e.target.value) || "" })}
                                                placeholder="100"
                                                min="0"
                                                step="0.01"
                                                required
                                            />
                                        </div>
                                    )}

                                    {courseForm.purchase_scope === 'course' && (
                                        <div className="tc-form-group">
                                            <label className="tc-checkbox-item">
                                                <input
                                                    type="checkbox"
                                                    checked={courseForm.is_free}
                                                    onChange={(e) => setCourseForm({ 
                                                        ...courseForm, 
                                                        is_free: e.target.checked,
                                                        price: e.target.checked ? "" : courseForm.price
                                                    })}
                                                />
                                                <span>Bepul kurs</span>
                                            </label>
                                        </div>
                                    )}
                                </>
                            )}

                            <div className="tc-form-group">
                                <label>Qo'shimcha sozlamalar</label>
                                <div className="tc-checkboxes">
                                    <label className="tc-checkbox-item">
                                        <input
                                            type="checkbox"
                                            checked={courseForm.is_new}
                                            onChange={(e) => setCourseForm({ ...courseForm, is_new: e.target.checked })}
                                        />
                                        <span>Yangi kurs</span>
                                    </label>
                                    <label className="tc-checkbox-item">
                                        <input
                                            type="checkbox"
                                            checked={courseForm.is_bestseller}
                                            onChange={(e) => setCourseForm({ ...courseForm, is_bestseller: e.target.checked })}
                                        />
                                        <span>Top kurs</span>
                                    </label>
                                    <label className="tc-checkbox-item">
                                        <input
                                            type="checkbox"
                                            checked={courseForm.is_serial}
                                            onChange={(e) => setCourseForm({ ...courseForm, is_serial: e.target.checked })}
                                        />
                                        <span>Serial kurs</span>
                                    </label>
                                    <label className="tc-checkbox-item">
                                        <input
                                            type="checkbox"
                                            checked={courseForm.certificate_available}
                                            onChange={(e) => setCourseForm({ ...courseForm, certificate_available: e.target.checked })}
                                        />
                                        <span>Sertifikat berish</span>
                                    </label>
                                </div>
                            </div>

                            <div className="tc-form-row">
                                <div className="tc-form-group">
                                    <label>Kurs muqovasi</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setCourseForm({ ...courseForm, cover: e.target.files[0] })}
                                    />
                                </div>

                                <div className="tc-form-group">
                                    <label>Kichik rasm</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setCourseForm({ ...courseForm, thumbnail: e.target.files[0] })}
                                    />
                                </div>
                            </div>

                            <div className="tc-form-actions">
                                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                                    Bekor qilish
                                </button>
                                <button 
                                    type="submit" 
                                    className="btn btn-primary"
                                    disabled={loading}
                                >
                                    {loading ? "Yuklanmoqda..." : (editingCourse ? "Saqlash" : "Yaratish")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Oylar Modal */}
            {showMonthsModal && selectedCourse && (
                <div className="tc-modal-overlay" onClick={() => setShowMonthsModal(false)}>
                    <div className="tc-modal tc-months-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="tc-modal-header">
                            <div className="tc-modal-title">
                                <h2>{selectedCourse.title} - Oylar</h2>
                                <span className={`tc-purchase-scope ${selectedCourse.purchase_scope}`}>
                                    {selectedCourse.purchase_scope === 'course' ? 'Butun kurs bo\'yicha' : 'Oylar bo\'yicha sotib olish'}
                                </span>
                            </div>
                            <button className="tc-modal-close" onClick={() => setShowMonthsModal(false)}>
                                <FiX />
                            </button>
                        </div>

                        <div className="tc-months-content">
                            <div className="tc-months-header">
                                <h3>Oylar ro'yxati</h3>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => setShowCreateMonthModal(true)}
                                >
                                    <FiPlus /> Yangi oy qo'shish
                                </button>
                            </div>

                            {courseMonths.length === 0 ? (
                                <div className="tc-empty-months">
                                    <FiBookOpen className="empty-icon" />
                                    <h4>Hali oylar yo'q</h4>
                                    <p>Bu kurs uchun hali oylar yaratilmagan</p>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => setShowCreateMonthModal(true)}
                                    >
                                        <FiPlus /> Birinchi oyni qo'shish
                                    </button>
                                </div>
                            ) : (
                                <div className="tc-months-grid">
                                    {courseMonths.map((month) => (
                                        <div key={month.id} className="tc-month-card">
                                            <div className="tc-month-header">
                                                <h4>{month.name}</h4>
                                                <div className="tc-month-menu">
                                                    <button
                                                        className="tc-month-menu-btn"
                                                        onClick={() => setMonthMenuOpen(monthMenuOpen === month.id ? null : month.id)}
                                                    >
                                                        <FiMoreVertical />
                                                    </button>
                                                    {monthMenuOpen === month.id && (
                                                        <div className="tc-month-dropdown">
                                                            <button 
                                                                className="tc-dropdown-item"
                                                                onClick={() => handleViewTests(month)}
                                                            >
                                                                <FiList />
                                                                <span>Testlarni Ko'rish</span>
                                                            </button>
                                                            <button 
                                                                className="tc-dropdown-item"
                                                                onClick={() => handleViewAssignments(month)}
                                                            >
                                                                <FiEye />
                                                                <span>Vazifalarni Ko'rish</span>
                                                            </button>
                                                            <div className="tc-dropdown-divider"></div>
                                                            <button 
                                                                className="tc-dropdown-item"
                                                                onClick={() => handleCreateTest(month)}
                                                            >
                                                                <FiFileText />
                                                                <span>Yakuniy Test</span>
                                                            </button>
                                                            <button 
                                                                className="tc-dropdown-item"
                                                                onClick={() => handleCreateAssignment(month)}
                                                            >
                                                                <FiClipboard />
                                                                <span>Yakuniy Vazifa</span>
                                                            </button>
                                                            <div className="tc-dropdown-divider"></div>
                                                            <button
                                                                className="tc-dropdown-item"
                                                                onClick={() => handleEditMonth(month)}
                                                            >
                                                                <FiEdit />
                                                                <span>Tahrirlash</span>
                                                            </button>
                                                            <button
                                                                className="tc-dropdown-item danger"
                                                                onClick={() => handleDeleteMonth(month)}
                                                            >
                                                                <FiTrash2 />
                                                                <span>O'chirish</span>
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="tc-month-info">
                                                <p className="tc-month-description">{month.description}</p>
                                                <div className="tc-month-stats">
                                                    <div className="tc-month-stat">
                                                        <FiVideo />
                                                        <span>{month.total_course_videos || 0} ta video</span>
                                                    </div>
                                                    <div className="tc-month-stat">
                                                        <FiDollarSign />
                                                        <span>{month.price ? `${month.price} FC` : 'Bepul'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Yangi Oy Qo'shish Modal */}
            {showCreateMonthModal && selectedCourse && (
                <div className="tc-modal-overlay" onClick={() => setShowCreateMonthModal(false)}>
                    <div className="tc-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="tc-modal-header">
                            <h2>{editingMonth ? "Oyni tahrirlash" : "Yangi oy qo'shish"}</h2>
                            <button className="tc-modal-close" onClick={() => setShowCreateMonthModal(false)}>
                                <FiX />
                            </button>
                        </div>

                        <form onSubmit={handleMonthSubmit} className="tc-course-form">
                            <div className="tc-form-group">
                                <label>Oy nomi *</label>
                                <input
                                    type="text"
                                    value={monthForm.name}
                                    onChange={(e) => setMonthForm({ ...monthForm, name: e.target.value })}
                                    placeholder="Masalan: 1-oy"
                                    required
                                />
                            </div>

                            <div className="tc-form-group">
                                <label>Tavsif *</label>
                                <textarea
                                    value={monthForm.description}
                                    onChange={(e) => setMonthForm({ ...monthForm, description: e.target.value })}
                                    placeholder="Oy haqida batafsil ma'lumot"
                                    rows="3"
                                    required
                                />
                            </div>

                            {selectedCourse.purchase_scope === 'course_type' && (
                                <div className="tc-form-row">
                                    <div className="tc-form-group">
                                        <label>Narx turi</label>
                                        <div className="tc-price-toggle">
                                            <label className="tc-toggle-item">
                                                <input
                                                    type="radio"
                                                    name="is_free_month"
                                                    checked={monthForm.is_free}
                                                    onChange={() => setMonthForm({ ...monthForm, is_free: true, price: "" })}
                                                />
                                                <span>Bepul</span>
                                            </label>
                                            <label className="tc-toggle-item">
                                                <input
                                                    type="radio"
                                                    name="is_free_month"
                                                    checked={!monthForm.is_free}
                                                    onChange={() => setMonthForm({ ...monthForm, is_free: false })}
                                                />
                                                <span>Pullik</span>
                                            </label>
                                        </div>
                                    </div>

                                    {!monthForm.is_free && (
                                        <div className="tc-form-group">
                                            <label>Narx (FixCoin)</label>
                                            <input
                                                type="number"
                                                value={monthForm.price}
                                                onChange={(e) => setMonthForm({ ...monthForm, price: parseFloat(e.target.value) || "" })}
                                                placeholder="50"
                                                min="0"
                                                step="0.01"
                                            />
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="tc-form-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateMonthModal(false)}>
                                    Bekor qilish
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editingMonth ? "Saqlash" : "Qo'shish"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Course Detail Modal */}
            {showDetailModal && selectedCourse && (
                <div className="tc-detail-overlay" onClick={() => setShowDetailModal(false)}>
                    <div className="tc-detail-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="tc-detail-header">
                            <h2>Kurs ma'lumotlari</h2>
                            <button className="tc-modal-close" onClick={() => setShowDetailModal(false)}>
                                <FiX />
                            </button>
                        </div>

                        <div className="tc-detail-content">
                            <div className="tc-detail-main">
                                <div className="tc-detail-image">
                                    <img
                                        src={getImageUrl(selectedCourse.cover || selectedCourse.thumbnail)}
                                        alt={selectedCourse.title}
                                    />
                                </div>

                                <div className="tc-detail-info">
                                    <h3>{selectedCourse.title}</h3>
                                    <p className="tc-detail-description">{selectedCourse.description}</p>

                                    <div className="tc-detail-badges">
                                        {selectedCourse.is_new && <span className="badge new">Yangi</span>}
                                        {selectedCourse.is_bestseller && <span className="badge bestseller">Top</span>}
                                        {selectedCourse.is_free ? (
                                            <span className="badge free">Bepul</span>
                                        ) : (
                                            <span className="badge paid">{formatPrice(selectedCourse.price)}</span>
                                        )}
                                        <span className="badge level">{getLevelText(selectedCourse.level)}</span>
                                    </div>

                                    <div className="tc-detail-stats">
                                        <div className="tc-detail-stat">
                                            <FiUsers />
                                            <span>{selectedCourse.students_count || 0} o'quvchi</span>
                                        </div>
                                        <div className="tc-detail-stat">
                                            <FiStar />
                                            <span>{selectedCourse.rating_avg || 0} ({selectedCourse.rating_count || 0} baho)</span>
                                        </div>
                                        <div className="tc-detail-stat">
                                            <FiVideo />
                                            <span>{selectedCourse.lessons_count || 0} dars</span>
                                        </div>
                                        <div className="tc-detail-stat">
                                            <FiClock />
                                            <span>{selectedCourse.total_duration_minutes || 0} daqiqa</span>
                                        </div>
                                    </div>

                                    {selectedCourse.certificate_available && (
                                        <div className="tc-certificate-info">
                                            <FiAward />
                                            <span>Kurs yakunlanganidan keyin sertifikat beriladi</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {selectedCourse.channel_info && (
                                <div className="tc-channel-info">
                                    <h4>Kanal ma'lumotlari</h4>
                                    <div className="tc-channel-card">
                                        <div className="tc-channel-avatar">
                                            <img src={getImageUrl(selectedCourse.channel_info?.avatar)} alt={selectedCourse.channel_info?.title} />
                                        </div>
                                        <div className="tc-channel-details">
                                            <h5>{selectedCourse.channel_info.title}</h5>
                                            <p>{selectedCourse.channel_info.description}</p>
                                            <div className="tc-channel-stats">
                                                <span><FiUsers /> {selectedCourse.channel_info.subscriber_count} obunachi</span>
                                                <span><FiVideo /> {selectedCourse.channel_info.videos_count} video</span>
                                            </div>
                                            {selectedCourse.channel_info.verified && (
                                                <div className="tc-verified">
                                                    <FiCheck />
                                                    <span>Tasdiqlangan kanal</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Test yaratish modali */}
            {showTestModal && selectedMonth && (
                <div className="tc-modal-overlay" onClick={() => setShowTestModal(false)}>
                    <div className="tc-modal tc-test-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="tc-modal-header">
                            <div className="tc-modal-title">
                                <h2><FiFileText /> {selectedMonth.name} - Test yaratish</h2>
                            </div>
                            <button 
                                className="tc-modal-close"
                                onClick={() => setShowTestModal(false)}
                            >
                                <FiX />
                            </button>
                        </div>

                        <form onSubmit={handleTestSubmit} className="tc-test-form">
                            <div className="tc-form-row">
                                <div className="tc-form-group">
                                    <label>Test nomi *</label>
                                    <input
                                        type="text"
                                        value={testForm.title}
                                        onChange={(e) => setTestForm(prev => ({...prev, title: e.target.value}))}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="tc-form-group">
                                <label>Test tavsifi</label>
                                <textarea
                                    value={testForm.description}
                                    onChange={(e) => setTestForm(prev => ({...prev, description: e.target.value}))}
                                    rows="3"
                                />
                            </div>

                            <div className="tc-form-row">
                                <div className="tc-form-group">
                                    <label>Vaqt chegarasi (daqiqa)</label>
                                    <input
                                        type="number"
                                        value={testForm.time_limit_minutes}
                                        onChange={(e) => setTestForm(prev => ({...prev, time_limit_minutes: parseInt(e.target.value)}))}
                                        min="1"
                                    />
                                </div>
                                <div className="tc-form-group">
                                    <label>Urinishlar soni</label>
                                    <input
                                        type="number"
                                        value={testForm.attempts_allowed}
                                        onChange={(e) => setTestForm(prev => ({...prev, attempts_allowed: parseInt(e.target.value)}))}
                                        min="1"
                                    />
                                </div>
                                <div className="tc-form-group">
                                    <label>O'tish bali (%)</label>
                                    <input
                                        type="number"
                                        value={testForm.pass_score}
                                        onChange={(e) => setTestForm(prev => ({...prev, pass_score: parseInt(e.target.value)}))}
                                        min="1"
                                        max="100"
                                    />
                                </div>
                            </div>

                            <div className="tc-questions-section">
                                <div className="tc-questions-header">
                                    <h3>Savollar</h3>
                                    <button 
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={addQuestion}
                                    >
                                        <FiPlus /> Savol qo'shish
                                    </button>
                                </div>

                                {testForm.questions.map((question, qIndex) => (
                                    <div key={qIndex} className="tc-question-card">
                                        <div className="tc-question-header">
                                            <h4>Savol {qIndex + 1}</h4>
                                            {testForm.questions.length > 1 && (
                                                <button 
                                                    type="button"
                                                    className="tc-remove-btn"
                                                    onClick={() => removeQuestion(qIndex)}
                                                >
                                                    <FiMinus />
                                                </button>
                                            )}
                                        </div>

                                        <div className="tc-form-group">
                                            <label>Savol matni *</label>
                                            <textarea
                                                value={question.text}
                                                onChange={(e) => updateQuestion(qIndex, 'text', e.target.value)}
                                                placeholder="Savolni kiriting..."
                                                required
                                            />
                                        </div>

                                        <div className="tc-form-row">
                                            <div className="tc-form-group">
                                                <label>Ball</label>
                                                <input
                                                    type="number"
                                                    value={question.points}
                                                    onChange={(e) => updateQuestion(qIndex, 'points', parseInt(e.target.value))}
                                                    min="1"
                                                />
                                            </div>
                                        </div>

                                        <div className="tc-options-section">
                                            <div className="tc-options-header">
                                                <label>Javob variantlari</label>
                                                <button 
                                                    type="button"
                                                    className="btn btn-sm btn-secondary"
                                                    onClick={() => addOption(qIndex)}
                                                >
                                                    <FiPlus /> Variant qo'shish
                                                </button>
                                            </div>

                                            {question.options.map((option, oIndex) => (
                                                <div key={oIndex} className="tc-option-row">
                                                    <div className="tc-option-checkbox">
                                                        <input
                                                            type="radio"
                                                            name={`question_${qIndex}_correct`}
                                                            checked={option.is_correct}
                                                            onChange={() => {
                                                                // Faqat bitta to'g'ri javob bo'lishi kerak
                                                                setTestForm(prev => ({
                                                                    ...prev,
                                                                    questions: prev.questions.map((q, qi) => 
                                                                        qi === qIndex ? {
                                                                            ...q,
                                                                            options: q.options.map((o, oi) => ({
                                                                                ...o,
                                                                                is_correct: oi === oIndex
                                                                            }))
                                                                        } : q
                                                                    )
                                                                }))
                                                            }}
                                                        />
                                                        <span>To'g'ri</span>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={option.text}
                                                        onChange={(e) => updateOption(qIndex, oIndex, 'text', e.target.value)}
                                                        placeholder={`Variant ${oIndex + 1}`}
                                                        className="tc-option-input"
                                                    />
                                                    {question.options.length > 2 && (
                                                        <button 
                                                            type="button"
                                                            className="tc-remove-option-btn"
                                                            onClick={() => removeOption(qIndex, oIndex)}
                                                        >
                                                            <FiMinus />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="tc-form-actions">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary"
                                    onClick={() => setShowTestModal(false)}
                                >
                                    Bekor qilish
                                </button>
                                <button 
                                    type="submit" 
                                    className="btn btn-primary"
                                >
                                    <FiSave /> Test yaratish
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Vazifa yaratish modali */}
            {showAssignmentModal && selectedMonth && (
                <div className="tc-modal-overlay" onClick={() => setShowAssignmentModal(false)}>
                    <div className="tc-modal tc-assignment-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="tc-modal-header">
                            <div className="tc-modal-title">
                                <h2><FiClipboard /> {selectedMonth.name} - Vazifa yaratish</h2>
                            </div>
                            <button 
                                className="tc-modal-close"
                                onClick={() => setShowAssignmentModal(false)}
                            >
                                <FiX />
                            </button>
                        </div>

                        <form onSubmit={handleAssignmentSubmit} className="tc-assignment-form">
                            <div className="tc-form-row">
                                <div className="tc-form-group">
                                    <label>Vazifa nomi *</label>
                                    <input
                                        type="text"
                                        value={assignmentForm.title}
                                        onChange={(e) => setAssignmentForm(prev => ({...prev, title: e.target.value}))}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="tc-form-group">
                                <label>Vazifa tavsifi *</label>
                                <textarea
                                    value={assignmentForm.description}
                                    onChange={(e) => setAssignmentForm(prev => ({...prev, description: e.target.value}))}
                                    rows="5"
                                    placeholder="Vazifa shartlarini batafsil yozing..."
                                    required
                                />
                            </div>

                            <div className="tc-form-row">
                                <div className="tc-form-group">
                                    <label>Muddat (video tugagandan keyin necha kun) *</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="365"
                                        value={assignmentForm.due_days_after_completion}
                                        onChange={(e) => setAssignmentForm(prev => ({...prev, due_days_after_completion: parseInt(e.target.value) || 7}))}
                                        placeholder="Masalan: 7 kun"
                                        required
                                    />
                                    <small className="form-help">Video tugagandan keyin necha kun ichida topshirish kerak</small>
                                </div>
                                <div className="tc-form-group">
                                    <label>Maksimal ball</label>
                                    <input
                                        type="number"
                                        value={assignmentForm.max_points}
                                        onChange={(e) => setAssignmentForm(prev => ({...prev, max_points: parseInt(e.target.value)}))}
                                        min="1"
                                    />
                                </div>
                            </div>

                            <div className="tc-form-group tc-checkbox-group">
                                <label className="tc-checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={assignmentForm.allow_multiple_submissions}
                                        onChange={(e) => setAssignmentForm(prev => ({...prev, allow_multiple_submissions: e.target.checked}))}
                                    />
                                    <span className="tc-checkbox-custom"></span>
                                    <div className="tc-checkbox-text">
                                        <span className="tc-checkbox-title">Bir necha marta topshirishga ruxsat berish</span>
                                        <span className="tc-checkbox-desc">O'quvchilar vazifani qayta topshira oladi</span>
                                    </div>
                                </label>
                            </div>

                            <div className="tc-form-group tc-checkbox-group">
                                <label className="tc-checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={assignmentForm.is_active}
                                        onChange={(e) => setAssignmentForm(prev => ({...prev, is_active: e.target.checked}))}
                                    />
                                    <span className="tc-checkbox-custom"></span>
                                    <div className="tc-checkbox-text">
                                        <span className="tc-checkbox-title">Vazifani faollashtirish</span>
                                        <span className="tc-checkbox-desc">O'quvchilar vazifani ko'ra oladi</span>
                                    </div>
                                </label>
                            </div>

                            <div className="tc-form-actions">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary"
                                    onClick={() => setShowAssignmentModal(false)}
                                >
                                    Bekor qilish
                                </button>
                                <button 
                                    type="submit" 
                                    className="btn btn-primary"
                                >
                                    <FiSave /> Vazifa yaratish
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Testlarni ko'rish modali */}
            {showViewTestsModal && selectedMonth && (
                <div className="tc-modal-overlay" onClick={() => setShowViewTestsModal(false)}>
                    <div className="tc-modal tc-view-tests-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="tc-modal-header">
                            <div className="tc-modal-title">
                                <h2><FiList /> {selectedMonth.name} - Testlar</h2>
                            </div>
                            <button 
                                className="tc-modal-close"
                                onClick={() => setShowViewTestsModal(false)}
                            >
                                <FiX />
                            </button>
                        </div>

                        <div className="tc-tests-content">
                            {loadingTests ? (
                                <div className="tc-loading">
                                    <div className="spinner"></div>
                                    <p>Testlar yuklanmoqda...</p>
                                </div>
                            ) : monthTests.length === 0 ? (
                                <div className="tc-empty-state">
                                    <FiFileText className="empty-icon" />
                                    <h3>Testlar topilmadi</h3>
                                    <p>Bu oy uchun hali testlar yaratilmagan</p>
                                    <button 
                                        className="btn btn-primary"
                                        onClick={() => {
                                            setShowViewTestsModal(false)
                                            handleCreateTest(selectedMonth)
                                        }}
                                    >
                                        <FiPlus /> Birinchi testni yaratish
                                    </button>
                                </div>
                            ) : (
                                <div className="tc-tests-list">
                                    {monthTests.map((test) => (
                                        <div key={test.id} className="tc-test-card">
                                            <div className="tc-test-header">
                                                <div className="tc-test-info">
                                                    <h3>{test.title}</h3>
                                                    <p>{test.description}</p>
                                                </div>
                                                <div className="tc-test-actions">
                                                    <button 
                                                        className="btn btn-sm btn-secondary"
                                                        onClick={() => handleViewTestDetail(test)}
                                                    >
                                                        <FiEye /> Ko'rish
                                                    </button>
                                                    <button 
                                                        className="btn btn-sm btn-error"
                                                        onClick={() => handleDeleteTest(test.id)}
                                                    >
                                                        <FiTrash2 /> O'chirish
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="tc-test-stats">
                                                <div className="tc-stat">
                                                    <FiClock />
                                                    <span>{test.time_limit_minutes} daqiqa</span>
                                                </div>
                                                <div className="tc-stat">
                                                    <FiUsers />
                                                    <span>{test.attempts_allowed} urinish</span>
                                                </div>
                                                <div className="tc-stat">
                                                    <FiAward />
                                                    <span>{test.pass_score}% o'tish</span>
                                                </div>
                                                <div className="tc-stat">
                                                    <FiFileText />
                                                    <span>{test.questions?.length || 0} savol</span>
                                                </div>
                                            </div>
                                            <div className="tc-test-meta">
                                                <span className={`tc-status ${test.is_active ? 'active' : 'inactive'}`}>
                                                    {test.is_active ? 'Faol' : 'Nofaol'}
                                                </span>
                                                <span className="tc-date">
                                                    {formatDate(test.created_at)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Vazifalarni ko'rish modali */}
            {showViewAssignmentsModal && selectedMonth && (
                <div className="tc-modal-overlay" onClick={() => setShowViewAssignmentsModal(false)}>
                    <div className="tc-modal tc-view-assignments-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="tc-modal-header">
                            <div className="tc-modal-title">
                                <h2><FiClipboard /> {selectedMonth.name} - Vazifalar</h2>
                            </div>
                            <button 
                                className="tc-modal-close"
                                onClick={() => setShowViewAssignmentsModal(false)}
                            >
                                <FiX />
                            </button>
                        </div>

                        <div className="tc-assignments-content">
                            {loadingAssignments ? (
                                <div className="tc-loading">
                                    <div className="spinner"></div>
                                    <p>Vazifalar yuklanmoqda...</p>
                                </div>
                            ) : monthAssignments.length === 0 ? (
                                <div className="tc-empty-state">
                                    <FiClipboard className="empty-icon" />
                                    <h3>Vazifalar topilmadi</h3>
                                    <p>Bu oy uchun hali vazifalar yaratilmagan</p>
                                    <button 
                                        className="btn btn-primary"
                                        onClick={() => {
                                            setShowViewAssignmentsModal(false)
                                            handleCreateAssignment(selectedMonth)
                                        }}
                                    >
                                        <FiPlus /> Birinchi vazifani yaratish
                                    </button>
                                </div>
                            ) : (
                                <div className="tc-assignments-list">
                                    {monthAssignments.map((assignment) => (
                                        <div key={assignment.id} className="tc-assignment-card">
                                            <div className="tc-assignment-header">
                                                <div className="tc-assignment-info">
                                                    <h3>{assignment.title}</h3>
                                                    <p>{assignment.description}</p>
                                                </div>
                                                <div className="tc-assignment-actions">
                                                    <button 
                                                        className="btn btn-sm btn-secondary"
                                                        onClick={() => handleViewAssignmentDetail(assignment)}
                                                    >
                                                        <FiEye /> Ko'rish
                                                    </button>
                                                    <button 
                                                        className="btn btn-sm btn-error"
                                                        onClick={() => handleDeleteAssignment(assignment.id)}
                                                    >
                                                        <FiTrash2 /> O'chirish
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="tc-assignment-stats">
                                                <div className="tc-stat">
                                                    <FiCalendar />
                                                    <span>Muddat: {assignment.due_days_after_completion} kun (video tugagandan keyin)</span>
                                                </div>
                                                <div className="tc-stat">
                                                    <FiAward />
                                                    <span>{assignment.max_points} ball</span>
                                                </div>
                                                <div className="tc-stat">
                                                    <FiSettings />
                                                    <span>{assignment.allow_multiple_submissions ? 'Qayta topshirish mumkin' : 'Bir marta topshirish'}</span>
                                                </div>
                                            </div>
                                            <div className="tc-assignment-meta">
                                                <span className={`tc-status ${assignment.is_active ? 'active' : 'inactive'}`}>
                                                    {assignment.is_active ? 'Faol' : 'Nofaol'}
                                                </span>
                                                <span className="tc-date">
                                                    {formatDate(assignment.created_at)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Test batafsil ko'rish modali */}
            {showTestDetailModal && selectedTest && (
                <div className="tc-modal-overlay" onClick={() => setShowTestDetailModal(false)}>
                    <div className="tc-modal tc-test-detail-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="tc-modal-header">
                            <div className="tc-modal-title">
                                <h2><FiFileText /> {selectedTest.title}</h2>
                            </div>
                            <button 
                                className="tc-modal-close"
                                onClick={() => setShowTestDetailModal(false)}
                            >
                                <FiX />
                            </button>
                        </div>

                        <div className="tc-test-detail-content">
                            <div className="tc-test-info-section">
                                <h3>Test Ma'lumotlari</h3>
                                <div className="tc-info-grid">
                                    <div className="tc-info-item">
                                        <label>Tavsif:</label>
                                        <span>{selectedTest.description}</span>
                                    </div>
                                    <div className="tc-info-item">
                                        <label>Vaqt chegarasi:</label>
                                        <span>{selectedTest.time_limit_minutes} daqiqa</span>
                                    </div>
                                    <div className="tc-info-item">
                                        <label>Urinishlar soni:</label>
                                        <span>{selectedTest.attempts_allowed}</span>
                                    </div>
                                    <div className="tc-info-item">
                                        <label>O'tish bali:</label>
                                        <span>{selectedTest.pass_score}%</span>
                                    </div>
                                    <div className="tc-info-item">
                                        <label>Holat:</label>
                                        <span className={`tc-status ${selectedTest.is_active ? 'active' : 'inactive'}`}>
                                            {selectedTest.is_active ? 'Faol' : 'Nofaol'}
                                        </span>
                                    </div>
                                    <div className="tc-info-item">
                                        <label>Yaratilgan:</label>
                                        <span>{formatDate(selectedTest.created_at)}</span>
                                    </div>
                                </div>
                            </div>

                            {selectedTest.questions && selectedTest.questions.length > 0 && (
                                <div className="tc-questions-section">
                                    <h3>Savollar ({selectedTest.questions.length})</h3>
                                    <div className="tc-questions-list">
                                        {selectedTest.questions.map((question, index) => (
                                            <div key={question.id || index} className="tc-question-item">
                                                <div className="tc-question-header">
                                                    <h4>Savol {index + 1}</h4>
                                                    <span className="tc-question-points">{question.points} ball</span>
                                                </div>
                                                <p className="tc-question-text">{question.text}</p>
                                                <div className="tc-options-list">
                                                    {question.options?.map((option, optIndex) => (
                                                        <div key={option.id || optIndex} className={`tc-option-item ${option.is_correct ? 'correct' : ''}`}>
                                                            <span className="tc-option-letter">{String.fromCharCode(65 + optIndex)}</span>
                                                            <span className="tc-option-text">{option.text}</span>
                                                            {option.is_correct && <FiCheck className="tc-correct-icon" />}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Vazifa batafsil ko'rish modali */}
            {showAssignmentDetailModal && selectedAssignment && (
                <div className="tc-modal-overlay" onClick={() => setShowAssignmentDetailModal(false)}>
                    <div className="tc-modal tc-assignment-detail-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="tc-modal-header">
                            <div className="tc-modal-title">
                                <h2><FiClipboard /> {selectedAssignment.title}</h2>
                            </div>
                            <button 
                                className="tc-modal-close"
                                onClick={() => setShowAssignmentDetailModal(false)}
                            >
                                <FiX />
                            </button>
                        </div>

                        <div className="tc-assignment-detail-content">
                            <div className="tc-assignment-info-section">
                                <h3>Vazifa Ma'lumotlari</h3>
                                <div className="tc-info-grid">
                                    <div className="tc-info-item tc-full-width">
                                        <label>Tavsif:</label>
                                        <div className="tc-description-text">{selectedAssignment.description}</div>
                                    </div>
                                    <div className="tc-info-item">
                                        <label>Topshirish muddati:</label>
                                        <span>{selectedAssignment.due_days_after_completion} kun (video tugagandan keyin)</span>
                                    </div>
                                    <div className="tc-info-item">
                                        <label>Maksimal ball:</label>
                                        <span>{selectedAssignment.max_points}</span>
                                    </div>
                                    <div className="tc-info-item">
                                        <label>Qayta topshirish:</label>
                                        <span>{selectedAssignment.allow_multiple_submissions ? 'Ruxsat berilgan' : 'Ruxsat berilmagan'}</span>
                                    </div>
                                    <div className="tc-info-item">
                                        <label>Holat:</label>
                                        <span className={`tc-status ${selectedAssignment.is_active ? 'active' : 'inactive'}`}>
                                            {selectedAssignment.is_active ? 'Faol' : 'Nofaol'}
                                        </span>
                                    </div>
                                    <div className="tc-info-item">
                                        <label>Yaratilgan:</label>
                                        <span>{formatDate(selectedAssignment.created_at)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Rejection Reason Modal */}
            {showReasonModal && selectedReason && (
                <div className="tc-modal-overlay" onClick={() => setShowReasonModal(false)}>
                    <div className="tc-reason-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="tc-reason-modal-header">
                            <div className="tc-reason-icon">
                                <FiX />
                            </div>
                            <h2>Rad etilish sababi</h2>
                            <button 
                                className="tc-modal-close"
                                onClick={() => setShowReasonModal(false)}
                            >
                                <FiX />
                            </button>
                        </div>

                        <div className="tc-reason-modal-content">
                            <div className="tc-reason-course-title">
                                <FiBook />
                                <h3>{selectedReason.title}</h3>
                            </div>

                            <div className="tc-reason-box">
                                <div className="tc-reason-label">
                                    <FiFileText />
                                    <span>Moderator izohi:</span>
                                </div>
                                <p className="tc-reason-text">{selectedReason.reason}</p>
                            </div>

                            <div className="tc-reason-actions">
                                <button 
                                    className="tc-reason-btn-edit"
                                    onClick={() => {
                                        setShowReasonModal(false)
                                        const course = courses.find(c => c.title === selectedReason.title)
                                        if (course) handleEdit(course)
                                    }}
                                >
                                    <FiEdit />
                                    <span>Kursni tahrirlash</span>
                                </button>
                                <button 
                                    className="tc-reason-btn-close"
                                    onClick={() => setShowReasonModal(false)}
                                >
                                    Yopish
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TeacherInfomration
export { TeacherInfomration as Categories }
