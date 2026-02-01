import axios from 'axios';

const API_URL = 'http://localhost:3000/api/bonuses';

export const bonusService = {
    /**
     * Calculate bonuses for a specific month/year
     * @param {number} month - Month (1-12)
     * @param {number} year - Year (e.g., 2026)
     * @param {number} totalRevenue - Total revenue for the month
     */
    calculateBonuses: async (month, year, totalRevenue) => {
        try {
            const response = await axios.post(`${API_URL}/calculate`, {
                month,
                year,
                totalRevenue
            });
            return response.data;
        } catch (error) {
            console.error('Error calculating bonuses:', error);
            throw error;
        }
    }
};
