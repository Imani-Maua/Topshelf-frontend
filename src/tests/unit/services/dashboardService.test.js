import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { dashboardService } from '../../../services/dashboardService';

// Mock axios
vi.mock('axios');

describe('dashboardService unit tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('getDashboardData should construct correct UTC date ranges', async () => {
        // Setup mocks to return empty/basic data so the function doesn't crash
        axios.get.mockResolvedValue({ data: { success: true, data: null, count: 0 } });
        axios.post.mockResolvedValue({ data: { success: true, data: { payouts: [] } } });

        const month = 2; // February
        const year = 2026;

        await dashboardService.getDashboardData(month, year);

        // Verify the second axios call (receipts summary) used the correct ISO strings
        // Feb 2026 should be 2026-02-01T00:00:00.000Z to 2026-02-28T23:59:59.000Z
        const summaryCall = axios.get.mock.calls.find(call => call[0].includes('receipts/stats/summary'));
        const params = summaryCall[1].params;

        expect(params.startDate).toBe('2026-02-01T00:00:00.000Z');
        expect(params.endDate).toBe('2026-02-28T23:59:59.000Z');
    });

    it('getDashboardData should correctly aggregate performance and sales data', async () => {
        // Mock responses
        axios.get.mockImplementation((url) => {
            if (url.includes('forecasts')) return Promise.resolve({ data: { data: { targetAmount: 50000 } } });
            if (url.includes('receipts/stats/summary')) return Promise.resolve({ data: { data: { totalRevenue: 10000 } } });
            if (url.includes('participants')) return Promise.resolve({ data: { count: 2 } });
            return Promise.resolve({ data: {} });
        });

        axios.post.mockResolvedValue({
            data: {
                data: {
                    payouts: [
                        {
                            participant: { id: '1', name: 'John Doe' },
                            amount: 1000,
                            potentialBonus: 1000,
                            breakdown: [
                                { category: 'Food', items: [{ revenue: 5000 }] }
                            ]
                        }
                    ]
                }
            }
        });

        const data = await dashboardService.getDashboardData(1, 2026);

        expect(data.metrics.totalParticipants).toBe(2);
        expect(data.performanceData[0].name).toBe('John');
        expect(data.performanceData[0].revenue).toBe(5000);
        expect(data.salesData[0].name).toBe('Food');
        expect(data.salesData[0].value).toBe(5000);
    });

    it('getDashboardData should handle API failures gracefully with fallbacks', async () => {
        // Mock failures
        axios.get.mockRejectedValue(new Error('Network Error'));

        const data = await dashboardService.getDashboardData(1, 2026);

        expect(data.revenue.current).toBe(0);
        expect(data.metrics.totalParticipants).toBe(0);
        expect(data.performanceData).toHaveLength(0);
    });
});
