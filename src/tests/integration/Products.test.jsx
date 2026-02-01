import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import Products from '../../pages/Products/Products';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { MemoryRouter } from 'react-router-dom';

// Mock auth context
vi.mock('../../context/AuthContext', () => ({
    useAuth: () => ({ user: { name: 'Test User' }, loading: false })
}));

// Mock services
vi.mock('../../services/productService');
vi.mock('../../services/categoryService');

describe('Products Integration Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const mockProducts = [
        { id: '1', name: 'Wagyu Ribeye', price: 15000, categoryId: 'cat1', bonusEligible: true, category: { name: 'Steaks' } },
        { id: '2', name: 'Margarita', price: 3500, categoryId: 'cat2', bonusEligible: false, category: { name: 'Cocktails' } }
    ];

    const mockCategories = [
        { id: 'cat1', name: 'Steaks' },
        { id: 'cat2', name: 'Cocktails' }
    ];

    it('should render products list and filter by category', async () => {
        productService.getProducts.mockResolvedValue({ data: mockProducts });
        categoryService.getCategories.mockResolvedValue({ data: mockCategories });

        render(
            <MemoryRouter>
                <Products />
            </MemoryRouter>
        );

        // Check if products appear
        expect(await screen.findByText('Wagyu Ribeye')).toBeInTheDocument();
        expect(screen.getByText('Margarita')).toBeInTheDocument();
        expect(screen.getByText(/Ft 15000\.00/i)).toBeInTheDocument();

        // Test category filter
        const filterSelect = screen.getByDisplayValue(/all categories/i);
        fireEvent.change(filterSelect, { target: { value: 'cat1' } });

        expect(screen.getByText('Wagyu Ribeye')).toBeInTheDocument();
        expect(screen.queryByText('Margarita')).not.toBeInTheDocument();
    });

    it('should handle product deletion correctly', async () => {
        productService.getProducts.mockResolvedValue({ data: mockProducts });
        categoryService.getCategories.mockResolvedValue({ data: mockCategories });
        productService.deleteProduct.mockResolvedValue({ success: true });

        // Mock window.confirm
        vi.stubGlobal('confirm', vi.fn(() => true));

        render(
            <MemoryRouter>
                <Products />
            </MemoryRouter>
        );

        const deleteBtns = await screen.findAllByRole('button', { name: /🗑️/i });
        fireEvent.click(deleteBtns[0]);

        expect(window.confirm).toHaveBeenCalled();
        expect(productService.deleteProduct).toHaveBeenCalledWith('1');
    });
});
