import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiUsers, FiBook, FiFileText, FiSettings, FiTrash2, FiLock, FiUnlock, FiCopy, FiHome, FiHelpCircle, FiCalendar, FiBarChart2, FiCheck } from 'react-icons/fi';
import { getTeacherClassrooms, createClassroom, deleteClassroom } from '../../api/apiClassroom';
import { setSeoTags, setRobots } from '../../utils/seo';

const TeacherClassrooms = () => {
    const navigate = useNavigate();
    const [classrooms, setClassrooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showTabSelector, setShowTabSelector] = useState(false);
    const [selectedClassroomId, setSelectedClassroomId] = useState(null);
    const [selectedTabs, setSelectedTabs] = useState(['stream', 'classwork', 'submitted']);
    const [formData, setFormData] = useState({
        name: '',
        subject: '',
        room: '',
        section: '',
        description: '',
        theme_color: '#1976d2',
        is_private: false,
        password: ''
    });

    // Available tabs configuration
    const availableTabs = [
        { id: 'stream', name: 'Oqim', icon: FiHome, description: 'Asosiy oqim - e\'lonlar va yangiliklar' },
        { id: 'classwork', name: 'Darslar', icon: FiBook, description: 'Darslar - vazifalar, testlar, materiallar' },
        { id: 'submitted', name: 'Topshirilgan', icon: FiFileText, description: 'Topshirilgan vazifalar' },
        { id: 'questions', name: 'Savollar', icon: FiHelpCircle, description: 'O\'quvchilar savollari' },
        { id: 'attendance', name: 'Davomat', icon: FiCalendar, description: 'Davomat - o\'quvchilar qatnashishi' },
        { id: 'people', name: 'O\'quvchilar', icon: FiUsers, description: 'O\'quvchilar ro\'yxati va boshqaruv' },
        { id: 'grades', name: 'Baholar', icon: FiBarChart2, description: 'Baholar jurnali va statistika' }
    ];

    useEffect(() => {
        fetchClassrooms();
    }, []);

    useEffect(() => {
        setSeoTags({
            title: "Klassroom — O‘qituvchi — ZiyoFlix",
            description: "Sinflarni yarating, darslar, topshiriqlar va testlarni boshqaring. O‘quvchilar bilan samarali ishlang.",
            image: '/Ziyo-Flix-Logo.png',
            type: 'website'
        })
        setRobots('noindex, nofollow')
    }, [])

    const fetchClassrooms = async () => {
        try {
            setLoading(true);
            const response = await getTeacherClassrooms();
            setClassrooms(response.results || []);
        } catch (error) {
            console.error('Error fetching classrooms:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateClassroom = async (e) => {
        e.preventDefault();
        try {
            await createClassroom(formData);
            setShowCreateModal(false);
            setFormData({
                name: '',
                subject: '',
                room: '',
                section: '',
                description: '',
                theme_color: '#1976d2',
                is_private: false,
                password: ''
            });
            fetchClassrooms();
        } catch (error) {
            console.error('Error creating classroom:', error);
        }
    };

    const handleDeleteClassroom = async (classroomId) => {
        if (window.confirm('Sinfni o\'chirishni xohlaysizmi?')) {
            try {
                await deleteClassroom(classroomId);
                fetchClassrooms();
            } catch (error) {
                console.error('Error deleting classroom:', error);
            }
        }
    };

    const handleCopyCode = (code) => {
        navigator.clipboard.writeText(code);
        alert('Kod nusxalandi!');
    };

    const handleClassroomClick = (classroomId) => {
        navigate(`/teacher/classroom/${classroomId}/stream`);
    };

    const handleTabSelection = (classroomId) => {
        setSelectedClassroomId(classroomId);
        // Load saved tabs for this classroom
        const savedTabs = localStorage.getItem(`classroom-tabs-${classroomId}`);
        if (savedTabs) {
            try {
                const parsedTabs = JSON.parse(savedTabs);
                if (Array.isArray(parsedTabs) && parsedTabs.length > 0) {
                    setSelectedTabs(parsedTabs);
                }
            } catch (error) {
                console.error('Error parsing saved tabs:', error);
                setSelectedTabs(['stream', 'classwork', 'submitted']);
            }
        } else {
            setSelectedTabs(['stream', 'classwork', 'submitted']);
        }
        setShowTabSelector(true);
    };

    const handleTabToggle = (tabId) => {
        if (selectedTabs.includes(tabId)) {
            // Remove tab if already selected (but keep at least 1 tab)
            if (selectedTabs.length > 3) {
                setSelectedTabs(selectedTabs.filter(id => id !== tabId));
            }
        } else {
            // Add tab if not selected (but keep max 3 tabs)
            if (selectedTabs.length < 7) {
                setSelectedTabs([...selectedTabs, tabId]);
            }
        }
    };

    const saveTabSelection = () => {
        if (selectedClassroomId) {
            // Save to localStorage for persistence
            localStorage.setItem(`classroom-tabs-${selectedClassroomId}`, JSON.stringify(selectedTabs));
            setShowTabSelector(false);
            // Navigate to classroom with first selected tab
            const firstTab = selectedTabs[0] || 'stream';
            navigate(`/teacher/classroom/${selectedClassroomId}/${firstTab}`);
        }
    };

    const themeColors = [
        { value: '#1976d2', name: 'Ko\'k' },
        { value: '#388e3c', name: 'Yashil' },
        { value: '#d32f2f', name: 'Qizil' },
        { value: '#f57c00', name: 'To\'q sariq' },
        { value: '#7b1fa2', name: 'Binafsha' },
        { value: '#0097a7', name: 'Moviy' }
    ];

    if (loading) {
        return (
            <div className="teacher-classrooms">
                <div className="tc-loading">
                    <div className="spinner"></div>
                    <p>Yuklanmoqda...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="teacher-classrooms">
            <div className="tc-header">
                <div className="tc-header-content">
                    <h1>Mening Sinflarim</h1>
                    <p>Sinflarni yarating, darslar, topshiriqlar va testlarni boshqaring. O‘quvchilar bilan samarali ishlang.</p>
                </div>
                <button
                    className="tc-create-btn"
                    onClick={() => setShowCreateModal(true)}
                    title="Yangi sinf yaratish"
                >
                    <FiPlus /> Sinf yaratish
                </button>
            </div>

            {classrooms.length === 0 ? (
                <div className="tc-empty">
                    <div className="tc-empty-icon">
                        <FiBook />
                    </div>
                    <h2>Hali sinflar yo'q</h2>
                    <p>Birinchi sinfingizni yarating va o'quvchilarni taklif qiling</p>
                    <button
                        className="tc-empty-btn"
                        onClick={() => setShowCreateModal(true)}
                    >
                        <FiPlus /> Sinf yaratish
                    </button>
                </div>
            ) : (
                <div className="tc-grid">
                    {classrooms.map(classroom => (
                        <div
                            key={classroom.id}
                            className="tc-card"
                            style={{ '--theme-color': classroom.theme_color }}
                        >
                            <div
                                className="tc-card-header"
                                onClick={() => handleClassroomClick(classroom.id)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="tc-card-title">
                                    <h3>{classroom.name}</h3>
                                    <span className="tc-card-section">{classroom.section}</span>
                                </div>
                                <div className="tc-card-privacy">
                                    {classroom.is_private ? (
                                        <span className="tc-privacy-badge private" title="Maxfiy sinf - parol talab qilinadi">
                                            <FiLock /> Maxfiy
                                        </span>
                                    ) : (
                                        <span className="tc-privacy-badge public" title="Ochiq sinf - parolsiz kirish mumkin">
                                            <FiUnlock /> Ochiq
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="tc-card-body" onClick={() => handleClassroomClick(classroom.id)}>
                                <div className="tc-card-info">
                                    <p className="tc-card-subject">
                                        <FiBook /> {classroom.subject}
                                    </p>
                                    <p className="tc-card-room">{classroom.room}</p>
                                </div>
                                <p className="tc-card-description">{classroom.description}</p>
                            </div>

                            <div className="tc-card-stats">
                                <div className="tc-stat" title="O'quvchilar soni">
                                    <FiUsers />
                                    <span>{classroom.students_count}</span>
                                </div>
                                <div className="tc-stat" title="Topshiriqlar soni">
                                    <FiFileText />
                                    <span>{classroom.assignments_count}</span>
                                </div>
                                <div className="tc-stat" title="Materiallar soni">
                                    <FiBook />
                                    <span>{classroom.materials_count}</span>
                                </div>
                            </div>

                            <div className="tc-card-footer">
                                <div className="tc-card-code">
                                    <span className="tc-code-label">Sinf kodi:</span>
                                    <span className="tc-code-value">{classroom.code}</span>
                                    <button
                                        className="tc-copy-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleCopyCode(classroom.code);
                                        }}
                                        title="Kodni nusxalash"
                                    >
                                        <FiCopy />
                                    </button>
                                </div>
                                <div className="tc-card-actions">
                                    <button
                                        className="tc-action-btn tab-selector"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleTabSelection(classroom.id);
                                        }}
                                        title="Sinfga qo'shilish - kerakli funksiyalarni tanlang"
                                    >
                                        <FiSettings />
                                        <span>Qo'shilish</span>
                                    </button>
                                    <button
                                        className="tc-action-btn delete"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteClassroom(classroom.id);
                                        }}
                                        title="Sinfni o'chirish"
                                    >
                                        <FiTrash2 />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Classroom Modal */}
            {showCreateModal && (
                <div className="tc-modal-overlay" onClick={() => setShowCreateModal(false)}>
                    <div className="tc-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="tc-modal-header">
                            <h2>Yangi Sinf Yaratish</h2>
                            <button
                                className="tc-modal-close"
                                onClick={() => setShowCreateModal(false)}
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleCreateClassroom} className="tc-modal-form">
                            <div className="tc-form-group">
                                <label>Sinf nomi *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Masalan: Dasturlash Asoslari"
                                    required
                                />
                            </div>

                            <div className="tc-form-row">
                                <div className="tc-form-group">
                                    <label>Fan</label>
                                    <input
                                        type="text"
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        placeholder="Masalan: Informatika"
                                    />
                                </div>

                                <div className="tc-form-group">
                                    <label>Bo'lim</label>
                                    <input
                                        type="text"
                                        value={formData.section}
                                        onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                                        placeholder="Masalan: A guruh"
                                    />
                                </div>
                            </div>

                            <div className="tc-form-group">
                                <label>Xona</label>
                                <input
                                    type="text"
                                    value={formData.room}
                                    onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                                    placeholder="Masalan: 101-xona"
                                />
                            </div>

                            <div className="tc-form-group">
                                <label>Tavsif</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Sinf haqida qisqacha ma'lumot"
                                    rows="3"
                                />
                            </div>

                            <div className="tc-form-group">
                                <label>Rang tanlash</label>
                                <div className="tc-color-picker">
                                    {themeColors.map(color => (
                                        <button
                                            key={color.value}
                                            type="button"
                                            className={`tc-color-option ${formData.theme_color === color.value ? 'active' : ''}`}
                                            style={{ backgroundColor: color.value }}
                                            onClick={() => setFormData({ ...formData, theme_color: color.value })}
                                            title={color.name}
                                        />
                                    ))}
                                    <div className="tc-custom-color">
                                        <input
                                            type="color"
                                            value={formData.theme_color}
                                            onChange={(e) => setFormData({ ...formData, theme_color: e.target.value })}
                                            title="O'zingiz rang tanlang"
                                        />
                                        <span>Custom</span>
                                    </div>
                                </div>
                            </div>

                            <div className="tc-form-group tc-checkbox-group">
                                <label className="tc-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_private}
                                        onChange={(e) => setFormData({ ...formData, is_private: e.target.checked })}
                                    />
                                    <span>Maxfiy sinf (parol bilan)</span>
                                </label>
                                <p className="tc-checkbox-hint">
                                    Maxfiy sinf bo'lsa, o'quvchilar faqat parol bilan qo'shilishlari mumkin
                                </p>
                            </div>

                            {formData.is_private && (
                                <div className="tc-form-group">
                                    <label>Parol *</label>
                                    <input
                                        type="text"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        placeholder="Sinf uchun parol kiriting"
                                        required={formData.is_private}
                                    />
                                </div>
                            )}

                            <div className="tc-modal-actions">
                                <button
                                    type="button"
                                    className="tc-btn-cancel"
                                    onClick={() => setShowCreateModal(false)}
                                >
                                    Bekor qilish
                                </button>
                                <button type="submit" className="tc-btn-submit">
                                    Yaratish
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Tab Selection Modal */}
            {showTabSelector && (
                <div className="tc-tab-modal-overlay" onClick={() => setShowTabSelector(false)}>
                    <div className="tc-tab-selector-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="tc-tab-modal-header">
                            <h3>Kerakli funksiyalarni tanlang</h3>
                            <p>Sinfga qo'shilishda qaysi bo'limlar ko'rinishini tanlang (maksimal 3 ta)</p>
                            <button
                                className="tc-tab-modal-close"
                                onClick={() => setShowTabSelector(false)}
                            >
                                ×
                            </button>
                        </div>

                        <div className="tc-tab-modal-content">
                            <div className="tc-tab-grid">
                                {availableTabs.map(tab => {
                                    const IconComponent = tab.icon;
                                    const isSelected = selectedTabs.includes(tab.id);
                                    const canSelect = !isSelected && selectedTabs.length < 7;
                                    const canDeselect = isSelected && selectedTabs.length > 3;

                                    return (
                                        <div
                                            key={tab.id}
                                            className={`tc-tab-option ${isSelected ? 'selected' : ''} ${!canSelect && !isSelected ? 'disabled' : ''
                                                }`}
                                            onClick={() => {
                                                if (canSelect || canDeselect) {
                                                    handleTabToggle(tab.id);
                                                }
                                            }}
                                        >
                                            <div className="tc-tab-option-header">
                                                <div className="tc-tab-option-icon">
                                                    <IconComponent />
                                                </div>
                                                <div className="tc-tab-option-check">
                                                    {isSelected && <FiCheck />}
                                                </div>
                                            </div>
                                            <h4>{tab.name}</h4>
                                            <p>{tab.description}</p>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="tc-tab-selection-info">
                                <div className="tc-selection-counter">
                                    <span>Tanlangan: <strong>{selectedTabs.length}/3</strong></span>
                                </div>
                                <div className="tc-selected-tabs">
                                    {selectedTabs.map(tabId => {
                                        const tab = availableTabs.find(t => t.id === tabId);
                                        return tab ? (
                                            <span key={tabId} className="tc-selected-tag">
                                                <tab.icon />
                                                {tab.name}
                                            </span>
                                        ) : null;
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="tc-tab-modal-footer">
                            <button
                                className="tc-tab-btn tc-tab-btn-cancel"
                                onClick={() => setShowTabSelector(false)}
                            >
                                Bekor qilish
                            </button>
                            <button
                                className="tc-tab-btn tc-tab-btn-save"
                                onClick={saveTabSelection}
                                disabled={selectedTabs.length === 0}
                            >
                                Saqlash va Kirish
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherClassrooms;
