import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import Participants from '../../pages/Participants/Participants';
import { participantService } from '../../services/participantService';
import { MemoryRouter } from 'react-router-dom';

// Mock auth context
vi.mock('../../context/AuthContext', () => ({
    useAuth: () => ({ user: { name: 'Test User' }, loading: false })
}));

// Mock participantService
vi.mock('../../services/participantService');

describe('Participants Integration Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const mockParticipants = [
        { id: '1', firstname: 'John', lastname: 'Doe', employeeId: 'E1', email: 'john@example.com' },
        { id: '2', firstname: 'Jane', lastname: 'Smith', employeeId: 'E2', email: 'jane@example.com' }
    ];

    it('should render participants list and search correctly', async () => {
        participantService.getParticipants.mockResolvedValue({ data: mockParticipants });

        render(
            <MemoryRouter>
                <Participants />
            </MemoryRouter>
        );

        // Check if names appear
        expect(await screen.findByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();

        // Test search
        const searchInput = screen.getByPlaceholderText(/Search by name/i);
        fireEvent.change(searchInput, { target: { value: 'John' } });

        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
    });

    it('should open edit modal with correct data', async () => {
        participantService.getParticipants.mockResolvedValue({ data: mockParticipants });

        render(
            <MemoryRouter>
                <Participants />
            </MemoryRouter>
        );

        const editBtns = await screen.findAllByTitle('Edit Participant');
        fireEvent.click(editBtns[0]);

        expect(screen.getByLabelText(/First Name/i)).toHaveValue('John');
        expect(screen.getByLabelText(/Last Name/i)).toHaveValue('Doe');
    });
});
