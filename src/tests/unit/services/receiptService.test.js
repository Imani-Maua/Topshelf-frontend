import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { receiptService } from '../../../services/receiptService';

vi.mock('axios');

describe('receiptService unit tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('getReceipts should handle filters correctly', async () => {
        axios.get.mockResolvedValue({ data: { success: true } });

        const filters = { month: 1, year: 2026, participantId: '123' };
        await receiptService.getReceipts(filters);

        expect(axios.get).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
            params: expect.objectContaining({
                month: 1,
                year: 2026,
                participantId: '123'
            })
        }));
    });

    it('getReceiptsSummary should use UTC dates', async () => {
        axios.get.mockResolvedValue({ data: { success: true } });

        await receiptService.getReceiptsSummary('2026-01-01T00:00:00Z', '2026-01-31T23:59:59Z');

        expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/receipts/stats/summary'), expect.objectContaining({
            params: {
                startDate: '2026-01-01T00:00:00Z',
                endDate: '2026-01-31T23:59:59Z'
            }
        }));
    });
});
