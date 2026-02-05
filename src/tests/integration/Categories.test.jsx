import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import Categories from '../../pages/Categories/Categories';
import { categoryService } from '../../services/categoryService';
import { MemoryRouter } from 'react-router-dom';

// Mock the auth context
vi.mock('../../context/AuthContext', () => ({
    useAuth: () => ({ user: { name: 'Test User' }, loading: false })
}));

// Mock authService
vi.mock('../../services/authService', () => ({
    authService: {
        canPerformOperations: () => true  // Mock as operations user for tests
    }
}));

// Mock categoryService
vi.mock('../../services/categoryService');

describe('Categories Integration Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const mockCategories = [
        {
            id: 'cat1',
            name: 'Cocktails',
            mode: 'PER_CATEGORY',
            tierRules: [
                { id: 'tier1', minQuantity: 10, bonusPercentage: 5 }
            ]
        }
    ];

    it('should render categories list', async () => {
        categoryService.getCategories.mockResolvedValue({ data: mockCategories });

        render(
            <MemoryRouter>
                <Categories />
            </MemoryRouter>
        );

        expect(await screen.findByText('Cocktails')).toBeInTheDocument();
        expect(screen.getByText('PER CATEGORY')).toBeInTheDocument();
    });

    it('should allow adding a new tier rule correctly (functional state test)', async () => {
        categoryService.getCategories.mockResolvedValue({ data: mockCategories });

        render(
            <MemoryRouter>
                <Categories />
            </MemoryRouter>
        );

        // Open edit modal
        const editBtn = await screen.findByTitle('Edit Category');
        fireEvent.click(editBtn);

        // Check if "Add Tier" exists and click it
        const addTierBtn = screen.getByText(/Add Tier/i);
        fireEvent.click(addTierBtn);

        // Verify that a new tier row appeared
        // Initial had 1, now should have 2
        const rows = screen.getAllByLabelText(/Min Quantity/i);
        expect(rows.length).toBe(2);
    });

    it('should allow clearing a numeric input (UX fix verification)', async () => {
        categoryService.getCategories.mockResolvedValue({ data: mockCategories });

        render(
            <MemoryRouter>
                <Categories />
            </MemoryRouter>
        );

        // Open edit modal
        const editBtn = await screen.findByTitle('Edit Category');
        fireEvent.click(editBtn);

        // Find a numeric input (minQuantity for the first tier)
        const minQtyInput = screen.getByDisplayValue('10');

        // Clear the input
        fireEvent.change(minQtyInput, { target: { value: '' } });

        // Verify it STAYS empty (this tests our newValue === '' ? '' : parseInt(value) logic)
        expect(minQtyInput.value).toBe('');
    });
});
