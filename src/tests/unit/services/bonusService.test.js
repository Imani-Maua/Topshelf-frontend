import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { bonusService } from '../../../services/bonusService';

vi.mock('axios');

describe('bonusService unit tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('calculateBonuses should send correct body', async () => {
        axios.post.mockResolvedValue({ data: { success: true } });

        await bonusService.calculateBonuses(1, 2026, 50000);

        expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/bonuses/calculate'), {
            month: 1,
            year: 2026,
            totalRevenue: 50000
        });
    });

    it('getBonusHistory should fetch participants stats', async () => {
        axios.get.mockResolvedValue({ data: { success: true } });

        await bonusService.getBonusHistory('part1');
        expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/participants/part1/stats'));
    });
});
