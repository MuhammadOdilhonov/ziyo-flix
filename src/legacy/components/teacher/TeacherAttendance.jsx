import React, { useState, useEffect } from 'react';
import { FiCalendar, FiUsers, FiCheck, FiX, FiClock, FiSettings, FiSave, FiLock } from 'react-icons/fi';
import { getClassroomAttendance, saveAttendance, getClasswork } from '../../api/apiClassroom';

const TeacherAttendance = ({ classroom }) => {
    const [students, setStudents] = useState([]);
    const [topics, setTopics] = useState([]);
    const [classworkItems, setClassworkItems] = useState([]);
    const [attendanceData, setAttendanceData] = useState({});
    const [loading, setLoading] = useState(true);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [attendanceSettings, setAttendanceSettings] = useState({
        lessonsPerMonth: 8,
        lessonsPerWeek: 2,
        weekDays: 'even', // 'even', 'odd', 'all'
        attendanceType: 'offline', // 'offline', 'online', 'hybrid'
        topicDisplay: 'topic' // 'topic' | 'item'
    });
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [calendar, setCalendar] = useState([]);

    useEffect(() => {
        if (classroom) {
            fetchAttendanceData();
            fetchTopics();
        }
    }, [classroom, selectedMonth, selectedYear]);

    useEffect(() => {
        generateCalendar();
    }, [attendanceSettings, selectedMonth, selectedYear, topics, classworkItems]);

    const fetchAttendanceData = async () => {
        try {
            setLoading(true);
            const data = await getClassroomAttendance(classroom.id, selectedMonth + 1, selectedYear);
            setStudents(data.students || mockStudents);
            setAttendanceData(data.attendance || {});
        } catch (error) {
            console.error('Error fetching attendance:', error);
            setStudents(mockStudents);
        } finally {
            setLoading(false);
        }
    };

    const fetchTopics = async () => {
        try {
            const classworkData = await getClasswork(classroom.id);
            setTopics(classworkData.topics || mockTopics);
            setClassworkItems(classworkData.items || []);
        } catch (error) {
            console.error('Error fetching topics:', error);
            setTopics(mockTopics);
            setClassworkItems([]);
        }
    };

    const generateCalendar = () => {
        const year = selectedYear;
        const month = selectedMonth;
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        const today = new Date();
        const isBeforeCurrentMonth =
            year < today.getFullYear() || (year === today.getFullYear() && month < today.getMonth());
        const isAfterCurrentMonth =
            year > today.getFullYear() || (year === today.getFullYear() && month > today.getMonth());

        const calendarDays = [];
        const { lessonsPerMonth, lessonsPerWeek, weekDays, topicDisplay } = attendanceSettings;

        // Calculate lesson days based on settings
        const lessonDays = [];
        let lessonsAdded = 0;
        const weekCounts = {};

        for (let day = 1; day <= daysInMonth; day++) {
            if (lessonsPerMonth && lessonsAdded >= lessonsPerMonth) break;
            const date = new Date(year, month, day);
            const dayOfWeek = date.getDay(); // 0=Sun, 1=Mon, ... 6=Sat
            const weekIndex = Math.ceil(day / 7); // simple week grouping

            let allowed = false;
            if (weekDays === 'even') {
                // Label says: Juft kunlar -> Dushanba(1), Chorshanba(3), Juma(5)
                allowed = [1, 3, 5].includes(dayOfWeek);
            } else if (weekDays === 'odd') {
                // Label says: Toq kunlar -> Seshanba(2), Payshanba(4), Shanba(6)
                allowed = [2, 4, 6].includes(dayOfWeek);
            } else if (weekDays === 'all') {
                allowed = dayOfWeek >= 1 && dayOfWeek <= 5; // Mon-Fri
            }

            if (!allowed) continue;
            const usedThisWeek = weekCounts[weekIndex] || 0;
            if (lessonsPerWeek && usedThisWeek >= lessonsPerWeek) continue;

            lessonDays.push(day);
            weekCounts[weekIndex] = usedThisWeek + 1;
            lessonsAdded++;
        }

        // Build label list from topics or items
        const byTopicOrder = (a, b) => (a.order || 0) - (b.order || 0);
        const sortedTopics = [...topics].sort(byTopicOrder);
        let labelList = [];
        if (topicDisplay === 'item' && classworkItems && classworkItems.length > 0) {
            // Flatten items by topic order to preserve logical flow
            sortedTopics.forEach(t => {
                const items = classworkItems.filter(i => i.topic_id === t.id);
                items.forEach(i => {
                    labelList.push({ id: i.id, text: i.title || i.description || `Item #${i.id}`, type: i.type || 'item' });
                });
            });
        }
        if (labelList.length === 0) {
            // Fallback to topics
            labelList = sortedTopics.length > 0
                ? sortedTopics.map(t => ({ id: t.id, text: t.name, type: 'topic' }))
                : [{ id: 0, text: 'Mavzu', type: 'topic' }];
        }

        // Generate calendar with one label per lesson day (no combining)
        const calendarWithTopics = lessonDays.map((day, index) => {
            const label = labelList[index % labelList.length];
            const labelText = label?.text || `Mavzu ${index + 1}`;
            return {
                day,
                date: new Date(year, month, day),
                topic: { id: label?.id || index + 1, name: labelText },
                labelText,
                isLessonDay: true,
                lessonNumber: index + 1,
                isLocked:
                    isBeforeCurrentMonth
                        ? true
                        : isAfterCurrentMonth
                            ? false
                            : new Date(year, month, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate())
            };
        });

        setCalendar(calendarWithTopics);
    };

    const handleAttendanceChange = (studentId, day, status) => {
        const key = `${studentId}-${day}`;
        setAttendanceData(prev => ({
            ...prev,
            [key]: status
        }));
    };

    const getAttendanceStatus = (studentId, day) => {
        const key = `${studentId}-${day}`;
        return attendanceData[key] || null;
    };

    const saveAttendanceData = async () => {
        try {
            await saveAttendance(classroom.id, {
                month: selectedMonth + 1,
                year: selectedYear,
                attendance: attendanceData
            });
            alert('Davomat saqlandi!');
        } catch (error) {
            console.error('Error saving attendance:', error);
            alert('Davomat saqlashda xatolik!');
        }
    };

    const getAttendanceIcon = (status) => {
        switch (status) {
            case 'present': return <FiCheck className="attendance-present" />;
            case 'absent': return <FiX className="attendance-absent" />;
            case 'excused': return <span className="attendance-excused">S</span>;
            default: return null;
        }
    };

    const getAttendanceStats = (studentId) => {
        const totalLessons = calendar.length;
        let present = 0, absent = 0, excused = 0;

        calendar.forEach(({ day }) => {
            const status = getAttendanceStatus(studentId, day);
            if (status === 'present') present++;
            else if (status === 'absent') absent++;
            else if (status === 'excused') excused++;
        });

        const percentage = totalLessons > 0 ? Math.round((present / totalLessons) * 100) : 0;
        return { present, absent, excused, percentage, total: totalLessons };
    };

    // Mock data
    const mockStudents = [
        { id: 1, full_name: 'Ali Valiyev', username: 'ali_v', avatar: null },
        { id: 2, full_name: 'Malika Karimova', username: 'malika_k', avatar: null },
        { id: 3, full_name: 'Bobur Toshmatov', username: 'bobur_t', avatar: null },
        { id: 4, full_name: 'Nilufar Rahimova', username: 'nilufar_r', avatar: null },
        { id: 5, full_name: 'Sardor Usmonov', username: 'sardor_u', avatar: null }
    ];

    const mockTopics = [
        { id: 1, name: 'Kirish va asoslar' },
        { id: 2, name: 'O\'zgaruvchilar' },
        { id: 3, name: 'Funksiyalar' },
        { id: 4, name: 'Massivlar' },
        { id: 5, name: 'Obyektlar' },
        { id: 6, name: 'Sikllar' },
        { id: 7, name: 'Shartlar' },
        { id: 8, name: 'Yakuniy loyiha' }
    ];

    const monthNames = [
        'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
        'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'
    ];

    if (loading) {
        return (
            <div className="ta-loading">
                <div className="ta-spinner"></div>
                <p>Davomat ma'lumotlari yuklanmoqda...</p>
            </div>
        );
    }

    return (
        <div className="teacher-attendance">
            <div className="ta-header">
                <div className="ta-header-info">
                    <h2>
                        <FiUsers />
                        Davomat - {classroom?.name}
                    </h2>
                    <p>
                        {monthNames[selectedMonth]} {selectedYear} -
                        {calendar.length} ta dars, {students.length} ta o'quvchi
                    </p>
                </div>

                <div className="ta-header-controls">
                    <div className="ta-month-selector">
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                        >
                            {monthNames.map((month, index) => (
                                <option key={index} value={index}>{month}</option>
                            ))}
                        </select>
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                        >
                            {[2023, 2024, 2025, 2026].map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        className="ta-settings-btn"
                        onClick={() => setShowSettingsModal(true)}
                    >
                        <FiSettings />
                        Sozlamalar
                    </button>

                    <button
                        className="ta-save-btn"
                        onClick={saveAttendanceData}
                    >
                        <FiSave />
                        Saqlash
                    </button>
                </div>
            </div>

            <div className="ta-attendance-table">
                <div className="ta-table-container">
                    <div className="ta-table-header">
                        <div className="ta-student-column">O'quvchi</div>
                        <div className="ta-days-container">
                            {calendar.map(({ day, topic, lessonNumber, isLocked, labelText }) => (
                                <div key={day} className={`ta-day-column${isLocked ? ' ta-day-column--locked' : ''}`}>
                                    <div className="ta-day-number">
                                        {day}
                                        {isLocked && (
                                            <span className="ta-day-lock" title="O'tgan kun">
                                                <FiLock />
                                            </span>
                                        )}
                                    </div>
                                    <div className="ta-day-topic" title={labelText}>
                                        {labelText}
                                    </div>
                                    <div className="ta-lesson-number">#{lessonNumber}</div>
                                </div>
                            ))}
                        <div className="ta-stats-column">Statistika</div>
                        </div>
                    </div>

                    <div className="ta-table-body">
                        {students.map(student => {
                            const stats = getAttendanceStats(student.id);
                            return (
                                <div key={student.id} className="ta-student-row">
                                    <div className="ta-student-info">
                                        <div className="ta-student-avatar">
                                            {student.avatar ? (
                                                <img src={student.avatar} alt={student.full_name} />
                                            ) : (
                                                <div className="ta-avatar-placeholder">
                                                    {student.full_name.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        <div className="ta-student-details">
                                            <h4>{student.full_name}</h4>
                                            <span>@{student.username}</span>
                                        </div>
                                    </div>

                                    <div className="ta-days-container">
                                        {calendar.map(({ day, isLocked }) => (
                                            <div key={day} className={`ta-attendance-cell${isLocked ? ' ta-attendance-cell--locked' : ''}`}>
                                                <AttendanceButton
                                                    status={getAttendanceStatus(student.id, day)}
                                                    onChange={(status) => handleAttendanceChange(student.id, day, status)}
                                                    attendanceType={attendanceSettings.attendanceType}
                                                    disabled={isLocked}
                                                />
                                            </div>
                                        ))}
                                    <div className="ta-student-stats">
                                        <div className="ta-stats-percentage">{stats.percentage}%</div>
                                        <div className="ta-stats-details">
                                            <span className="ta-stat-present">{stats.present}</span>
                                            <span className="ta-stat-absent">{stats.absent}</span>
                                            <span className="ta-stat-excused">{stats.excused}</span>
                                        </div>
                                    </div>
                                    </div>


                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Settings Modal */}
            {showSettingsModal && (
                <div className="ta-modal-overlay" onClick={() => setShowSettingsModal(false)}>
                    <div className="ta-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="ta-modal-header">
                            <h3>Davomat sozlamalari</h3>
                            <button onClick={() => setShowSettingsModal(false)}>×</button>
                        </div>

                        <div className="ta-modal-content">
                            <div className="ta-form-group">
                                <label>Oyda nechta dars:</label>
                                <input
                                    type="number"
                                    value={attendanceSettings.lessonsPerMonth}
                                    onChange={(e) => setAttendanceSettings(prev => ({
                                        ...prev,
                                        lessonsPerMonth: parseInt(e.target.value)
                                    }))}
                                    min="1"
                                    max="31"
                                />
                            </div>

                            <div className="ta-form-group">
                                <label>Haftada nechta dars:</label>
                                <input
                                    type="number"
                                    value={attendanceSettings.lessonsPerWeek}
                                    onChange={(e) => setAttendanceSettings(prev => ({
                                        ...prev,
                                        lessonsPerWeek: parseInt(e.target.value)
                                    }))}
                                    min="1"
                                    max="7"
                                />
                            </div>

                            <div className="ta-form-group">
                                <label>Hafta kunlari:</label>
                                <select
                                    value={attendanceSettings.weekDays}
                                    onChange={(e) => setAttendanceSettings(prev => ({
                                        ...prev,
                                        weekDays: e.target.value
                                    }))}
                                >
                                    <option value="even">Juft kunlar (Dushanba, Chorshanba, Juma)</option>
                                    <option value="odd">Toq kunlar (Seshanba, Payshanba, Shanba)</option>
                                    <option value="all">Barcha ish kunlari</option>
                                </select>
                            </div>

                            <div className="ta-form-group">
                                <label>Davomat turi:</label>
                                <select
                                    value={attendanceSettings.attendanceType}
                                    onChange={(e) => setAttendanceSettings(prev => ({
                                        ...prev,
                                        attendanceType: e.target.value
                                    }))}
                                >
                                    <option value="offline">Offline (Sinfda qatnashish)</option>
                                    <option value="online">Online (Meeting'ga kirish)</option>
                                    <option value="hybrid">Aralash (Offline va Online)</option>
                                </select>
                            </div>

                            <div className="ta-form-group">
                                <label>Mavzu ko'rinishi:</label>
                                <select
                                    value={attendanceSettings.topicDisplay}
                                    onChange={(e) => setAttendanceSettings(prev => ({
                                        ...prev,
                                        topicDisplay: e.target.value
                                    }))}
                                >
                                    <option value="topic">Mavzu nomi</option>
                                    <option value="item">Mavzudagi elementlar (classwork)</option>
                                </select>
                            </div>
                        </div>

                        <div className="ta-modal-footer">
                            <button
                                className="ta-btn ta-btn-secondary"
                                onClick={() => setShowSettingsModal(false)}
                            >
                                Bekor qilish
                            </button>
                            <button
                                className="ta-btn ta-btn-primary"
                                onClick={() => {
                                    generateCalendar();
                                    setShowSettingsModal(false);
                                }}
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

// Attendance Button Component
const AttendanceButton = ({ status, onChange, attendanceType, disabled = false }) => {
    const [showMenu, setShowMenu] = useState(false);

    const handleClick = () => {
        if (disabled) return;
        setShowMenu(!showMenu);
    };

    const handleStatusChange = (newStatus) => {
        if (disabled) return;
        onChange(newStatus);
        setShowMenu(false);
    };

    const getButtonClass = () => {
        let baseClass = 'ta-attendance-btn';
        if (status) baseClass += ` ta-attendance-btn--${status}`;
        return baseClass;
    };

    const getStatusIcon = () => {
        switch (status) {
            case 'present': return <FiCheck />;
            case 'absent': return <FiX />;
            case 'excused': return <span>S</span>;
            default: return <div className="ta-empty-circle"></div>;
        }
    };

    const getStatusText = (statusType) => {
        switch (statusType) {
            case 'present':
                return attendanceType === 'online' ? 'Meeting\'ga kirgan' : 'Kelgan';
            case 'absent':
                return attendanceType === 'online' ? 'Meeting\'ga kirmagan' : 'Kelmagan';
            case 'excused':
                return 'Sababi bor';
            default:
                return 'Belgilanmagan';
        }
    };

    return (
        <div className={`ta-attendance-wrapper${disabled ? ' is-disabled' : ''}`}>
            <button className={getButtonClass()} onClick={handleClick} disabled={disabled} aria-disabled={disabled}>
                {getStatusIcon()}
            </button>

            {showMenu && !disabled && (
                <div className="ta-attendance-menu">
                    <button
                        className="ta-menu-item ta-menu-item--present"
                        onClick={() => handleStatusChange('present')}
                    >
                        <FiCheck />
                        {getStatusText('present')}
                    </button>
                    <button
                        className="ta-menu-item ta-menu-item--absent"
                        onClick={() => handleStatusChange('absent')}
                    >
                        <FiX />
                        {getStatusText('absent')}
                    </button>
                    <button
                        className="ta-menu-item ta-menu-item--excused"
                        onClick={() => handleStatusChange('excused')}
                    >
                        <span>S</span>
                        {getStatusText('excused')}
                    </button>
                </div>
            )}
        </div>
    );
};

export default TeacherAttendance;
