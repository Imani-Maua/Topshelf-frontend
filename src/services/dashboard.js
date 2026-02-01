import axios from 'axios';

const API_URL = 'http://localhost:300/api';

export const dashboardService = {


    getDashboardData: async (month, year) => {
        try{
            const [forecastData, revenueData, participantData] = await Promise.all([
                axios.get(`${API_URL}/forecasts/${month}/${year}`),
                axios.get(`${API_URL}/receipts/stats/summary`, {
                    params: {
                        startDate: new Date(year, month - 1, 1).toISOString(),
                        endDate: new Date(year, month, 0, 23, 59, 59).toISOString()
                    }
                }),
                axios.get(`${API_URL}/participants`)
            ]);

            const forecasts = forecastData.data.data;
            const revenue = revenueData.data.data;
            const participants = participantData.data.count;
        }
    }
}