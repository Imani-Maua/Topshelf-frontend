import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { dashboardService } from '../../../services/dashboardService';

vi.mock('axios');

describe('dashboardService Unit Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getDashboardData', () => {
        it('should construct correct UTC date ranges', async () => {
            const mockForecast = { data: { data: { targetAmount: 50000, threshold: 0.9 } } };
            const mockRevenue = { data: { data: { totalRevenue: 45000 } } };
            const mockParticipants = { data: { count: 10 } };

            axios.get.mockImplementation((url) => {
                if (url.includes('/forecasts/')) return Promise.resolve(mockForecast);
                if (url.includes('/receipts/stats/summary')) return Promise.resolve(mockRevenue);
                if (url.includes('/participants')) return Promise.resolve(mockParticipants);
                return Promise.reject(new Error('Unknown endpoint'));
            });

            axios.post.mockResolvedValue({
                data: { data: { payouts: [] } }
            });

            await dashboardService.getDashboardData(2, 2026);

            // Verify date range calculation
            const receiptCall = axios.get.mock.calls.find(call =>
                call[0].includes('/receipts/stats/summary')
            );

            expect(receiptCall[1].params.startDate).toContain('2026-02-01');
            expect(receiptCall[1].params.endDate).toContain('2026-02-28');
        });

        it('should correctly aggregate performance and sales data', async () => {
            const mockForecast = { data: { data: { targetAmount: 50000, threshold: 0.9 } } };
            const mockRevenue = { data: { data: { totalRevenue: 10000 } } };
            const mockParticipants = { data: { count: 2 } };
            const mockBonus = {
                data: {
                    data: {
                        payouts: [
                            {
                                participant: { name: 'John Doe' },
                                amount: 1000,
                                potentialBonus: 1000,
                                breakdown: [
                                    {
                                        category: 'Steaks',
                                        items: [{ revenue: 5000 }]
                                    }
                                ]
                            }
                        ]
                    }
                }
            };

            axios.get.mockImplementation((url) => {
                if (url.includes('/forecasts/')) return Promise.resolve(mockForecast);
                if (url.includes('/receipts/stats/summary')) return Promise.resolve(mockRevenue);
                if (url.includes('/participants')) return Promise.resolve(mockParticipants);
                return Promise.reject(new Error('Unknown endpoint'));
            });

            axios.post.mockResolvedValue(mockBonus);

            const result = await dashboardService.getDashboardData(1, 2026);

            expect(result.metrics.totalParticipants).toBe(2);
            expect(result.metrics.earningCount).toBe(1);
            expect(result.performanceData).toHaveLength(1);
            expect(result.salesData).toHaveLength(1);
            expect(result.salesData[0].name).toBe('Steaks');
        });

        it('should handle API failures gracefully with fallbacks', async () => {
            // Mock all APIs to fail
            axios.get.mockImplementation(() => Promise.resolve({
                data: { data: null, count: 0 }
            }));

            axios.post.mockResolvedValue({
                data: { data: { payouts: [] } }
            });

            const result = await dashboardService.getDashboardData(1, 2026);

            // Should return default values instead of throwing
            expect(result.metrics.totalParticipants).toBe(0);
            expect(result.metrics.thresholdReached).toBe('No Forecast');
            expect(result.performanceData).toEqual([]);
        });
    });
});
