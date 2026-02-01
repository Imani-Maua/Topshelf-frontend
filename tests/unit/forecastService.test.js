import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { forecastService } from '../../services/forecastService';

vi.mock('axios');

describe('forecastService unit tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('getForecast should return data', async () => {
        axios.get.mockResolvedValue({ data: { success: true, data: { targetAmount: 1000 } } });

        const result = await forecastService.getForecast(1, 2026);
        expect(result.data.targetAmount).toBe(1000);
        expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/forecasts/1/2026'));
    });

    it('saveForecast should send POST request', async () => {
        const forecast = { month: 1, year: 2026, targetAmount: 5000 };
        axios.post.mockResolvedValue({ data: { success: true } });

        await forecastService.saveForecast(forecast);
        expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/forecasts'), forecast);
    });
});
