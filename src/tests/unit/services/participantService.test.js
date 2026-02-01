import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { participantService } from '../../../services/participantService';

vi.mock('axios');

describe('participantService unit tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('getParticipants should return data on success', async () => {
        const mockData = { data: [{ id: '1', firstname: 'John' }] };
        axios.get.mockResolvedValue({ data: mockData });

        const result = await participantService.getParticipants();
        expect(result).toEqual(mockData);
        expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/participants'));
    });

    it('createParticipant should send POST request', async () => {
        const participant = { firstname: 'Jane', lastname: 'Doe' };
        axios.post.mockResolvedValue({ data: { success: true } });

        await participantService.createParticipant(participant);
        expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/participants'), participant);
    });

    it('uploadCSV should send multipart/form-data', async () => {
        const file = new File(['test'], 'test.csv', { type: 'text/csv' });
        axios.post.mockResolvedValue({ data: { success: true } });

        await participantService.uploadCSV(file);

        const call = axios.post.mock.calls[0];
        expect(call[0]).toContain('/participants/upload-csv');
        expect(call[1]).toBeInstanceOf(FormData);
        expect(call[2].headers['Content-Type']).toBe('multipart/form-data');
    });
});
