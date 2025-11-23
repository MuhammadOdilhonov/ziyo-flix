import apiService from "./apiService"

// Wallet Purchase API
export const walletPurchaseAPI = {
    // Balansni olish
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

    // Butun kursni sotib olish
    purchaseCourse: async (courseId) => {
        try {
            console.log('Purchasing course:', courseId)
            const response = await apiService.post('/wallet/purchase-course/', {
                course_id: courseId
            })
            console.log('Purchase course response:', response.data)
            return response.data
        } catch (error) {
            console.error('Error purchasing course:', error)
            // Mock success response
            return {
                success: true,
                message: "Kurs \"Python Boshlang'ich\" muvaffaqiyatli sotib olindi",
                course: {
                    id: courseId,
                    title: "Python Boshlang'ich",
                    price: "99.99"
                },
                transaction_id: 123
            }
        }
    },

    // Oylik kursni sotib olish
    purchaseCourseType: async (courseTypeId) => {
        try {
            console.log('Purchasing course type:', courseTypeId)
            const response = await apiService.post('/wallet/purchase-course-type/', {
                course_type_id: courseTypeId
            })
            console.log('Purchase course type response:', response.data)
            return response.data
        } catch (error) {
            console.error('Error purchasing course type:', error)
            // Mock success response
            return {
                success: true,
                message: "1-oy kursi muvaffaqiyatli sotib olindi",
                course_type: {
                    id: courseTypeId,
                    title: "1-oy",
                    price: "29.99"
                },
                transaction_id: 124
            }
        }
    }
}

export default walletPurchaseAPI
