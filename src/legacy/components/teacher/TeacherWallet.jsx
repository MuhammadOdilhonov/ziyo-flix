"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import {
    FiDollarSign, FiPlus, FiMinus, FiCreditCard, FiTrendingUp,
    FiTrendingDown, FiCalendar, FiUser, FiBook, FiRefreshCw,
    FiEye, FiEyeOff, FiDownload, FiFilter, FiSearch, FiArrowUpRight,
    FiArrowDownLeft, FiShoppingCart, FiGift, FiArrowRight
} from "react-icons/fi"
import { teacherWalletAPI } from "../../api/apiTeacherWallet"
import useSelectedChannel from "../../hooks/useSelectedChannel"

const TeacherWallet = () => {
    const { channelSlug } = useParams()
    const { selectedChannel } = useSelectedChannel()
    
    // State management
    const [balance, setBalance] = useState(null)
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)
    const [transactionsLoading, setTransactionsLoading] = useState(false)
    const [showBalance, setShowBalance] = useState(true)
    const [showDepositModal, setShowDepositModal] = useState(false)
    
    // Deposit modal states
    const [depositAmount, setDepositAmount] = useState("")
    const [depositDescription, setDepositDescription] = useState("")
    const [depositLoading, setDepositLoading] = useState(false)
    
    // Filter states
    const [filterType, setFilterType] = useState("all") // all, income, expense
    const [searchTerm, setSearchTerm] = useState("")
    const [transactionLimit, setTransactionLimit] = useState(10)

    useEffect(() => {
        fetchWalletData()
    }, [])

    const fetchWalletData = async () => {
        try {
            setLoading(true)
            const [balanceData, transactionsData] = await Promise.all([
                teacherWalletAPI.getBalance(),
                teacherWalletAPI.getTransactions(transactionLimit)
            ])
            
            setBalance(balanceData)
            setTransactions(transactionsData.transactions || [])
            setLoading(false)
        } catch (error) {
            console.error("Error fetching wallet data:", error)
            setLoading(false)
        }
    }

    const handleDeposit = async () => {
        if (!depositAmount || parseFloat(depositAmount) <= 0) {
            alert("To'g'ri miqdor kiriting!")
            return
        }

        try {
            setDepositLoading(true)
            const response = await teacherWalletAPI.deposit(
                parseFloat(depositAmount),
                depositDescription || "Hamyonga pul qo'shish"
            )
            
            if (response.success) {
                // Update balance
                setBalance(prev => ({
                    ...prev,
                    balance: response.new_balance
                }))
                
                // Refresh transactions
                await fetchTransactions()
                
                // Close modal and reset form
                setShowDepositModal(false)
                setDepositAmount("")
                setDepositDescription("")
                
                alert(response.message)
            }
        } catch (error) {
            console.error("Error depositing money:", error)
            alert("Pul qo'shishda xatolik yuz berdi")
        } finally {
            setDepositLoading(false)
        }
    }

    const fetchTransactions = async () => {
        try {
            setTransactionsLoading(true)
            const data = await teacherWalletAPI.getTransactions(transactionLimit)
            setTransactions(data.transactions || [])
        } catch (error) {
            console.error("Error fetching transactions:", error)
        } finally {
            setTransactionsLoading(false)
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('uz-UZ', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const formatAmount = (amount) => {
        const num = parseFloat(amount)
        return num >= 0 ? `+${num.toFixed(2)}` : num.toFixed(2)
    }

    const getTransactionIcon = (type) => {
        switch (type) {
            case 'course_purchase':
            case 'course_sale':
                return <FiBook />
            case 'deposit':
                return <FiArrowDownLeft />
            case 'withdrawal':
                return <FiArrowUpRight />
            default:
                return <FiDollarSign />
        }
    }

    const getTransactionColor = (amount) => {
        return parseFloat(amount) >= 0 ? 'income' : 'expense'
    }

    const filteredTransactions = transactions.filter(transaction => {
        const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (transaction.course_title && transaction.course_title.toLowerCase().includes(searchTerm.toLowerCase()))
        
        if (filterType === "all") return matchesSearch
        if (filterType === "income") return matchesSearch && parseFloat(transaction.amount) >= 0
        if (filterType === "expense") return matchesSearch && parseFloat(transaction.amount) < 0
        
        return matchesSearch
    })

    if (loading) {
        return (
            <div className="tw-loading">
                <div className="tw-spinner"></div>
                <p>Hamyon ma'lumotlari yuklanmoqda...</p>
            </div>
        )
    }

    return (
        <div className="teacher-wallet">
            <div className="tw-header">
                <div className="tw-title-section">
                    <h1>Hamyon</h1>
                    <p>Moliyaviy hisobotlar va tranzaksiyalar</p>
                </div>
                <div className="tw-header-actions">
                    <button 
                        className="tw-refresh-btn"
                        onClick={fetchWalletData}
                        disabled={loading}
                    >
                        <FiRefreshCw />
                        Yangilash
                    </button>
                </div>
            </div>

            {/* Balance Card */}
            <div className="tw-balance-section">
                <div className="tw-balance-card">
                    <div className="tw-balance-header">
                        <div className="tw-balance-info">
                            <h3>Joriy balans</h3>
                            <div className="tw-balance-amount">
                                {showBalance ? (
                                    <>
                                        <span className="tw-amount">{balance?.balance || '0.00'}</span>
                                        <span className="tw-currency">{balance?.currency || 'FixCoin'}</span>
                                    </>
                                ) : (
                                    <span className="tw-hidden">••••••</span>
                                )}
                            </div>
                        </div>
                        <div className="tw-balance-actions">
                            <button 
                                className="tw-toggle-visibility"
                                onClick={() => setShowBalance(!showBalance)}
                            >
                                {showBalance ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>
                    </div>
                    
                    <div className="tw-balance-footer">
                        <button 
                            className="tw-deposit-btn"
                            onClick={() => setShowDepositModal(true)}
                        >
                            <FiPlus />
                            Pul qo'shish
                        </button>
                        <div className="tw-balance-stats">
                            <div className="tw-stat">
                                <FiTrendingUp />
                                <span>Bu oy: +{(Math.random() * 1000).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="tw-stats-grid">
                <div className="tw-stat-card income">
                    <div className="tw-stat-icon">
                        <FiTrendingUp />
                    </div>
                    <div className="tw-stat-content">
                        <h4>Jami kirim</h4>
                        <p>{filteredTransactions
                            .filter(t => parseFloat(t.amount) > 0)
                            .reduce((sum, t) => sum + parseFloat(t.amount), 0)
                            .toFixed(2)} {balance?.currency}
                        </p>
                    </div>
                </div>

                <div className="tw-stat-card expense">
                    <div className="tw-stat-icon">
                        <FiTrendingDown />
                    </div>
                    <div className="tw-stat-content">
                        <h4>Jami chiqim</h4>
                        <p>{Math.abs(filteredTransactions
                            .filter(t => parseFloat(t.amount) < 0)
                            .reduce((sum, t) => sum + parseFloat(t.amount), 0))
                            .toFixed(2)} {balance?.currency}
                        </p>
                    </div>
                </div>

                <div className="tw-stat-card transactions">
                    <div className="tw-stat-icon">
                        <FiCreditCard />
                    </div>
                    <div className="tw-stat-content">
                        <h4>Tranzaksiyalar</h4>
                        <p>{transactions.length} ta</p>
                    </div>
                </div>
            </div>

            {/* Transactions Section */}
            <div className="tw-transactions-section">
                <div className="tw-transactions-header">
                    <h2>Tranzaksiyalar tarixi</h2>
                    <div className="tw-transactions-controls">
                        <div className="tw-search-box">
                            <FiSearch />
                            <input
                                type="text"
                                placeholder="Qidiruv..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select 
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="tw-filter-select"
                        >
                            <option value="all">Barchasi</option>
                            <option value="income">Kirimlar</option>
                            <option value="expense">Chiqimlar</option>
                        </select>
                    </div>
                </div>

                <div className="tw-transactions-list">
                    {transactionsLoading ? (
                        <div className="tw-transactions-loading">
                            <div className="tw-spinner"></div>
                            <p>Tranzaksiyalar yuklanmoqda...</p>
                        </div>
                    ) : filteredTransactions.length === 0 ? (
                        <div className="tw-empty-state">
                            <FiCreditCard className="tw-empty-icon" />
                            <h3>Tranzaksiyalar topilmadi</h3>
                            <p>Hozircha tranzaksiyalar yo'q yoki qidiruv natijasida hech narsa topilmadi</p>
                        </div>
                    ) : (
                        filteredTransactions.map((transaction) => (
                            <div key={transaction.id} className={`tw-transaction-card ${getTransactionColor(transaction.amount)}`}>
                                <div className="tw-transaction-icon">
                                    {getTransactionIcon(transaction.transaction_type)}
                                </div>
                                
                                <div className="tw-transaction-content">
                                    <div className="tw-transaction-main">
                                        <h4>{transaction.transaction_type_display}</h4>
                                        <p className="tw-transaction-description">{transaction.description}</p>
                                        {transaction.course_title && (
                                            <p className="tw-course-title">
                                                <FiBook /> {transaction.course_title}
                                            </p>
                                        )}
                                    </div>
                                    
                                    <div className="tw-transaction-meta">
                                        <div className="tw-transaction-users">
                                            {transaction.from_username && (
                                                <span className="tw-from-user">
                                                    <FiUser /> {transaction.from_username}
                                                </span>
                                            )}
                                            {transaction.from_username && transaction.to_username && (
                                                <FiArrowRight className="tw-arrow" />
                                            )}
                                            {transaction.to_username && (
                                                <span className="tw-to-user">
                                                    <FiUser /> {transaction.to_username}
                                                </span>
                                            )}
                                        </div>
                                        <div className="tw-transaction-date">
                                            <FiCalendar />
                                            {formatDate(transaction.created_at)}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="tw-transaction-amount">
                                    <span className={`tw-amount ${getTransactionColor(transaction.amount)}`}>
                                        {formatAmount(transaction.amount)} {balance?.currency}
                                    </span>
                                    <span className="tw-balance-after">
                                        Balans: {transaction.balance_after} {balance?.currency}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {transactions.length > 0 && (
                    <div className="tw-load-more">
                        <button 
                            className="tw-load-more-btn"
                            onClick={() => {
                                setTransactionLimit(prev => prev + 10)
                                fetchTransactions()
                            }}
                            disabled={transactionsLoading}
                        >
                            <FiDownload />
                            Ko'proq yuklash
                        </button>
                    </div>
                )}
            </div>

            {/* Deposit Modal */}
            {showDepositModal && (
                <div className="tw-modal-overlay" onClick={() => setShowDepositModal(false)}>
                    <div className="tw-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="tw-modal-header">
                            <h3>Hamyonga pul qo'shish</h3>
                            <button 
                                className="tw-modal-close"
                                onClick={() => setShowDepositModal(false)}
                            >
                                ×
                            </button>
                        </div>

                        <div className="tw-modal-content">
                            <div className="tw-form-group">
                                <label>Miqdor ({balance?.currency})</label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={depositAmount}
                                    onChange={(e) => setDepositAmount(e.target.value)}
                                    placeholder="Miqdorni kiriting"
                                />
                            </div>

                            <div className="tw-form-group">
                                <label>Izoh (ixtiyoriy)</label>
                                <textarea
                                    value={depositDescription}
                                    onChange={(e) => setDepositDescription(e.target.value)}
                                    placeholder="Tranzaksiya haqida izoh..."
                                    rows="3"
                                />
                            </div>

                            <div className="tw-quick-amounts">
                                <p>Tez miqdorlar:</p>
                                <div className="tw-amount-buttons">
                                    {[50, 100, 250, 500, 1000].map(amount => (
                                        <button
                                            key={amount}
                                            className="tw-amount-btn"
                                            onClick={() => setDepositAmount(amount.toString())}
                                        >
                                            {amount}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="tw-modal-actions">
                            <button 
                                className="tw-cancel-btn"
                                onClick={() => setShowDepositModal(false)}
                            >
                                Bekor qilish
                            </button>
                            <button 
                                className="tw-deposit-submit-btn"
                                onClick={handleDeposit}
                                disabled={depositLoading || !depositAmount}
                            >
                                {depositLoading ? (
                                    <>
                                        <div className="tw-spinner-small"></div>
                                        Qo'shilmoqda...
                                    </>
                                ) : (
                                    <>
                                        <FiPlus />
                                        Pul qo'shish
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TeacherWallet
