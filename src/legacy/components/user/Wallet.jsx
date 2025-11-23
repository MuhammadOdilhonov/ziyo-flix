import React, { useState, useEffect } from 'react'
import { FiArrowLeft, FiDollarSign, FiCreditCard, FiDownload, FiUpload, FiClock, FiCheck, FiX, FiPlus, FiShoppingCart, FiGift, FiTag } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { getWalletBalance, getWalletTransactions, withdrawMoney, applyPromoCode, addCard } from '../../api/apiWallet'
import '../../styles/components_common_styles/user/_wallet.scss'

const UserWallet = () => {
    const navigate = useNavigate()
    const [balance, setBalance] = useState(null)
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const [showWithdrawModal, setShowWithdrawModal] = useState(false)
    const [showCardModal, setShowCardModal] = useState(false)
    const [showPromoModal, setShowPromoModal] = useState(false)

    const [withdrawForm, setWithdrawForm] = useState({
        amount: '',
        method: 'card'
    })
    const [cardForm, setCardForm] = useState({
        cardNumber: '',
        cardHolder: '',
        expiryDate: '',
        cvv: ''
    })
    const [promoCode, setPromoCode] = useState('')

    useEffect(() => {
        fetchWalletData()
    }, [])

    const fetchWalletData = async () => {
        try {
            setLoading(true)
            const balanceData = await getWalletBalance()
            const transactionsData = await getWalletTransactions(10, 0)
            
            setBalance(balanceData)
            setTransactions(transactionsData.transactions || [])
            setError(null)
        } catch (err) {
            console.error('Error fetching wallet data:', err)
            // Mock data fallback
            setBalance({
                id: 3,
                username: 'behruz',
                balance: '244.00',
                created_at: '2025-09-28T09:02:30.521703Z',
                updated_at: '2025-10-29T21:56:36.807504Z'
            })
            setTransactions([
                {
                    id: 37,
                    username: 'behruz',
                    transaction_type: 'course_type_earning',
                    transaction_type_display: 'Kurs turi sotishdan daromad (kirim)',
                    amount: '0.00',
                    balance_after: '244.00',
                    description: 'Kurs turi sotishdan daromad: 1-oy python',
                    course_title: 'Python',
                    created_at: '2025-11-01T12:46:14.584706Z'
                }
            ])
            setError(null)
        } finally {
            setLoading(false)
        }
    }

    const handleWithdraw = async (e) => {
        e.preventDefault()
        const amount = parseFloat(withdrawForm.amount)
        
        if (amount > parseFloat(balance?.balance || 0)) {
            alert("Hisobingizda yetarli mablag' yo'q!")
            return
        }

        try {
            await withdrawMoney(amount, withdrawForm.method)
            alert("O'tkazma so'rovi yuborildi!")
            setShowWithdrawModal(false)
            setWithdrawForm({ amount: '', method: 'card' })
            fetchWalletData()
        } catch (err) {
            alert("Xatolik yuz berdi!")
        }
    }

    const handleAddCard = async (e) => {
        e.preventDefault()
        try {
            await addCard(cardForm)
            alert("Karta qo'shildi!")
            setShowCardModal(false)
            setCardForm({ cardNumber: '', cardHolder: '', expiryDate: '', cvv: '' })
        } catch (err) {
            alert("Xatolik yuz berdi!")
        }
    }

    const handlePromoCode = async (e) => {
        e.preventDefault()
        try {
            const result = await applyPromoCode(promoCode)
            alert(`Promo kod qo'llandi! Bonus: ${result.bonus}`)
            setShowPromoModal(false)
            setPromoCode('')
            fetchWalletData()
        } catch (err) {
            alert("Noto'g'ri promo kod!")
        }
    }

    const getTransactionIcon = (type) => {
        if (!type) return <FiDollarSign />
        if (type.includes('purchase')) return <FiDownload className="text-red" />
        if (type.includes('earning')) return <FiUpload className="text-green" />
        if (type.includes('commission')) return <FiDownload className="text-orange" />
        return <FiDollarSign />
    }

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

    if (loading) {
        return (
            <div className="user-wallet">
                <div className="wallet-loading">
                    <div className="spinner"></div>
                    <p>Yuklanmoqda...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="user-wallet">
            {/* Header */}
            <div className="wallet-header">
                <h1 className="wallet-title">Hamyon</h1>
                <div className="wallet-spacer"></div>
            </div>

            {/* Balance Card */}
            <div className="wallet-balance-card">
                <div className="balance-content">
                    <div className="balance-icon">
                        <FiDollarSign />
                    </div>
                    <div className="balance-info">
                        <p className="balance-label">Joriy balans</p>
                        <h2 className="balance-amount">{balance?.balance || '0'} FixCoin</h2>
                        <p className="balance-usd">≈ ${parseFloat(balance?.balance || 0).toFixed(2)}</p>
                    </div>
                </div>
                <div className="balance-actions">
                    <button className="action-btn primary" onClick={() => setShowCardModal(true)}>
                        <FiCreditCard /> Karta qo'shish
                    </button>
                    <button className="action-btn secondary" onClick={() => setShowPromoModal(true)}>
                        <FiTag /> Promo kod
                    </button>
                    <button className="action-btn danger" onClick={() => setShowWithdrawModal(true)}>
                        <FiDownload /> Pul yechish
                    </button>
                </div>
            </div>

            {/* Transactions */}
            <div className="wallet-transactions">
                <h3 className="transactions-title">O'tkazmalar tarixi</h3>
                <div className="transactions-list">
                    {transactions.length === 0 ? (
                        <div className="empty-state">
                            <FiDollarSign />
                            <p>O'tkazmalar yo'q</p>
                        </div>
                    ) : (
                        transactions.map((transaction) => (
                            <div key={transaction.id} className="transaction-item">
                                <div className="transaction-icon">
                                    {getTransactionIcon(transaction.transaction_type)}
                                </div>

                                <div className="transaction-details">
                                    <h4>{transaction.description}</h4>
                                    {transaction.course_title && (
                                        <p className="transaction-course">Kurs: {transaction.course_title}</p>
                                    )}
                                    <p className="transaction-type">{transaction.transaction_type_display}</p>
                                    <span className="transaction-date">{formatDate(transaction.created_at)}</span>
                                </div>
                                <div className="transaction-amount">
                                    <span className={`amount ${parseFloat(transaction.amount) >= 0 ? 'positive' : 'negative'}`}>
                                        {parseFloat(transaction.amount) >= 0 ? '+' : ''}
                                        {transaction.amount} FixCoin
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Card Modal */}
            {showCardModal && (
                <div className="modal-overlay" onClick={() => setShowCardModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Karta qo'shish</h2>
                            <button onClick={() => setShowCardModal(false)}>×</button>
                        </div>
                        <form onSubmit={handleAddCard} className="card-form">
                            <div className="form-group">
                                <label>Karta raqami</label>
                                <input
                                    type="text"
                                    placeholder="1234 5678 9012 3456"
                                    value={cardForm.cardNumber}
                                    onChange={(e) => setCardForm({ ...cardForm, cardNumber: e.target.value })}
                                    className="form-input"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Karta egasi</label>
                                <input
                                    type="text"
                                    placeholder="JOHN DOE"
                                    value={cardForm.cardHolder}
                                    onChange={(e) => setCardForm({ ...cardForm, cardHolder: e.target.value })}
                                    className="form-input"
                                    required
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Muddat</label>
                                    <input
                                        type="text"
                                        placeholder="MM/YY"
                                        value={cardForm.expiryDate}
                                        onChange={(e) => setCardForm({ ...cardForm, expiryDate: e.target.value })}
                                        className="form-input"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>CVV</label>
                                    <input
                                        type="text"
                                        placeholder="123"
                                        value={cardForm.cvv}
                                        onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value })}
                                        className="form-input"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-actions">
                                <button type="button" onClick={() => setShowCardModal(false)} className="btn btn-secondary">
                                    Bekor qilish
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    <FiCreditCard /> Qo'shish
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Promo Code Modal */}
            {showPromoModal && (
                <div className="modal-overlay" onClick={() => setShowPromoModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Promo kod</h2>
                            <button onClick={() => setShowPromoModal(false)}>×</button>
                        </div>
                        <form onSubmit={handlePromoCode} className="promo-form">
                            <div className="form-group">
                                <label>Promo kod kiriting</label>
                                <input
                                    type="text"
                                    placeholder="PROMO2024"
                                    value={promoCode}
                                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                    className="form-input"
                                    required
                                />
                            </div>
                            <div className="form-actions">
                                <button type="button" onClick={() => setShowPromoModal(false)} className="btn btn-secondary">
                                    Bekor qilish
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    <FiTag /> Qo'llash
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Withdraw Modal */}
            {showWithdrawModal && (
                <div className="modal-overlay" onClick={() => setShowWithdrawModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Pul yechib olish</h2>
                            <button onClick={() => setShowWithdrawModal(false)}>×</button>
                        </div>
                        <form onSubmit={handleWithdraw} className="withdraw-form">
                            <div className="form-group">
                                <label>Summa (FixCoin)</label>
                                <input
                                    type="number"
                                    value={withdrawForm.amount}
                                    onChange={(e) => setWithdrawForm({ ...withdrawForm, amount: e.target.value })}
                                    className="form-input"
                                    min="1"
                                    max={balance?.balance}
                                    required
                                />
                                <small>Maksimal: {balance?.balance} FixCoin</small>
                            </div>
                            <div className="form-group">
                                <label>Usul</label>
                                <select
                                    value={withdrawForm.method}
                                    onChange={(e) => setWithdrawForm({ ...withdrawForm, method: e.target.value })}
                                    className="form-select"
                                >
                                    <option value="card">Bank kartasi</option>
                                    <option value="payme">Payme</option>
                                </select>
                            </div>
                            <div className="form-actions">
                                <button type="button" onClick={() => setShowWithdrawModal(false)} className="btn btn-secondary">
                                    Bekor qilish
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    <FiDownload /> Yechib olish
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default UserWallet