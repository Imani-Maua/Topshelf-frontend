import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { forecastService } from '../../../services/forecastService';

vi.mock('axios');

describe('forecastService Unit Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getForecasts', () => {
        it('should fetch all forecasts', async () => {
            const mockResponse = {
                data: {
                    data: [
                        { id: '1', month: 1, year: 2026, targetAmount: 50000, threshold: 0.9 }
                    ]
                }
            };

            axios.get.mockResolvedValue(mockResponse);

            const result = await forecastService.getForecasts();

            expect(axios.get).toHaveBeenCalledWith('http://localhost:3000/api/forecasts');
            expect(result.data).toHaveLength(1);
        });
    });

    describe('getForecastByMonthYear', () => {
        it('should fetch forecast for specific month and year', async () => {
            const mockResponse = {
                data: {
                    data: { id: '1', month: 2, year: 2026, targetAmount: 60000, threshold: 0.9 }
                }
            };

            axios.get.mockResolvedValue(mockResponse);

            const result = await forecastService.getForecastByMonthYear(2, 2026);

            expect(axios.get).toHaveBeenCalledWith('http://localhost:3000/api/forecasts/2/2026');
            expect(result.data.targetAmount).toBe(60000);
        });

        it('should handle missing forecast (404)', async () => {
            axios.get.mockRejectedValue({
                response: { status: 404 }
            });

            await expect(forecastService.getForecastByMonthYear(12, 2025))
                .rejects.toMatchObject({ response: { status: 404 } });
        });
    });

    describe('saveForecast', () => {
        it('should create new forecast when ID is not provided', async () => {
            const newForecast = {
                month: 3,
                year: 2026,
                targetAmount: 75000,
                threshold: 0.85
            };

            const mockResponse = {
                data: {
                    success: true,
                    data: { id: 'new-id', ...newForecast }
                }
            };

            axios.post.mockResolvedValue(mockResponse);

            const result = await forecastService.saveForecast(newForecast);

            expect(axios.post).toHaveBeenCalledWith(
                'http://localhost:3000/api/forecasts',
                newForecast
            );
            expect(result.data.id).toBe('new-id');
        });

        it('should update existing forecast when ID is provided', async () => {
            const updates = {
                id: 'existing-id',
                month: 3,
                year: 2026,
                targetAmount: 80000,
                threshold: 0.9
            };

            const mockResponse = {
                data: {
                    success: true,
                    data: updates
                }
            };

            axios.post.mockResolvedValue(mockResponse);

            const result = await forecastService.saveForecast(updates);

            // Service uses POST with ID, not PUT
            expect(axios.post).toHaveBeenCalledWith(
                'http://localhost:3000/api/forecasts',
                updates
            );
            expect(result.data.targetAmount).toBe(80000);
        });
    });

    describe('deleteForecast', () => {
        it('should delete forecast by ID', async () => {
            const mockResponse = {
                data: { success: true }
            };

            axios.delete.mockResolvedValue(mockResponse);

            const result = await forecastService.deleteForecast('forecast-id');

            expect(axios.delete).toHaveBeenCalledWith('http://localhost:3000/api/forecasts/forecast-id');
            expect(result.success).toBe(true);
        });
    });
});
