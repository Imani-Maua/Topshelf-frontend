import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import Receipts from '../../pages/Receipts/Receipts';
import { receiptService } from '../../services/receiptService';
import { participantService } from '../../services/participantService';
import { MemoryRouter } from 'react-router-dom';

// Mock auth context
vi.mock('../../context/AuthContext', () => ({
    useAuth: () => ({ user: { name: 'Test User' }, loading: false })
}));

// Mock services
vi.mock('../../services/receiptService');
vi.mock('../../services/participantService');

describe('Receipts Integration Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const mockReceipts = {
        data: [
            {
                id: '1',
                participant: { firstname: 'John', lastname: 'Doe' },
                product: { name: 'Steak', category: { name: 'Food' } },
                quantity: 2,
                price: 10000,
                date: '2026-02-01T12:00:00Z'
            }
        ],
        pagination: { total: 1, pages: 1 }
    };

    const mockParticipants = [
        { id: '1', firstname: 'John', lastname: 'Doe' }
    ];

    it('should render receipts and update when month changes', async () => {
        receiptService.getReceipts.mockResolvedValue(mockReceipts);
        participantService.getParticipants.mockResolvedValue({ data: mockParticipants });

        render(
            <MemoryRouter>
                <Receipts />
            </MemoryRouter>
        );

        // Check if data appears (using partial match since date formatting might vary)
        expect(await screen.findByText(/Steak/i)).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText(/Ft 10,000/i)).toBeInTheDocument();

        // Change month
        const monthSelect = screen.getByLabelText(/Month/i);
        fireEvent.change(monthSelect, { target: { value: '3' } }); // March

        await waitFor(() => {
            expect(receiptService.getReceipts).toHaveBeenCalledWith(expect.objectContaining({
                startDate: expect.stringContaining('2026-03'),
                endDate: expect.stringContaining('2026-03')
            }));
        });
    });

    it('should clear all filters correctly', async () => {
        receiptService.getReceipts.mockResolvedValue(mockReceipts);
        participantService.getParticipants.mockResolvedValue({ data: mockParticipants });

        render(
            <MemoryRouter>
                <Receipts />
            </MemoryRouter>
        );

        const clearBtn = screen.getByText(/Clear All/i);
        fireEvent.click(clearBtn);

        await waitFor(() => {
            const calls = receiptService.getReceipts.mock.calls;
            const lastCallParams = calls[calls.length - 1][0];
            expect(lastCallParams.participantId).toBe('');
            expect(lastCallParams.productId).toBe('');
        });
    });
});
