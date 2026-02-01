import axios from 'axios';

const API_URL = 'http://localhost:3000/api/forecasts';

export const forecastService = {
    /**
     * Fetch all forecasts
     */
    getForecasts: async () => {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            console.error('Error fetching forecasts:', error);
            throw error;
        }
    },

    /**
     * Fetch a forecast for a specific month/year
     */
    getForecastByMonthYear: async (month, year) => {
        try {
            const response = await axios.get(`${API_URL}/${month}/${year}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching forecast:', error);
            throw error;
        }
    },

    /**
     * Create a new forecast
     */
    createForecast: async (forecastData) => {
        try {
            const response = await axios.post(API_URL, forecastData);
            return response.data;
        } catch (error) {
            console.error('Error creating forecast:', error);
            throw error;
        }
    },

    /**
     * Update an existing forecast
     */
    updateForecast: async (id, forecastData) => {
        try {
            const response = await axios.put(`${API_URL}/${id}`, forecastData);
            return response.data;
        } catch (error) {
            console.error('Error updating forecast:', error);
            throw error;
        }
    },

    /**
     * Delete a forecast
     */
    deleteForecast: async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting forecast:', error);
            throw error;
        }
    }
};
