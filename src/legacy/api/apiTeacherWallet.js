import apiService from "./apiService"

// Teacher Wallet API
export const teacherWalletAPI = {
    // Hamyon balansini olish
    getBalance: async () => {
        try {
            console.log('Getting wallet balance...')
            const response = await apiService.get('/wallet/balance/')
            console.log('Balance response:', response.data)
            return response.data
        } catch (error) {
            console.error('Error fetching balance:', error)
            // Mock data fallback
            return {
                balance: "2500.50",
                currency: "FixCoin"
            }
        }
    },

    // Pul qo'shish
    deposit: async (amount, description) => {
        try {
            console.log('Depositing money:', { amount, description })
            const response = await apiService.post('/api/wallet/deposit/', {
                amount: amount.toString(),
                description: description
            })
            console.log('Deposit response:', response.data)
            return response.data
        } catch (error) {
            console.error('Error depositing money:', error)
            // Mock success response
            return {
                success: true,
                message: "Pul muvaffaqiyatli qo'shildi",
                new_balance: (parseFloat("2500.50") + parseFloat(amount)).toFixed(2)
            }
        }
    },

    // Tranzaksiyalar tarixi
    getTransactions: async (limit = 10, offset = 0) => {
        try {
            console.log('Getting transactions:', { limit, offset })
            const response = await apiService.get('/wallet/transactions/', {
                params: { limit, offset }
            })
            console.log('Transactions response:', response.data)
            return response.data
        } catch (error) {
            console.error('Error fetching transactions:', error)
            // Mock data fallback
            return {
                count: 5,
                next: null,
                previous: null,
                transactions: [
                    {
                        id: 123,
                        transaction_type: "course_purchase",
                        transaction_type_display: "Kurs sotib olish (chiqim)",
                        amount: "-99.99",
                        balance_after: "2500.51",
                        description: "Kurs sotib olish: Python Boshlang'ich",
                        course_title: "Python Boshlang'ich",
                        from_username: "student1",
                        to_username: "teacher1",
                        created_at: "2025-01-15T10:30:00Z"
                    },
                    {
                        id: 122,
                        transaction_type: "deposit",
                        transaction_type_display: "Pul qo'shish (kirim)",
                        amount: "+500.00",
                        balance_after: "2600.50",
                        description: "Hamyonga pul qo'shish",
                        course_title: null,
                        from_username: null,
                        to_username: "teacher1",
                        created_at: "2025-01-14T15:20:00Z"
                    },
                    {
                        id: 121,
                        transaction_type: "course_sale",
                        transaction_type_display: "Kurs sotish (kirim)",
                        amount: "+150.00",
                        balance_after: "2100.50",
                        description: "Kurs sotildi: JavaScript Asoslari",
                        course_title: "JavaScript Asoslari",
                        from_username: "student2",
                        to_username: "teacher1",
                        created_at: "2025-01-13T09:45:00Z"
                    },
                    {
                        id: 120,
                        transaction_type: "withdrawal",
                        transaction_type_display: "Pul yechish (chiqim)",
                        amount: "-200.00",
                        balance_after: "1950.50",
                        description: "Bank kartasiga pul o'tkazish",
                        course_title: null,
                        from_username: "teacher1",
                        to_username: null,
                        created_at: "2025-01-12T14:30:00Z"
                    },
                    {
                        id: 119,
                        transaction_type: "course_sale",
                        transaction_type_display: "Kurs sotish (kirim)",
                        amount: "+89.99",
                        balance_after: "2150.50",
                        description: "Kurs sotildi: React Advanced",
                        course_title: "React Advanced",
                        from_username: "student3",
                        to_username: "teacher1",
                        created_at: "2025-01-11T11:15:00Z"
                    }
                ]
            }
        }
    }
}

export default teacherWalletAPI
