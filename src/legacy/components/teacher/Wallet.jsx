"use client"

import { useState, useEffect } from "react"
import { FiDollarSign, FiCreditCard, FiDownload, FiUpload, FiTrendingUp, FiTrendingDown, FiClock, FiCheck, FiX, FiEye, FiPlus, FiStar, FiTrash2 } from "react-icons/fi"

const TeacherWallet = () => {
    const [walletData, setWalletData] = useState({
        balance: 0,
        totalEarnings: 0,
        pendingAmount: 0,
        withdrawnAmount: 0,
        fixcoinRate: 1, // 1 FixCoin = 1 USD
        transactions: []
    })

    const [showWithdrawModal, setShowWithdrawModal] = useState(false)
    const [showDepositModal, setShowDepositModal] = useState(false)
    const [showAddCardModal, setShowAddCardModal] = useState(false)

    const [withdrawForm, setWithdrawForm] = useState({
        amount: "",
        method: "bank_card", // bank_card, payme, click
        cardId: "",
        cardNumber: "",
        cardHolder: "",
        expiryDate: "",
        cvv: ""
    })
    const [depositForm, setDepositForm] = useState({
        amount: "",
        method: "payme", // payme, click, bank_card
        cardId: ""
    })

    const [savedCards, setSavedCards] = useState([
        { id: "c1", brand: "UZCARD", number: "8600 **** **** 1234", holder: "A. KARIMOV", expiry: "12/26", isDefault: true, requiresCvv: false },
        { id: "c2", brand: "HUMO", number: "9860 **** **** 9876", holder: "A. KARIMOV", expiry: "07/25", isDefault: false, requiresCvv: true }
    ])
    const [newCardForm, setNewCardForm] = useState({
        brand: "UZCARD",
        holder: "",
        number: "",
        expiry: "",
        requiresCvv: false,
        cvv: ""
    })

    useEffect(() => {
        fetchWalletData()
    }, [])

    const fetchWalletData = async () => {
        const mockData = {
            balance: 2500.50,
            totalEarnings: 15750.25,
            pendingAmount: 1250.75,
            withdrawnAmount: 13250.00,
            fixcoinRate: 1,
            transactions: [
                { id: 1, type: "earning", amount: 150.00, description: "JavaScript kursi - 5 o'quvchi", date: "2024-03-20", status: "completed", method: "course_sale" },
                { id: 2, type: "withdrawal", amount: -500.00, description: "Bank kartasiga o'tkazma", date: "2024-03-18", status: "completed", method: "bank_card" },
                { id: 3, type: "earning", amount: 75.50, description: "React kursi - 3 o'quvchi", date: "2024-03-15", status: "completed", method: "course_sale" },
                { id: 4, type: "earning", amount: 200.00, description: "Node.js kursi - 8 o'quvchi", date: "2024-03-12", status: "pending", method: "course_sale" },
                { id: 5, type: "withdrawal", amount: -1000.00, description: "Payme orqali o'tkazma", date: "2024-03-10", status: "completed", method: "payme" }
            ]
        }
        setWalletData(mockData)
    }

    const maskFullToShort = (num) => num ? `${num.slice(0, 4)} **** **** ${num.slice(-4)}` : ""

    const handleWithdraw = async (e) => {
        e.preventDefault()
        const amount = parseFloat(withdrawForm.amount)
        if (!amount || amount <= 0) return
        if (amount > walletData.balance) {
            alert("Hisobingizda yetarli mablag' yo'q!")
            return
        }
        const description = withdrawForm.method === 'bank_card' ? 'Bank kartasiga o\'tkazma' : (withdrawForm.method === 'payme' ? 'Payme orqali' : 'Click orqali')
        const withdrawal = { id: Date.now(), type: "withdrawal", amount: -amount, description, date: new Date().toISOString().split('T')[0], status: "pending", method: withdrawForm.method }
        setWalletData(prev => ({ ...prev, balance: prev.balance - amount, transactions: [withdrawal, ...prev.transactions] }))
        setShowWithdrawModal(false)
        setWithdrawForm({ amount: "", method: "bank_card", cardId: "", cardNumber: "", cardHolder: "", expiryDate: "", cvv: "" })
        alert("O'tkazma so'rovi yuborildi! Tez orada ko'rib chiqiladi.")
    }

    const handleDeposit = async (e) => {
        e.preventDefault()
        const amount = parseFloat(depositForm.amount)
        if (!amount || amount <= 0) return
        const description = depositForm.method === 'bank_card' ? 'Bank kartasi orqali' : (depositForm.method === 'payme' ? 'Payme' : 'Click')
        const deposit = { id: Date.now(), type: "deposit", amount, description: `${description} to'ldirish`, date: new Date().toISOString().split('T')[0], status: "completed", method: depositForm.method }
        setWalletData(prev => ({ ...prev, balance: prev.balance + amount, transactions: [deposit, ...prev.transactions] }))
        setShowDepositModal(false)
        setDepositForm({ amount: "", method: "payme", cardId: "" })
        alert("Hisob to'ldirildi!")
    }

    const addNewCard = (e) => {
        e.preventDefault()
        if (!newCardForm.holder || !newCardForm.number || !newCardForm.expiry) return
        if (newCardForm.requiresCvv && (!newCardForm.cvv || newCardForm.cvv.length !== 3)) {
            alert("CVV 3 raqam bo'lishi kerak")
            return
        }
        const masked = maskFullToShort(newCardForm.number.replace(/\s/g, ""))
        const card = { id: `c${Date.now()}`, brand: newCardForm.brand, number: masked, holder: newCardForm.holder.toUpperCase(), expiry: newCardForm.expiry, isDefault: savedCards.length === 0, requiresCvv: newCardForm.requiresCvv }
        setSavedCards([card, ...savedCards])
        setShowAddCardModal(false)
        setNewCardForm({ brand: "UZCARD", holder: "", number: "", expiry: "", requiresCvv: false, cvv: "" })
    }

    const setDefaultCard = (id) => {
        setSavedCards(cards => cards.map(c => ({ ...c, isDefault: c.id === id })))
    }

    const removeCard = (id) => {
        if (!window.confirm("Kartani o'chirishni xohlaysizmi?")) return
        setSavedCards(cards => cards.filter(c => c.id !== id))
    }

    const getTransactionIcon = (type) => {
        switch (type) {
            case "earning": return <FiTrendingUp className="text-green" />
            case "withdrawal": return <FiTrendingDown className="text-red" />
            case "deposit": return <FiUpload className="text-blue" />
            default: return <FiDollarSign />
        }
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case "completed": return <FiCheck className="text-green" />
            case "pending": return <FiClock className="text-yellow" />
            case "failed": return <FiX className="text-red" />
            default: return <FiClock />
        }
    }

    const formatFix = (amount) => `${new Intl.NumberFormat('uz-UZ').format(amount)} FixCoin`
    const formatUSD = (amount) => new Intl.NumberFormat('uz-UZ', { style: 'currency', currency: 'USD' }).format(amount)

    return (
        <div className="teacher-wallet">
            <div className="page-header">
                <h1>Hamyon</h1>
                <p>FixCoin hisobingizni boshqaring, kartalarni ulang va tezkor o'tkazmalar qiling</p>
            </div>

            <div className="balance-card">
                <div className="balance-header">
                    <div className="balance-info">
                        <h2>Joriy balans</h2>
                        <div className="balance-amount">{formatFix(walletData.balance)}</div>
                        <div className="balance-subtitle">≈ {formatUSD(walletData.balance * walletData.fixcoinRate)}</div>
                    </div>
                    <div className="wallet-icon"><FiDollarSign /></div>
                </div>
                <div className="balance-actions">
                    <button className="btn btn-primary" onClick={() => setShowDepositModal(true)}><FiUpload /> Hisobni to'ldirish</button>
                    <button className="btn btn-secondary" onClick={() => setShowWithdrawModal(true)}><FiDownload /> Yechib olish</button>
                </div>
            </div>

            <div className="wallet-stats">
                <div className="stat-card">
                    <div className="stat-icon"><FiTrendingUp /></div>
                    <div className="stat-content">
                        <h3>{formatFix(walletData.totalEarnings)}</h3>
                        <p>Jami daromad</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon"><FiClock /></div>
                    <div className="stat-content">
                        <h3>{formatFix(walletData.pendingAmount)}</h3>
                        <p>Kutilmoqda</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon"><FiDownload /></div>
                    <div className="stat-content">
                        <h3>{formatFix(walletData.withdrawnAmount)}</h3>
                        <p>Yechib olingan</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon"><FiEye /></div>
                    <div className="stat-content">
                        <h3>1 FixCoin = {formatUSD(walletData.fixcoinRate)}</h3>
                        <p>Valyuta kursi</p>
                    </div>
                </div>
            </div>

            <div className="cards-section">
                <div className="cards-header">
                    <h3>Ulangan kartalar</h3>
                    <button className="btn btn-primary" onClick={() => setShowAddCardModal(true)}><FiPlus /> Karta ulash</button>
                </div>
                <div className="cards-grid">
                    {savedCards.map(card => (
                        <div key={card.id} className={`card-item ${card.isDefault ? 'default' : ''}`}>
                            <div className="card-brand">{card.brand}</div>
                            <div className="card-number">{card.number}</div>
                            <div className="card-meta">
                                <span>{card.holder}</span>
                                <span>{card.expiry}</span>
                            </div>
                            <div className="card-actions">
                                {!card.isDefault && (
                                    <button className="btn btn-secondary" onClick={() => setDefaultCard(card.id)}><FiStar /> Asosiy</button>
                                )}
                                <button className="btn btn-danger" onClick={() => removeCard(card.id)}><FiTrash2 /> O'chirish</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="transaction-history">
                <div className="section-header">
                    <h3>O'tkazmalar tarixi</h3>
                    <div className="filter-buttons">
                        <button className="filter-btn active">Barchasi</button>
                        <button className="filter-btn">Daromad</button>
                        <button className="filter-btn">To'ldirish</button>
                        <button className="filter-btn">Yechish</button>
                    </div>
                </div>
                <div className="transactions-list">
                    {walletData.transactions.map((t) => (
                        <div key={t.id} className="transaction-item">
                            <div className="transaction-info">
                                <div className={`transaction-icon ${t.type === 'earning' ? 'income' : t.type === 'withdrawal' ? 'withdrawal' : 'expense'}`}>
                                    {getTransactionIcon(t.type)}
                                </div>
                                <div className="transaction-details">
                                    <h4>{t.description}</h4>
                                    <p>{t.method === 'course_sale' ? 'Kurs sotuvi' : t.method}</p>
                                </div>
                            </div>
                            <div className="transaction-amount">
                                <div className={`amount ${t.type === 'earning' || t.type === 'deposit' ? 'positive' : 'negative'}`}>
                                    {(t.type === 'earning' || t.type === 'deposit') ? '+' : ''}{formatFix(Math.abs(t.amount))}
                                </div>
                                <div className="date">≈ {formatUSD(Math.abs(t.amount) * walletData.fixcoinRate)} • {t.date}</div>
                                <div className="transaction-status">
                                    {getStatusIcon(t.status)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Withdraw Modal */}
            {showWithdrawModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h2>Pul yechib olish</h2>
                            <button onClick={() => setShowWithdrawModal(false)}>×</button>
                        </div>
                        <form onSubmit={handleWithdraw} className="withdraw-form">
                            <div className="form-group">
                                <label>Summa (FixCoin)</label>
                                <input type="number" value={withdrawForm.amount} onChange={(e) => setWithdrawForm({ ...withdrawForm, amount: e.target.value })} className="form-input" min="1" max={walletData.balance} required />
                                <small>Maksimal: {walletData.balance} FixCoin</small>
                            </div>

                            <div className="form-group">
                                <label>Usul</label>
                                <select value={withdrawForm.method} onChange={(e) => setWithdrawForm({ ...withdrawForm, method: e.target.value })} className="form-select">
                                    <option value="bank_card">Bank kartasi</option>
                                    <option value="payme">Payme</option>
                                    <option value="click">Click</option>
                                </select>
                            </div>

                            {withdrawForm.method === 'bank_card' && (
                                <>
                                    <div className="form-group">
                                        <label>Karta</label>
                                        <select value={withdrawForm.cardId} onChange={(e) => setWithdrawForm({ ...withdrawForm, cardId: e.target.value })} className="form-select">
                                            <option value="">Karta tanlang</option>
                                            {savedCards.map(c => (
                                                <option key={c.id} value={c.id}>{c.number} • {c.holder}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Karta egasi</label>
                                            <input type="text" value={withdrawForm.cardHolder} onChange={(e) => setWithdrawForm({ ...withdrawForm, cardHolder: e.target.value })} className="form-input" placeholder="AHMADJON KARIMOV" />
                                        </div>
                                        <div className="form-group">
                                            <label>Muddati</label>
                                            <input type="text" value={withdrawForm.expiryDate} onChange={(e) => setWithdrawForm({ ...withdrawForm, expiryDate: e.target.value })} className="form-input" placeholder="MM/YY" />
                                        </div>
                                        <div className="form-group">
                                            <label>CVV</label>
                                            <input type="text" value={withdrawForm.cvv} onChange={(e) => setWithdrawForm({ ...withdrawForm, cvv: e.target.value })} className="form-input" placeholder="123" maxLength="3" />
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="withdrawal-actions">
                                <button type="button" onClick={() => setShowWithdrawModal(false)} className="btn btn-secondary">Bekor qilish</button>
                                <button type="submit" className="btn btn-primary"><FiDownload /> Yechib olish</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Deposit Modal */}
            {showDepositModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h2>Hisob to'ldirish</h2>
                            <button onClick={() => setShowDepositModal(false)}>×</button>
                        </div>
                        <form onSubmit={handleDeposit} className="deposit-form">
                            <div className="form-group">
                                <label>Summa (FixCoin)</label>
                                <input type="number" value={depositForm.amount} onChange={(e) => setDepositForm({ ...depositForm, amount: e.target.value })} className="form-input" min="1" required />
                            </div>

                            <div className="form-group">
                                <label>To'lov usuli</label>
                                <div className="payment-methods">
                                    <label className="payment-method">
                                        <input type="radio" name="method" value="payme" checked={depositForm.method === 'payme'} onChange={(e) => setDepositForm({ ...depositForm, method: e.target.value })} />
                                        <div className="method-card"><FiCreditCard /><span>Payme</span></div>
                                    </label>
                                    <label className="payment-method">
                                        <input type="radio" name="method" value="click" checked={depositForm.method === 'click'} onChange={(e) => setDepositForm({ ...depositForm, method: e.target.value })} />
                                        <div className="method-card"><FiCreditCard /><span>Click</span></div>
                                    </label>
                                    <label className="payment-method">
                                        <input type="radio" name="method" value="bank_card" checked={depositForm.method === 'bank_card'} onChange={(e) => setDepositForm({ ...depositForm, method: e.target.value })} />
                                        <div className="method-card"><FiCreditCard /><span>Bank karta</span></div>
                                    </label>
                                </div>
                            </div>

                            {depositForm.method === 'bank_card' && (
                                <div className="form-group">
                                    <label>Karta</label>
                                    <select value={depositForm.cardId} onChange={(e) => setDepositForm({ ...depositForm, cardId: e.target.value })} className="form-select">
                                        <option value="">Karta tanlang</option>
                                        {savedCards.map(c => (
                                            <option key={c.id} value={c.id}>{c.number} • {c.holder}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="withdrawal-actions">
                                <button type="button" onClick={() => setShowDepositModal(false)} className="btn btn-secondary">Bekor qilish</button>
                                <button type="submit" className="btn btn-primary"><FiUpload /> To'ldirish</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Card Modal */}
            {showAddCardModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h2>Karta ulash</h2>
                            <button onClick={() => setShowAddCardModal(false)}>×</button>
                        </div>
                        <form onSubmit={addNewCard} className="withdraw-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Brend</label>
                                    <select className="form-select" value={newCardForm.brand} onChange={(e) => setNewCardForm({ ...newCardForm, brand: e.target.value })}>
                                        <option value="UZCARD">UZCARD</option>
                                        <option value="HUMO">HUMO</option>
                                        <option value="VISA">VISA</option>
                                        <option value="MASTERCARD">MASTERCARD</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Karta egasi</label>
                                    <input type="text" className="form-input" value={newCardForm.holder} onChange={(e) => setNewCardForm({ ...newCardForm, holder: e.target.value })} placeholder="FISH" />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Karta raqami</label>
                                    <input type="text" className="form-input" value={newCardForm.number} onChange={(e) => setNewCardForm({ ...newCardForm, number: e.target.value })} placeholder="8600 1234 5678 9012" />
                                </div>
                                <div className="form-group">
                                    <label>Muddati (MM/YY)</label>
                                    <input type="text" className="form-input" value={newCardForm.expiry} onChange={(e) => setNewCardForm({ ...newCardForm, expiry: e.target.value })} placeholder="12/26" />
                                </div>
                                <div className="form-group">
                                    <label>CVV talab qilinsinmi?</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <input type="checkbox" checked={newCardForm.requiresCvv} onChange={(e) => setNewCardForm({ ...newCardForm, requiresCvv: e.target.checked })} />
                                        <span>Ha</span>
                                    </div>
                                </div>
                            </div>
                            {newCardForm.requiresCvv && (
                                <div className="form-group">
                                    <label>CVV</label>
                                    <input type="text" className="form-input" value={newCardForm.cvv} onChange={(e) => setNewCardForm({ ...newCardForm, cvv: e.target.value })} placeholder="123" maxLength="3" />
                                </div>
                            )}

                            <div className="withdrawal-actions">
                                <button type="button" onClick={() => setShowAddCardModal(false)} className="btn btn-secondary">Bekor qilish</button>
                                <button type="submit" className="btn btn-primary"><FiCreditCard /> Ulash</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TeacherWallet
