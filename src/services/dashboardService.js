import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const dashboardService = {
    /**
     * Fetches all data needed for the dashboard in one go.
     * @param {number} month (1-12)
     * @param {number} year (e.g. 2026)
     */
    getDashboardData: async (month, year) => {
        try {
            const startDate = new Date(Date.UTC(year, month - 1, 1)).toISOString();
            const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59)).toISOString();

            // 1. Fire off requests but handle individual failures
            const [forecastRes, revenueRes, participantsRes] = await Promise.all([
                axios.get(`${API_URL}/forecasts/${month}/${year}`).catch(() => ({ data: { data: null } })),
                axios.get(`${API_URL}/receipts/stats/summary`, { params: { startDate, endDate } }).catch(() => ({ data: { data: { totalRevenue: 0 } } })),
                axios.get(`${API_URL}/participants`).catch(() => ({ data: { count: 0 } }))
            ]);

            const forecast = forecastRes.data?.data;
            const revenue = revenueRes.data?.data || { totalRevenue: 0 };
            const participantsCount = participantsRes.data?.count ?? participantsRes.data?.data?.length ?? 0;

            console.log("Dashboard Debug - Raw Data:", {
                forecast,
                revenue,
                participantsCount
            });

            // 2. Only calculate bonuses if we have revenue AND a forecast
            let bonusData = { payouts: [] };
            if (forecast && revenue.totalRevenue > 0) {
                try {
                    const bonusRes = await axios.post(`${API_URL}/bonuses/calculate`, {
                        month,
                        year,
                        totalRevenue: revenue.totalRevenue
                    });
                    bonusData = bonusRes.data.data;
                    console.log("Dashboard Debug - Bonus Data:", bonusData);
                } catch (e) {
                    console.error("Dashboard Debug - Bonus Calculation failed", e);
                }
            }

            // 3. Aggregate Performance and Sales Data for Charts
            const performanceData = bonusData.payouts.map(p => ({
                name: p.participant.name.split(' ')[0], // Use first name for space
                revenue: p.breakdown.reduce((sum, b) =>
                    sum + b.items.reduce((iSum, item) => iSum + item.revenue, 0), 0
                ),
                bonus: p.amount
            })).sort((a, b) => b.revenue - a.revenue);

            const categoryAggregation = {};
            bonusData.payouts.forEach(p => {
                p.breakdown.forEach(b => {
                    const catRevenue = b.items.reduce((sum, item) => sum + item.revenue, 0);
                    categoryAggregation[b.category] = (categoryAggregation[b.category] || 0) + catRevenue;
                });
            });

            const salesData = Object.entries(categoryAggregation).map(([name, value]) => ({
                name,
                value
            })).sort((a, b) => b.value - a.value);

            // Calculate total earners from full payouts list
            const earningCount = bonusData.payouts.filter(p => (p.potentialBonus || p.amount) > 0).length;

            // 4. Transform data with fallbacks
            const target = forecast?.targetAmount || 1; // Prevent division by zero
            return {
                metrics: {
                    totalParticipants: participantsCount,
                    thresholdReached: forecast ? `${((revenue.totalRevenue / target) * 100).toFixed(0)}%` : "No Forecast",
                    earningCount,
                    estimatedPayout: `Ft ${bonusData.payouts.reduce((sum, p) => sum + (p.potentialBonus || p.amount), 0).toLocaleString()}`
                },
                revenue: {
                    current: revenue.totalRevenue,
                    target: forecast?.targetAmount || 0,
                    percentage: forecast ? (revenue.totalRevenue / target) * 100 : 0
                },
                performanceData,
                salesData,
                topPerformers: bonusData.payouts.slice(0, 3)
            };
        } catch (error) {
            console.error("Dashboard Service Critical Error:", error);
            throw error;
        }
    }
};
