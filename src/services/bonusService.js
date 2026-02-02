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
    },

    /**
     * Save calculated bonuses to database
     * @param {number} month 
     * @param {number} year 
     * @param {object} calculationResult - Result from calculateBonuses
     */
    saveBonuses: async (month, year, calculationResult) => {
        try {
            const response = await axios.post(`${API_URL}/save`, {
                month,
                year,
                calculationResult
            });
            return response.data;
        } catch (error) {
            console.error('Error saving bonuses:', error);
            throw error;
        }
    },

    /**
     * Get saved bonuses for a specific participant
     * @param {string} participantId 
     */
    getParticipantBonuses: async (participantId) => {
        try {
            const response = await axios.get(`${API_URL}/participant/${participantId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching participant bonuses:', error);
            throw error;
        }
    },

    /**
     * Get saved bonuses for a specific period
     * @param {number} month 
     * @param {number} year 
     */
    getBonusesByPeriod: async (month, year) => {
        try {
            const response = await axios.get(`${API_URL}/period/${month}/${year}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching period bonuses:', error);
            throw error;
        }
    },

    /**
     * Get bonus history/stats for a participant
     * @param {string} participantId - Participant ID
     */
    getBonusHistory: async (participantId) => {
        try {
            const response = await axios.get(`http://localhost:3000/api/participants/${participantId}/stats`);
            return response.data;
        } catch (error) {
            console.error('Error fetching bonus history:', error);
            throw error;
        }
    }
};
