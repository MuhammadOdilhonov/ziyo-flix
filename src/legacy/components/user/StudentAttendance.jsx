import React, { useState, useEffect } from 'react';
import { FiCalendar, FiCheck, FiX, FiClock } from 'react-icons/fi';
import { getClassroomAttendance } from '../../api/apiClassroom';

const StudentAttendance = ({ classroom }) => {
    const [attendanceData, setAttendanceData] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [calendar, setCalendar] = useState([]);
    const [stats, setStats] = useState({});

    // Mock current user ID (in real app, get from auth context)
    const currentUserId = 1;

    useEffect(() => {
        if (classroom) {
            fetchAttendanceData();
        }
    }, [classroom, selectedMonth, selectedYear]);

    const fetchAttendanceData = async () => {
        try {
            setLoading(true);
            const data = await getClassroomAttendance(classroom.id, selectedMonth + 1, selectedYear);
            setAttendanceData(data.attendance || {});
            generateCalendar();
            calculateStats(data.attendance || {});
        } catch (error) {
            console.error('Error fetching attendance:', error);
        } finally {
            setLoading(false);
        }
    };

    const generateCalendar = () => {
        // Mock calendar generation - same logic as teacher component
        const year = selectedYear;
        const month = selectedMonth;
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        // Mock lesson days (every Tuesday and Thursday)
        const lessonDays = [];
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dayOfWeek = date.getDay();
            if (dayOfWeek === 2 || dayOfWeek === 4) { // Tuesday and Thursday
                lessonDays.push({
                    day,
                    date,
                    topic: mockTopics[lessonDays.length % mockTopics.length] || { id: 1, name: `Mavzu ${lessonDays.length + 1}` },
                    isLessonDay: true
                });
            }
        }
        
        setCalendar(lessonDays);
    };

    const calculateStats = (attendance) => {
        const totalLessons = calendar.length;
        let present = 0, absent = 0, excused = 0;
        
        calendar.forEach(({ day }) => {
            const status = attendance[`${currentUserId}-${day}`];
            if (status === 'present') present++;
            else if (status === 'absent') absent++;
            else if (status === 'excused') excused++;
        });
        
        const percentage = totalLessons > 0 ? Math.round((present / totalLessons) * 100) : 0;
        setStats({ present, absent, excused, percentage, total: totalLessons });
    };

    const getAttendanceStatus = (day) => {
        const key = `${currentUserId}-${day}`;
        return attendanceData[key] || null;
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'present': return <FiCheck className="sa-status-present" />;
            case 'absent': return <FiX className="sa-status-absent" />;
            case 'excused': return <span className="sa-status-excused">S</span>;
            default: return <div className="sa-status-unknown">?</div>;
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'present': return 'Qatnashgan';
            case 'absent': return 'Qatnashmagan';
            case 'excused': return 'Sababi bor';
            default: return 'Belgilanmagan';
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'present': return 'sa-day-present';
            case 'absent': return 'sa-day-absent';
            case 'excused': return 'sa-day-excused';
            default: return 'sa-day-unknown';
        }
    };

    // Mock topics
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
            <div className="sa-loading">
                <div className="sa-spinner"></div>
                <p>Davomat ma'lumotlari yuklanmoqda...</p>
            </div>
        );
    }

    return (
        <div className="student-attendance">
            <div className="sa-header">
                <div className="sa-header-info">
                    <h2>
                        <FiCalendar />
                        Mening davomatim - {classroom?.name}
                    </h2>
                    <p>{monthNames[selectedMonth]} {selectedYear}</p>
                </div>
                
                <div className="sa-month-selector">
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
            </div>

            <div className="sa-stats">
                <div className="sa-stat-card sa-stat-card--total">
                    <div className="sa-stat-icon">
                        <FiCalendar />
                    </div>
                    <div className="sa-stat-info">
                        <h3>{stats.total || 0}</h3>
                        <p>Jami darslar</p>
                    </div>
                </div>
                
                <div className="sa-stat-card sa-stat-card--present">
                    <div className="sa-stat-icon">
                        <FiCheck />
                    </div>
                    <div className="sa-stat-info">
                        <h3>{stats.present || 0}</h3>
                        <p>Qatnashgan</p>
                    </div>
                </div>
                
                <div className="sa-stat-card sa-stat-card--absent">
                    <div className="sa-stat-icon">
                        <FiX />
                    </div>
                    <div className="sa-stat-info">
                        <h3>{stats.absent || 0}</h3>
                        <p>Qatnashmagan</p>
                    </div>
                </div>
                
                <div className="sa-stat-card sa-stat-card--excused">
                    <div className="sa-stat-icon">
                        <FiClock />
                    </div>
                    <div className="sa-stat-info">
                        <h3>{stats.excused || 0}</h3>
                        <p>Sababi bor</p>
                    </div>
                </div>
                
                <div className="sa-stat-card sa-stat-card--percentage">
                    <div className="sa-stat-icon">
                        <span className="sa-percentage-icon">{stats.percentage || 0}%</span>
                    </div>
                    <div className="sa-stat-info">
                        <h3>Davomat</h3>
                        <p>Foizi</p>
                    </div>
                </div>
            </div>

            <div className="sa-calendar">
                <h3>Darslar kalendari</h3>
                <div className="sa-calendar-grid">
                    {calendar.map(({ day, topic }) => {
                        const status = getAttendanceStatus(day);
                        return (
                            <div key={day} className={`sa-calendar-day ${getStatusClass(status)}`}>
                                <div className="sa-day-header">
                                    <span className="sa-day-number">{day}</span>
                                    <div className="sa-day-status">
                                        {getStatusIcon(status)}
                                    </div>
                                </div>
                                <div className="sa-day-content">
                                    <h4>{topic.name}</h4>
                                    <p className="sa-day-status-text">
                                        {getStatusText(status)}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
                
                {calendar.length === 0 && (
                    <div className="sa-empty">
                        <FiCalendar size={48} />
                        <h4>Bu oyda darslar yo'q</h4>
                        <p>Tanlangan oyda hech qanday dars rejalashtirilmagan</p>
                    </div>
                )}
            </div>

            <div className="sa-legend">
                <h4>Belgilar:</h4>
                <div className="sa-legend-items">
                    <div className="sa-legend-item">
                        <FiCheck className="sa-status-present" />
                        <span>Qatnashgan</span>
                    </div>
                    <div className="sa-legend-item">
                        <FiX className="sa-status-absent" />
                        <span>Qatnashmagan</span>
                    </div>
                    <div className="sa-legend-item">
                        <span className="sa-status-excused">S</span>
                        <span>Sababi bor</span>
                    </div>
                    <div className="sa-legend-item">
                        <div className="sa-status-unknown">?</div>
                        <span>Belgilanmagan</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentAttendance;
