import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { bonusService } from '../../../services/bonusService';

vi.mock('axios');

describe('bonusService Unit Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('calculateBonuses', () => {
        it('should calculate bonuses with correct parameters', async () => {
            const mockResponse = {
                data: {
                    success: true,
                    data: {
                        forecastMet: true,
                        payouts: []
                    }
                }
            };

            axios.post.mockResolvedValue(mockResponse);

            const result = await bonusService.calculateBonuses(1, 2026, 50000);

            expect(axios.post).toHaveBeenCalledWith(
                'http://localhost:3000/api/bonuses/calculate',
                {
                    month: 1,
                    year: 2026,
                    totalRevenue: 50000
                }
            );
            expect(result.data.forecastMet).toBe(true);
        });

        it('should handle API errors gracefully', async () => {
            axios.post.mockRejectedValue(new Error('API Error'));

            await expect(bonusService.calculateBonuses(1, 2026, 50000))
                .rejects.toThrow('API Error');
        });
    });
});
