import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { receiptService } from '../../../services/receiptService';

vi.mock('axios');

describe('receiptService Unit Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getReceipts', () => {
        it('should fetch receipts without filters', async () => {
            const mockResponse = {
                data: {
                    data: [
                        { id: '1', participant: { firstname: 'John' }, product: { name: 'Steak' } }
                    ]
                }
            };

            axios.get.mockResolvedValue(mockResponse);

            const result = await receiptService.getReceipts();

            expect(axios.get).toHaveBeenCalledWith(
                'http://localhost:3000/api/receipts',
                { params: {} }
            );
            expect(result.data).toHaveLength(1);
        });

        it('should fetch receipts with filters', async () => {
            const filters = {
                participantId: 'p1',
                productId: 'prod1',
                startDate: '2026-01-01',
                endDate: '2026-01-31'
            };

            const mockResponse = {
                data: { data: [] }
            };

            axios.get.mockResolvedValue(mockResponse);

            await receiptService.getReceipts(filters);

            expect(axios.get).toHaveBeenCalledWith(
                'http://localhost:3000/api/receipts',
                { params: filters }
            );
        });
    });

    describe('getReceiptsSummary', () => {
        it('should fetch receipts summary for date range', async () => {
            const mockResponse = {
                data: {
                    data: {
                        totalRevenue: 150000,
                        totalReceipts: 45
                    }
                }
            };

            axios.get.mockResolvedValue(mockResponse);

            const result = await receiptService.getReceiptsSummary(
                '2026-01-01',
                '2026-01-31'
            );

            expect(axios.get).toHaveBeenCalledWith(
                'http://localhost:3000/api/receipts/stats/summary',
                {
                    params: {
                        startDate: '2026-01-01',
                        endDate: '2026-01-31'
                    }
                }
            );
            expect(result.data.totalRevenue).toBe(150000);
        });
    });

    describe('uploadCSV', () => {
        it('should upload CSV without filters', async () => {
            const file = new File(['seller,item,quantity,price,date'], 'receipts.csv', {
                type: 'text/csv'
            });

            const mockResponse = {
                data: {
                    success: true,
                    data: { processed: 10, errors: [] }
                }
            };

            axios.post.mockResolvedValue(mockResponse);

            const result = await receiptService.uploadCSV(file);

            const callArgs = axios.post.mock.calls[0];
            expect(callArgs[0]).toBe('http://localhost:3000/api/bonuses/upload-receipts');
            expect(callArgs[1]).toBeInstanceOf(FormData);
            expect(callArgs[2].headers['Content-Type']).toBe('multipart/form-data');
            expect(result.data.processed).toBe(10);
        });

        it('should upload CSV with month/year filter', async () => {
            const file = new File(['seller,item,quantity,price,date'], 'receipts.csv', {
                type: 'text/csv'
            });

            const options = {
                filterByMonth: true,
                month: 2,
                year: 2026
            };

            const mockResponse = {
                data: {
                    success: true,
                    data: { processed: 5, errors: [] }
                }
            };

            axios.post.mockResolvedValue(mockResponse);

            await receiptService.uploadCSV(file, options);

            // Verify FormData contains the filter options
            expect(axios.post).toHaveBeenCalled();
            const callArgs = axios.post.mock.calls[0];
            expect(callArgs[1]).toBeInstanceOf(FormData);
        });
    });

    describe('error handling', () => {
        it('should handle network errors', async () => {
            axios.get.mockRejectedValue(new Error('Network Error'));

            await expect(receiptService.getReceipts())
                .rejects.toThrow('Network Error');
        });

        it('should handle CSV upload errors', async () => {
            const file = new File(['invalid'], 'bad.csv', { type: 'text/csv' });

            axios.post.mockRejectedValue({
                response: {
                    data: { error: 'Invalid CSV format' }
                }
            });

            await expect(receiptService.uploadCSV(file))
                .rejects.toMatchObject({
                    response: {
                        data: { error: 'Invalid CSV format' }
                    }
                });
        });
    });
});
