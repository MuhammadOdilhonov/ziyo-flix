import React, { useState, useEffect } from 'react';
import { getReportsOverview } from '../../api/apiDirectorProfile';
import { 
    FiUsers, 
    FiBook, 
    FiVideo, 
    FiTv, 
    FiDollarSign, 
    FiTrendingUp, 
    FiTrendingDown,
    FiActivity,
    FiPieChart
} from 'react-icons/fi';

const DirectorReports = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const response = await getReportsOverview();
            setData(response);
        } catch (error) {
            console.error('Error loading reports:', error);
        } finally {
            setLoading(false);
        }
    };

    const getRoleLabel = (role) => {
        const labels = {
            user: 'Foydalanuvchilar',
            teacher: 'O\'qituvchilar',
            admin: 'Administratorlar',
            director: 'Direktorlar'
        };
        return labels[role] || role;
    };

    const getRoleColor = (role) => {
        const colors = {
            user: '#8b5cf6',
            teacher: '#10b981',
            admin: '#ef4444',
            director: '#3b82f6'
        };
        return colors[role] || '#6b7280';
    };

    const getTransactionTypeLabel = (type) => {
        const labels = {
            commission: 'Komissiya',
            course_earning: 'Kurs daromadi',
            course_purchase: 'Kurs sotib olish',
            course_type_earning: 'Oy daromadi',
            course_type_purchase: 'Oy sotib olish',
            deposit: 'Depozit'
        };
        return labels[type] || type;
    };

    if (loading) {
        return (
            <div className="director-reports">
                <div className="dr__loading">
                    <div className="spinner"></div>
                    <p>Yuklanmoqda...</p>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="director-reports">
                <div className="dr__empty">
                    <FiPieChart />
                    <p>Ma'lumotlar topilmadi</p>
                </div>
            </div>
        );
    }

    return (
        <div className="director-reports">
            <div className="dr__header">
                <h1>Hisobotlar</h1>
                <p>Platform statistikasi va moliyaviy hisobotlar</p>
            </div>

            {/* Users by Role */}
            <div className="dr__section">
                <div className="dr__section-header">
                    <FiUsers />
                    <h2>Foydalanuvchilar (Role bo'yicha)</h2>
                </div>
                <div className="dr__users-grid">
                    {data.users_by_role.map((user) => (
                        <div 
                            key={user.role} 
                            className="dr__user-card"
                            style={{ '--role-color': getRoleColor(user.role) }}
                        >
                            <div className="dr__user-icon">
                                <FiUsers />
                            </div>
                            <div className="dr__user-info">
                                <h3>{user.count}</h3>
                                <p>{getRoleLabel(user.role)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Content Statistics */}
            <div className="dr__section">
                <div className="dr__section-header">
                    <FiActivity />
                    <h2>Kontent Statistikasi</h2>
                </div>
                <div className="dr__content-grid">
                    <div className="dr__content-card dr__content-card--courses">
                        <div className="dr__content-icon">
                            <FiBook />
                        </div>
                        <div className="dr__content-info">
                            <h3>Kurslar</h3>
                            <div className="dr__content-stats">
                                <div className="dr__stat">
                                    <span className="dr__stat-label">Jami:</span>
                                    <span className="dr__stat-value">{data.courses.total}</span>
                                </div>
                                <div className="dr__stat">
                                    <span className="dr__stat-label">Faol:</span>
                                    <span className="dr__stat-value dr__stat-value--success">{data.courses.active}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="dr__content-card dr__content-card--videos">
                        <div className="dr__content-icon">
                            <FiVideo />
                        </div>
                        <div className="dr__content-info">
                            <h3>Videolar</h3>
                            <div className="dr__content-stats">
                                <div className="dr__stat">
                                    <span className="dr__stat-label">Jami:</span>
                                    <span className="dr__stat-value">{data.videos.total}</span>
                                </div>
                                <div className="dr__stat">
                                    <span className="dr__stat-label">Faol:</span>
                                    <span className="dr__stat-value dr__stat-value--success">{data.videos.active}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="dr__content-card dr__content-card--channels">
                        <div className="dr__content-icon">
                            <FiTv />
                        </div>
                        <div className="dr__content-info">
                            <h3>Kanallar</h3>
                            <div className="dr__content-stats">
                                <div className="dr__stat">
                                    <span className="dr__stat-label">Jami:</span>
                                    <span className="dr__stat-value">{data.channels.total}</span>
                                </div>
                                <div className="dr__stat">
                                    <span className="dr__stat-label">Tasdiqlangan:</span>
                                    <span className="dr__stat-value dr__stat-value--success">{data.channels.verified}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Financial Overview */}
            <div className="dr__section">
                <div className="dr__section-header">
                    <FiDollarSign />
                    <h2>Moliyaviy Ko'rsatkichlar</h2>
                </div>
                <div className="dr__financial-grid">
                    <div className="dr__financial-card dr__financial-card--income">
                        <div className="dr__financial-icon">
                            <FiTrendingUp />
                        </div>
                        <div className="dr__financial-info">
                            <p className="dr__financial-label">Jami Daromad</p>
                            <h3 className="dr__financial-value">{parseFloat(data.wallet.total_income).toLocaleString('uz-UZ')} FC</h3>
                        </div>
                    </div>

                    <div className="dr__financial-card dr__financial-card--expense">
                        <div className="dr__financial-icon">
                            <FiTrendingDown />
                        </div>
                        <div className="dr__financial-info">
                            <p className="dr__financial-label">Jami Xarajat</p>
                            <h3 className="dr__financial-value">{parseFloat(data.wallet.total_expense).toLocaleString('uz-UZ')} FC</h3>
                        </div>
                    </div>

                    <div className="dr__financial-card dr__financial-card--transactions">
                        <div className="dr__financial-icon">
                            <FiActivity />
                        </div>
                        <div className="dr__financial-info">
                            <p className="dr__financial-label">Tranzaksiyalar</p>
                            <h3 className="dr__financial-value">{data.wallet.transactions_count}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Transaction Types */}
            <div className="dr__section">
                <div className="dr__section-header">
                    <FiPieChart />
                    <h2>Tranzaksiya Turlari</h2>
                </div>
                <div className="dr__transactions-grid">
                    {data.wallet.by_type.map((transaction) => (
                        <div key={transaction.transaction_type} className="dr__transaction-card">
                            <div className="dr__transaction-bar">
                                <div 
                                    className="dr__transaction-fill"
                                    style={{ 
                                        width: `${(transaction.count / data.wallet.transactions_count) * 100}%` 
                                    }}
                                ></div>
                            </div>
                            <div className="dr__transaction-info">
                                <p className="dr__transaction-label">{getTransactionTypeLabel(transaction.transaction_type)}</p>
                                <div className="dr__transaction-stats">
                                    <span className="dr__transaction-count">{transaction.count}</span>
                                    <span className="dr__transaction-percent">
                                        {((transaction.count / data.wallet.transactions_count) * 100).toFixed(1)}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Last Transaction */}
            {data.wallet.last_transaction && (
                <div className="dr__section">
                    <div className="dr__section-header">
                        <FiActivity />
                        <h2>Oxirgi Tranzaksiya</h2>
                    </div>
                    <div className="dr__last-transaction">
                        <div className="dr__last-transaction-icon">
                            <FiDollarSign />
                        </div>
                        <div className="dr__last-transaction-info">
                            <div className="dr__last-transaction-row">
                                <span className="dr__last-transaction-label">Turi:</span>
                                <span className="dr__last-transaction-value">
                                    {getTransactionTypeLabel(data.wallet.last_transaction.transaction_type)}
                                </span>
                            </div>
                            <div className="dr__last-transaction-row">
                                <span className="dr__last-transaction-label">Summa:</span>
                                <span className="dr__last-transaction-value dr__last-transaction-value--amount">
                                    {data.wallet.last_transaction.amount.toLocaleString('uz-UZ')} FC
                                </span>
                            </div>
                            <div className="dr__last-transaction-row">
                                <span className="dr__last-transaction-label">Sana:</span>
                                <span className="dr__last-transaction-value">
                                    {new Date(data.wallet.last_transaction.created_at).toLocaleString('uz-UZ')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DirectorReports;
