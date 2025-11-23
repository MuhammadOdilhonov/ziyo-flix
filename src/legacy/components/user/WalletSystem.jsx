"use client"

import { useState, useEffect } from "react"
import { FiDollarSign, FiPlus, FiMinus, FiCreditCard, FiTrendingUp, FiTrendingDown, FiDownload } from "react-icons/fi"

const WalletSystem = () => {
    const [walletData, setWalletData] = useState({
        balance: 0,
        totalSpent: 0,
        totalEarned: 0,
    })
    const [transactions, setTransactions] = useState([])
    const [showAddFunds, setShowAddFunds] = useState(false)
    const [addAmount, setAddAmount] = useState("")
    const [filter, setFilter] = useState("all")

    useEffect(() => {
        fetchWalletData()
        fetchTransactions()
    }, [])

    const fetchWalletData = async () => {
        // Mock data - replace with actual API call
        setWalletData({
            balance: 250,
            totalSpent: 750,
            totalEarned: 1000,
        })
    }

    const fetchTransactions = async () => {
        // Mock data - replace with actual API call
        const mockTransactions = [
            {
                id: 1,
                type: "purchase",
                amount: -50,
                description: "JavaScript Asoslari kursi sotib olindi",
                date: "2024-03-15 14:30",
                status: "completed",
                course: "JavaScript Asoslari",
                teacher: "Malika Tosheva",
            },
            {
                id: 2,
                type: "deposit",
                amount: 100,
                description: "Hisobni to'ldirish - Payme orqali",
                date: "2024-03-14 10:15",
                status: "completed",
                paymentMethod: "Payme",
            },
            {
                id: 3,
                type: "purchase",
                amount: -75,
                description: "React Hooks Tutorial sotib olindi",
                date: "2024-03-12 16:45",
                status: "completed",
                course: "React Hooks Tutorial",
                teacher: "Ahmadjon Karimov",
            },
            {
                id: 4,
                type: "refund",
                amount: 25,
                description: "Kurs qaytarildi - Python Asoslari",
                date: "2024-03-10 09:20",
                status: "completed",
                course: "Python Asoslari",
            },
        ]
        setTransactions(mockTransactions)
    }

    const handleAddFunds = async () => {
        const amount = Number.parseFloat(addAmount)
        if (!amount || amount <= 0) {
            alert("To'g'ri miqdor kiriting")
            return
        }

        // Mock payment process
        const newTransaction = {
            id: Date.now(),
            type: "deposit",
            amount: amount,
            description: `Hisobni to'ldirish - ${amount} FixCoin`,
            date: new Date().toISOString(),
            status: "completed",
            paymentMethod: "Payme",
        }

        setTransactions([newTransaction, ...transactions])
        setWalletData({
            ...walletData,
            balance: walletData.balance + amount,
            totalEarned: walletData.totalEarned + amount,
        })
        setShowAddFunds(false)
        setAddAmount("")
    }

    const filteredTransactions = transactions.filter((transaction) => {
        if (filter === "all") return true
        return transaction.type === filter
    })

    const getTransactionIcon = (type) => {
        switch (type) {
            case "purchase":
                return <FiMinus className="transaction-icon purchase" />
            case "deposit":
                return <FiPlus className="transaction-icon deposit" />
            case "refund":
                return <FiPlus className="transaction-icon refund" />
            default:
                return <FiDollarSign className="transaction-icon" />
        }
    }

    const getTransactionTypeText = (type) => {
        switch (type) {
            case "purchase":
                return "Xarid"
            case "deposit":
                return "To'ldirish"
            case "refund":
                return "Qaytarish"
            default:
                return "Tranzaksiya"
        }
    }

    const formatAmount = (amount) => {
        return amount > 0 ? `+${amount}` : amount.toString()
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return (
            date.toLocaleDateString("uz-UZ") +
            " " +
            date.toLocaleTimeString("uz-UZ", {
                hour: "2-digit",
                minute: "2-digit",
            })
        )
    }

    return (
        <div className="wallet-system">
            <div className="wallet-header">
                <h1>Hamyon</h1>
                <p>FixCoin hisobingizni boshqaring (1 FixCoin = 1$)</p>
            </div>

            <div className="wallet-cards">
                <div className="wallet-card balance-card">
                    <div className="card-icon">
                        <FiDollarSign />
                    </div>
                    <div className="card-content">
                        <h3>{walletData.balance} FixCoin</h3>
                        <p>Joriy balans</p>
                    </div>
                    <button className="add-funds-btn" onClick={() => setShowAddFunds(true)}>
                        <FiPlus /> To'ldirish
                    </button>
                </div>

                <div className="wallet-card spent-card">
                    <div className="card-icon">
                        <FiTrendingDown />
                    </div>
                    <div className="card-content">
                        <h3>{walletData.totalSpent} FixCoin</h3>
                        <p>Jami sarflangan</p>
                    </div>
                </div>

                <div className="wallet-card earned-card">
                    <div className="card-icon">
                        <FiTrendingUp />
                    </div>
                    <div className="card-content">
                        <h3>{walletData.totalEarned} FixCoin</h3>
                        <p>Jami kirim</p>
                    </div>
                </div>
            </div>

            <div className="transactions-section">
                <div className="transactions-header">
                    <h2>Tranzaksiyalar tarixi</h2>
                    <button className="btn btn-secondary">
                        <FiDownload /> Eksport
                    </button>
                </div>

                <div className="transactions-filters">
                    <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>
                        Barchasi ({transactions.length})
                    </button>
                    <button className={filter === "purchase" ? "active" : ""} onClick={() => setFilter("purchase")}>
                        Xaridlar ({transactions.filter((t) => t.type === "purchase").length})
                    </button>
                    <button className={filter === "deposit" ? "active" : ""} onClick={() => setFilter("deposit")}>
                        To'ldirishlar ({transactions.filter((t) => t.type === "deposit").length})
                    </button>
                    <button className={filter === "refund" ? "active" : ""} onClick={() => setFilter("refund")}>
                        Qaytarishlar ({transactions.filter((t) => t.type === "refund").length})
                    </button>
                </div>

                <div className="transactions-list">
                    {filteredTransactions.map((transaction) => (
                        <div key={transaction.id} className="transaction-item">
                            <div className="transaction-main">
                                <div className="transaction-info">
                                    {getTransactionIcon(transaction.type)}
                                    <div className="transaction-details">
                                        <h4>{transaction.description}</h4>
                                        <div className="transaction-meta">
                                            <span className="transaction-type">{getTransactionTypeText(transaction.type)}</span>
                                            <span className="transaction-date">{formatDate(transaction.date)}</span>
                                            {transaction.paymentMethod && <span className="payment-method">{transaction.paymentMethod}</span>}
                                        </div>
                                        {transaction.course && (
                                            <div className="course-info">
                                                <span>Kurs: {transaction.course}</span>
                                                {transaction.teacher && <span>O'qituvchi: {transaction.teacher}</span>}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="transaction-amount">
                                    <span className={`amount ${transaction.amount > 0 ? "positive" : "negative"}`}>
                                        {formatAmount(transaction.amount)} FC
                                    </span>
                                    <span className="status completed">Tugallangan</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredTransactions.length === 0 && (
                    <div className="empty-state">
                        <h3>Tranzaksiyalar topilmadi</h3>
                        <p>Hozircha {filter === "all" ? "" : getTransactionTypeText(filter).toLowerCase()} tranzaksiyalar yo'q</p>
                    </div>
                )}
            </div>

            {/* Add Funds Modal */}
            {showAddFunds && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h2>Hisobni to'ldirish</h2>
                            <button onClick={() => setShowAddFunds(false)}>×</button>
                        </div>

                        <div className="modal-content">
                            <div className="current-balance">
                                <p>
                                    Joriy balans: <strong>{walletData.balance} FixCoin</strong>
                                </p>
                            </div>

                            <div className="form-group">
                                <label>To'ldirish miqdori (FixCoin) *</label>
                                <input
                                    type="number"
                                    value={addAmount}
                                    onChange={(e) => setAddAmount(e.target.value)}
                                    placeholder="100"
                                    min="1"
                                    step="1"
                                />
                                <small>Minimal to'ldirish: 10 FixCoin</small>
                            </div>

                            <div className="payment-methods">
                                <h3>To'lov usuli</h3>
                                <div className="payment-options">
                                    <label className="payment-option">
                                        <input type="radio" name="payment" value="payme" defaultChecked />
                                        <div className="option-content">
                                            <FiCreditCard />
                                            <span>Payme</span>
                                        </div>
                                    </label>
                                    <label className="payment-option">
                                        <input type="radio" name="payment" value="click" />
                                        <div className="option-content">
                                            <FiCreditCard />
                                            <span>Click</span>
                                        </div>
                                    </label>
                                    <label className="payment-option">
                                        <input type="radio" name="payment" value="uzcard" />
                                        <div className="option-content">
                                            <FiCreditCard />
                                            <span>UzCard</span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {addAmount && (
                                <div className="payment-summary">
                                    <div className="summary-row">
                                        <span>Miqdor:</span>
                                        <span>{addAmount} FixCoin</span>
                                    </div>
                                    <div className="summary-row">
                                        <span>Kurs:</span>
                                        <span>1 FixCoin = 1$</span>
                                    </div>
                                    <div className="summary-row total">
                                        <span>Jami to'lov:</span>
                                        <span>${addAmount}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="modal-actions">
                            <button className="btn btn-secondary" onClick={() => setShowAddFunds(false)}>
                                Bekor qilish
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={handleAddFunds}
                                disabled={!addAmount || Number.parseFloat(addAmount) < 10}
                            >
                                <FiPlus /> To'ldirish
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default WalletSystem
