import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Routes, Route, NavLink } from 'react-router-dom';
import { FiHome, FiBook, FiArrowLeft, FiHelpCircle, FiCalendar, FiSettings, FiCheck } from 'react-icons/fi';
import { getClassroomDetail } from '../../api/apiClassroom';
import StudentClassroomStream from './StudentClassroomStream';
import StudentClasswork from './StudentClasswork';
import StudentQuestions from './StudentQuestions';
import StudentAttendance from './StudentAttendance';

const StudentClassroomDashboard = () => {
    const { classroomId } = useParams();
    const navigate = useNavigate();
    const [classroom, setClassroom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showTabSelector, setShowTabSelector] = useState(false);
    const [selectedTabs, setSelectedTabs] = useState(['stream', 'classwork', 'questions']);

    // Available tabs for students
    const availableTabs = [
        { id: 'stream', name: 'Oqim', icon: FiHome, description: 'Asosiy oqim - e\'lonlar va yangiliklar' },
        { id: 'classwork', name: 'Darslar', icon: FiBook, description: 'Darslar - vazifalar, testlar, materiallar' },
        { id: 'questions', name: 'Savollar', icon: FiHelpCircle, description: 'Mening savollarim' },
        { id: 'attendance', name: 'Davomat', icon: FiCalendar, description: 'Mening davomatim' }
    ];

    useEffect(() => {
        fetchClassroomDetail();
    }, [classroomId]);

    const fetchClassroomDetail = async () => {
        try {
            setLoading(true);
            const data = await getClassroomDetail(classroomId);
            setClassroom(data);
        } catch (error) {
            console.error('Error fetching classroom:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTabToggle = (tabId) => {
        if (selectedTabs.includes(tabId)) {
            // Remove tab if already selected (but keep at least 1 tab)
            if (selectedTabs.length > 3) {
                setSelectedTabs(selectedTabs.filter(id => id !== tabId));
            }
        } else {
            // Add tab if not selected (but keep max 3 tabs)
            if (selectedTabs.length < 4) {
                setSelectedTabs([...selectedTabs, tabId]);
            }
        }
    };

    const saveTabSelection = () => {
        // Save to localStorage for persistence
        localStorage.setItem(`student-classroom-tabs-${classroomId}`, JSON.stringify(selectedTabs));
        setShowTabSelector(false);
    };

    // Load saved tabs on component mount
    useEffect(() => {
        const savedTabs = localStorage.getItem(`student-classroom-tabs-${classroomId}`);
        if (savedTabs) {
            try {
                const parsedTabs = JSON.parse(savedTabs);
                if (Array.isArray(parsedTabs) && parsedTabs.length > 0) {
                    setSelectedTabs(parsedTabs);
                }
            } catch (error) {
                console.error('Error parsing saved tabs:', error);
            }
        }
    }, [classroomId]);

    if (loading) {
        return (
            <div className="scd-loading">
                <div className="spinner"></div>
                <p>Yuklanmoqda...</p>
            </div>
        );
    }

    if (!classroom) {
        return (
            <div className="scd-error">
                <p>Sinf topilmadi</p>
                <button onClick={() => navigate('/user/classrooms')}>
                    Orqaga
                </button>
            </div>
        );
    }

    return (
        <div className="student-classroom-dashboard">
            <div className="scd-header" style={{ '--theme-color': classroom.theme_color }}>
                <button 
                    className="scd-back-btn"
                    onClick={() => navigate('/user/classrooms')}
                    title="Sinflar ro'yxatiga qaytish"
                >
                    <FiArrowLeft /> Orqaga
                </button>

                <div className="scd-header-content">
                    <h1>{classroom.name}</h1>
                    <div className="scd-header-info">
                        <span>{classroom.section}</span>
                        <span>•</span>
                        <span>{classroom.subject}</span>
                        <span>•</span>
                        <span>O'qituvchi: {classroom.teacher.full_name}</span>
                    </div>
                </div>

                <button 
                    className="scd-settings-btn"
                    onClick={() => setShowTabSelector(true)}
                    title="Tab sozlamalarini o'zgartirish"
                >
                    <FiSettings />
                </button>
            </div>

            <nav className="scd-nav">
                {availableTabs
                    .filter(tab => selectedTabs.includes(tab.id))
                    .map(tab => {
                        const IconComponent = tab.icon;
                        return (
                            <NavLink 
                                key={tab.id}
                                to={`/user/classroom/${classroomId}/${tab.id}`}
                                className={({ isActive }) => isActive ? 'scd-nav-link active' : 'scd-nav-link'}
                                title={tab.description}
                            >
                                <IconComponent /> {tab.name}
                            </NavLink>
                        );
                    })
                }
            </nav>

            <div className="scd-content">
                <Routes>
                    <Route path="stream" element={<StudentClassroomStream classroom={classroom} />} />
                    <Route path="classwork" element={<StudentClasswork classroom={classroom} />} />
                    <Route path="questions" element={<StudentQuestions classroom={classroom} />} />
                    <Route path="attendance" element={<StudentAttendance classroom={classroom} />} />
                </Routes>
            </div>

            {/* Tab Selection Modal */}
            {showTabSelector && (
                <div className="scd-modal-overlay" onClick={() => setShowTabSelector(false)}>
                    <div className="scd-tab-selector-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="scd-modal-header">
                            <h3>Dashboard tablarini tanlang</h3>
                            <p>Maksimal 3 ta tab tanlashingiz mumkin</p>
                            <button 
                                className="scd-modal-close"
                                onClick={() => setShowTabSelector(false)}
                            >
                                ×
                            </button>
                        </div>

                        <div className="scd-modal-content">
                            <div className="scd-tab-grid">
                                {availableTabs.map(tab => {
                                    const IconComponent = tab.icon;
                                    const isSelected = selectedTabs.includes(tab.id);
                                    const canSelect = !isSelected && selectedTabs.length < 4;
                                    const canDeselect = isSelected && selectedTabs.length > 3;
                                    
                                    return (
                                        <div 
                                            key={tab.id}
                                            className={`scd-tab-option ${isSelected ? 'selected' : ''} ${
                                                !canSelect && !isSelected ? 'disabled' : ''
                                            }`}
                                            onClick={() => {
                                                if (canSelect || canDeselect) {
                                                    handleTabToggle(tab.id);
                                                }
                                            }}
                                        >
                                            <div className="scd-tab-option-header">
                                                <div className="scd-tab-option-icon">
                                                    <IconComponent />
                                                </div>
                                                <div className="scd-tab-option-check">
                                                    {isSelected && <FiCheck />}
                                                </div>
                                            </div>
                                            <h4>{tab.name}</h4>
                                            <p>{tab.description}</p>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="scd-selection-info">
                                <p>
                                    Tanlangan: <strong>{selectedTabs.length}/3</strong>
                                </p>
                                <div className="scd-selected-tabs">
                                    {selectedTabs.map(tabId => {
                                        const tab = availableTabs.find(t => t.id === tabId);
                                        return tab ? (
                                            <span key={tabId} className="scd-selected-tag">
                                                {tab.name}
                                            </span>
                                        ) : null;
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="scd-modal-footer">
                            <button 
                                className="scd-btn scd-btn-secondary"
                                onClick={() => setShowTabSelector(false)}
                            >
                                Bekor qilish
                            </button>
                            <button 
                                className="scd-btn scd-btn-primary"
                                onClick={saveTabSelection}
                                disabled={selectedTabs.length === 0}
                            >
                                Saqlash
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentClassroomDashboard;
