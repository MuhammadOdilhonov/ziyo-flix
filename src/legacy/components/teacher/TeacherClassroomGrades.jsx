import React, { useState, useEffect } from 'react';
import { FiDownload, FiTrendingUp, FiAward } from 'react-icons/fi';
import { getGradebook } from '../../api/apiClassroom';

const TeacherClassroomGrades = ({ classroom }) => {
    const [gradebook, setGradebook] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (classroom) {
            fetchGradebook();
        }
    }, [classroom]);

    const fetchGradebook = async () => {
        try {
            setLoading(true);
            const data = await getGradebook(classroom.id);
            setGradebook(data);
        } catch (error) {
            console.error('Error fetching gradebook:', error);
        } finally {
            setLoading(false);
        }
    };

    const getGradeColor = (percentage) => {
        if (percentage >= 90) return 'excellent';
        if (percentage >= 70) return 'good';
        if (percentage >= 50) return 'average';
        return 'poor';
    };

    if (loading) {
        return (
            <div className="tcg-loading">
                <div className="spinner"></div>
                <p>Yuklanmoqda...</p>
            </div>
        );
    }

    if (!gradebook) {
        return (
            <div className="tcg-error">
                <p>Ma'lumotlar yuklanmadi</p>
            </div>
        );
    }

    const classAverage = gradebook.grades.reduce((sum, g) => sum + g.average, 0) / gradebook.grades.length;

    return (
        <div className="teacher-classroom-grades">
            <div className="tcg-header">
                <div className="tcg-header-info">
                    <h2>Baholar jurnali</h2>
                    <p>{gradebook.students.length} ta o'quvchi</p>
                </div>
                <button className="tcg-export-btn" title="Baholarni eksport qilish">
                    <FiDownload /> Eksport
                </button>
            </div>

            <div className="tcg-stats">
                <div className="tcg-stat-card">
                    <div className="tcg-stat-icon">
                        <FiTrendingUp />
                    </div>
                    <div className="tcg-stat-info">
                        <h4>Sinf o'rtachasi</h4>
                        <p className="tcg-stat-value">{classAverage.toFixed(1)}%</p>
                    </div>
                </div>

                <div className="tcg-stat-card">
                    <div className="tcg-stat-icon">
                        <FiAward />
                    </div>
                    <div className="tcg-stat-info">
                        <h4>Eng yuqori ball</h4>
                        <p className="tcg-stat-value">
                            {Math.max(...gradebook.grades.map(g => g.average)).toFixed(1)}%
                        </p>
                    </div>
                </div>

                <div className="tcg-stat-card">
                    <div className="tcg-stat-icon">
                        <FiAward />
                    </div>
                    <div className="tcg-stat-info">
                        <h4>Topshiriqlar</h4>
                        <p className="tcg-stat-value">{gradebook.assignments.length}</p>
                    </div>
                </div>
            </div>

            <div className="tcg-table-wrapper">
                <table className="tcg-table">
                    <thead>
                        <tr>
                            <th className="tcg-th-student">O'quvchi</th>
                            {gradebook.assignments.map(assignment => (
                                <th key={assignment.id} className="tcg-th-assignment">
                                    <div className="tcg-assignment-header">
                                        <span>{assignment.title}</span>
                                        <span className="tcg-max-points">/{assignment.max_points}</span>
                                    </div>
                                </th>
                            ))}
                            <th className="tcg-th-total">Jami</th>
                            <th className="tcg-th-average">O'rtacha</th>
                        </tr>
                    </thead>
                    <tbody>
                        {gradebook.grades.map((studentGrade) => {
                            const student = gradebook.students.find(s => s.id === studentGrade.student_id);
                            
                            return (
                                <tr key={studentGrade.student_id}>
                                    <td className="tcg-td-student">
                                        <div className="tcg-student-cell">
                                            <div className="tcg-student-avatar">
                                                {student.avatar ? (
                                                    <img src={student.avatar} alt={student.full_name} />
                                                ) : (
                                                    <span>{student.full_name.charAt(0)}</span>
                                                )}
                                            </div>
                                            <div className="tcg-student-info">
                                                <span className="tcg-student-name">{student.full_name}</span>
                                                <span className="tcg-student-username">@{student.username}</span>
                                            </div>
                                        </div>
                                    </td>
                                    
                                    {gradebook.assignments.map(assignment => {
                                        const grade = studentGrade.grades.find(g => g.assignment_id === assignment.id);
                                        const percentage = grade ? (grade.grade / grade.max_grade) * 100 : 0;
                                        
                                        return (
                                            <td key={assignment.id} className="tcg-td-grade">
                                                {grade ? (
                                                    <span className={`tcg-grade ${getGradeColor(percentage)}`}>
                                                        {grade.grade}
                                                    </span>
                                                ) : (
                                                    <span className="tcg-grade-empty">-</span>
                                                )}
                                            </td>
                                        );
                                    })}
                                    
                                    <td className="tcg-td-total">
                                        <span className="tcg-total">
                                            {studentGrade.total_points}/{studentGrade.max_total_points}
                                        </span>
                                    </td>
                                    
                                    <td className="tcg-td-average">
                                        <span className={`tcg-average ${getGradeColor(studentGrade.average)}`}>
                                            {studentGrade.average.toFixed(1)}%
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="tcg-legend">
                <h4>Ball ranglari:</h4>
                <div className="tcg-legend-items">
                    <div className="tcg-legend-item">
                        <span className="tcg-legend-color excellent"></span>
                        <span>A'lo (90-100%)</span>
                    </div>
                    <div className="tcg-legend-item">
                        <span className="tcg-legend-color good"></span>
                        <span>Yaxshi (70-89%)</span>
                    </div>
                    <div className="tcg-legend-item">
                        <span className="tcg-legend-color average"></span>
                        <span>O'rtacha (50-69%)</span>
                    </div>
                    <div className="tcg-legend-item">
                        <span className="tcg-legend-color poor"></span>
                        <span>Qoniqarsiz (0-49%)</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherClassroomGrades;
