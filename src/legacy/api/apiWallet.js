import apiService from './apiService'

const API_BASE = '/wallet'

export const getWalletBalance = async () => {
    try {
        const response = await apiService.get(`${API_BASE}/`)
        return response.data
    } catch (error) {
        console.error('Error fetching wallet balance:', error)
        throw error
    }
}

export const getWalletTransactions = async (limit = 10, offset = 0) => {
    try {
        const response = await apiService.get(`${API_BASE}/transactions/`, {
            params: {
                limit,
                offset
            }
        })
        return response.data
    } catch (error) {
        console.error('Error fetching transactions:', error)
        throw error
    }
}

export const withdrawMoney = async (amount, method = 'card') => {
    try {
        const response = await apiService.post(`${API_BASE}/withdraw/`, {
            amount,
            method
        })
        return response.data
    } catch (error) {
        console.error('Error withdrawing money:', error)
        throw error
    }
}

export const applyPromoCode = async (code) => {
    try {
        const response = await apiService.post(`${API_BASE}/apply-promo/`, {
            code
        })
        return response.data
    } catch (error) {
        console.error('Error applying promo code:', error)
        throw error
    }
}

export const addCard = async (cardData) => {
    try {
        const response = await apiService.post(`${API_BASE}/cards/`, cardData)
        return response.data
    } catch (error) {
        console.error('Error adding card:', error)
        throw error
    }
}
