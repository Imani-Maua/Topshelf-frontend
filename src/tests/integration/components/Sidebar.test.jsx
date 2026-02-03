import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from '../../../components/Sidebar';

// Mock the auth context
vi.mock('../../../context/AuthContext', () => ({
    useAuth: () => ({
        user: { firstname: 'Test', lastname: 'User', role: 'user' },
        isLoading: false,
        logout: vi.fn()
    })
}));

describe('Sidebar Component Tests', () => {
    it('should render all navigation links', () => {
        render(
            <MemoryRouter>
                <Sidebar />
            </MemoryRouter>
        );

        expect(screen.getByText('TopShelf')).toBeInTheDocument();
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Participants')).toBeInTheDocument();
        expect(screen.getByText('Categories')).toBeInTheDocument();
        expect(screen.getByText('Products')).toBeInTheDocument();
        expect(screen.getByText('Forecasts')).toBeInTheDocument();
        expect(screen.getByText('Bonuses')).toBeInTheDocument();
        expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    it('should render navigation icons', () => {
        render(
            <MemoryRouter>
                <Sidebar />
            </MemoryRouter>
        );

        // Check for emoji icons (matching actual Sidebar.jsx)
        expect(screen.getByText('🏠')).toBeInTheDocument(); // Dashboard
        expect(screen.getByText('👤')).toBeInTheDocument(); // Participants
        expect(screen.getByText('📁')).toBeInTheDocument(); // Categories
        expect(screen.getByText('🛍️')).toBeInTheDocument(); // Products
        expect(screen.getByText('📊')).toBeInTheDocument(); // Forecasts
        expect(screen.getByText('🎁')).toBeInTheDocument(); // Bonuses
        expect(screen.getByText('⚙️')).toBeInTheDocument(); // Settings
    });

    it('should have correct navigation links', () => {
        render(
            <MemoryRouter>
                <Sidebar />
            </MemoryRouter>
        );

        const dashboardLink = screen.getByText('Dashboard').closest('a');
        const participantsLink = screen.getByText('Participants').closest('a');
        const categoriesLink = screen.getByText('Categories').closest('a');

        expect(dashboardLink).toHaveAttribute('href', '/');
        expect(participantsLink).toHaveAttribute('href', '/participants');
        expect(categoriesLink).toHaveAttribute('href', '/categories');
    });

    it('should highlight active route', () => {
        render(
            <MemoryRouter initialEntries={['/participants']}>
                <Sidebar />
            </MemoryRouter>
        );

        const participantsLink = screen.getByText('Participants').closest('a');
        expect(participantsLink).toHaveClass('active');
    });

    it('should render user info section', () => {
        render(
            <MemoryRouter>
                <Sidebar />
            </MemoryRouter>
        );

        // User name is rendered as "firstname lastname"
        expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    it('should render all 7 main navigation items', () => {
        const { container } = render(
            <MemoryRouter>
                <Sidebar />
            </MemoryRouter>
        );

        const navLinks = container.querySelectorAll('.nav-item');
        expect(navLinks.length).toBe(7); // Dashboard, Participants, Categories, Products, Forecasts, Bonuses, Settings (Users is admin-only, not shown for regular users)
    });
});
