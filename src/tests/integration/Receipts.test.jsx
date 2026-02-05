import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import Receipts from '../../pages/Receipts/Receipts';
import { receiptService } from '../../services/receiptService';
import { participantService } from '../../services/participantService';
import { productService } from '../../services/productService';
import { MemoryRouter } from 'react-router-dom';

// Mock auth context
vi.mock('../../context/AuthContext', () => ({
    useAuth: () => ({ user: { name: 'Test User' }, loading: false })
}));

// Mock authService
vi.mock('../../services/authService', () => ({
    authService: {
        canPerformOperations: () => true,  // Mock as operations user for tests
        getCurrentUser: () => ({ name: 'Test User', role: 'operations' })
    }
}));

// Mock services
vi.mock('../../services/receiptService');
vi.mock('../../services/participantService');
vi.mock('../../services/productService');

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

    const mockProducts = [
        { id: '1', name: 'Steak', category: { name: 'Food' } }
    ];

    it('should render receipts correctly', async () => {
        receiptService.getReceipts.mockResolvedValue(mockReceipts);
        participantService.getParticipants.mockResolvedValue({ data: mockParticipants });
        productService.getProducts.mockResolvedValue({ data: mockProducts });

        render(
            <MemoryRouter>
                <Receipts />
            </MemoryRouter>
        );

        // Check if data appears
        expect(await screen.findByText(/Steak/i)).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText(/Ft 10,000/i)).toBeInTheDocument();
    });

    it('should show read-only badge', async () => {
        receiptService.getReceipts.mockResolvedValue(mockReceipts);
        participantService.getParticipants.mockResolvedValue({ data: mockParticipants });
        productService.getProducts.mockResolvedValue({ data: mockProducts });

        render(
            <MemoryRouter>
                <Receipts />
            </MemoryRouter>
        );

        // Check if read-only badge appears (receipts page is always read-only)
        await waitFor(() => {
            expect(screen.getByText(/READ-ONLY/i)).toBeInTheDocument();
        });
    });
});
