import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const receiptService = {
    /**
     * Get all receipts with optional filters
     * @param {Object} filters - Optional filters (participantId, productId, categoryId, startDate, endDate, etc.)
     */
    getReceipts: async (filters = {}) => {
        try {
            const response = await axios.get(`${API_URL}/receipts`, { params: filters });
            return response.data;
        } catch (error) {
            console.error('Error fetching receipts:', error);
            throw error;
        }
    },

    /**
     * Get receipts summary for a date range
     * @param {string} startDate - ISO date string
     * @param {string} endDate - ISO date string
     */
    getReceiptsSummary: async (startDate, endDate) => {
        try {
            const response = await axios.get(`${API_URL}/receipts/stats/summary`, {
                params: { startDate, endDate }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching receipts summary:', error);
            throw error;
        }
    },

    /**
     * Upload CSV file with receipts
     * @param {File} file - CSV file
     * @param {Object} options - Upload options { filterByMonth, month, year }
     */
    uploadCSV: async (file, options = {}) => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            if (options.filterByMonth) {
                formData.append('filterByMonth', 'true');
                formData.append('month', options.month);
                formData.append('year', options.year);
            }

            const response = await axios.post(`${API_URL}/bonuses/upload-receipts`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error uploading CSV:', error);
            throw error;
        }
    }
};
