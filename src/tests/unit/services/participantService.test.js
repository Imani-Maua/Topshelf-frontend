import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { participantService } from '../../../services/participantService';

vi.mock('axios');

describe('participantService Unit Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getParticipants', () => {
        it('should fetch all participants', async () => {
            const mockResponse = {
                data: {
                    data: [
                        { id: '1', firstname: 'John', lastname: 'Doe', employeeId: 'E001' },
                        { id: '2', firstname: 'Jane', lastname: 'Smith', employeeId: 'E002' }
                    ]
                }
            };

            axios.get.mockResolvedValue(mockResponse);

            const result = await participantService.getParticipants();

            expect(axios.get).toHaveBeenCalledWith('http://localhost:3000/api/participants');
            expect(result.data).toHaveLength(2);
        });
    });

    describe('getParticipantById', () => {
        it('should fetch a single participant by ID', async () => {
            const mockResponse = {
                data: {
                    data: { id: '1', firstname: 'John', lastname: 'Doe', employeeId: 'E001' }
                }
            };

            axios.get.mockResolvedValue(mockResponse);

            const result = await participantService.getParticipantById('1');

            expect(axios.get).toHaveBeenCalledWith('http://localhost:3000/api/participants/1');
            expect(result.data.firstname).toBe('John');
        });
    });

    describe('createParticipant', () => {
        it('should create a new participant', async () => {
            const newParticipant = {
                firstname: 'Alice',
                lastname: 'Johnson',
                employeeId: 'E003',
                email: 'alice@example.com'
            };

            const mockResponse = {
                data: {
                    success: true,
                    data: { id: '3', ...newParticipant }
                }
            };

            axios.post.mockResolvedValue(mockResponse);

            const result = await participantService.createParticipant(newParticipant);

            expect(axios.post).toHaveBeenCalledWith(
                'http://localhost:3000/api/participants',
                newParticipant
            );
            expect(result.data.firstname).toBe('Alice');
        });
    });

    describe('updateParticipant', () => {
        it('should update an existing participant', async () => {
            const updates = {
                firstname: 'John',
                lastname: 'Smith',
                email: 'john.smith@example.com'
            };

            const mockResponse = {
                data: {
                    success: true,
                    data: { id: '1', ...updates }
                }
            };

            axios.put.mockResolvedValue(mockResponse);

            const result = await participantService.updateParticipant('1', updates);

            expect(axios.put).toHaveBeenCalledWith(
                'http://localhost:3000/api/participants/1',
                updates
            );
            expect(result.data.lastname).toBe('Smith');
        });
    });

    describe('deleteParticipant', () => {
        it('should delete a participant by ID', async () => {
            const mockResponse = {
                data: { success: true }
            };

            axios.delete.mockResolvedValue(mockResponse);

            const result = await participantService.deleteParticipant('1');

            expect(axios.delete).toHaveBeenCalledWith('http://localhost:3000/api/participants/1');
            expect(result.success).toBe(true);
        });
    });

    describe('error handling', () => {
        it('should handle network errors', async () => {
            axios.get.mockRejectedValue(new Error('Network Error'));

            await expect(participantService.getParticipants())
                .rejects.toThrow('Network Error');
        });
    });
});
