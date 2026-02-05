import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import Dashboard from '../../pages/Dashboard/Dashboard';
import { dashboardService } from '../../services/dashboardService';
import { MemoryRouter } from 'react-router-dom';

// Mock the auth context
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

// Mock the dashboard service
vi.mock('../../services/dashboardService');

describe('Dashboard Integration Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const mockDashboardData = {
        metrics: {
            totalParticipants: 13,
            thresholdReached: '85%',
            earningCount: 5,
            estimatedPayout: 'Ft 1,250,500'
        },
        revenue: {
            current: 42500,
            target: 50000,
            percentage: 85
        },
        performanceData: [
            { name: 'Amara', revenue: 15000 },
            { name: 'Chen', revenue: 12000 }
        ],
        salesData: [
            { name: 'Steaks', value: 25000 },
            { name: 'Wine', value: 17500 }
        ],
        topPerformers: [
            { participant: { name: 'Amara Ochieng' }, amount: 250000 },
            { participant: { name: 'Chen Wei' }, amount: 180000 }
        ]
    };

    it('should show loading state initially', () => {
        // Return a promise that doesn't resolve immediately
        dashboardService.getDashboardData.mockReturnValue(new Promise(() => { }));

        render(
            <MemoryRouter>
                <Dashboard />
            </MemoryRouter>
        );

        expect(screen.getByText(/Loading Dashboard Intelligence/i)).toBeInTheDocument();
    });

    it('should render metrics and charts when data is loaded', async () => {
        dashboardService.getDashboardData.mockResolvedValue(mockDashboardData);

        render(
            <MemoryRouter>
                <Dashboard />
            </MemoryRouter>
        );

        // Wait for data to load
        await waitFor(() => {
            expect(screen.queryByText(/Gathering intelligence/i)).not.toBeInTheDocument();
        });

        // Verify metrics
        expect(screen.getByText('13')).toBeInTheDocument(); // Total Participants
        expect(screen.getByText('85%')).toBeInTheDocument(); // Threshold
        expect(screen.getByText('Ft 1,250,500')).toBeInTheDocument(); // Estimated Payout

        // Verify Bonus Pool alert desc
        expect(screen.getByText('5/13 participants earning')).toBeInTheDocument();

        // Verify Top Performers
        expect(screen.getByText('Amara Ochieng')).toBeInTheDocument();
        expect(screen.getByText('+ Ft 250,000')).toBeInTheDocument();
    });

    it('should show error state if data loading fails', async () => {
        dashboardService.getDashboardData.mockRejectedValue(new Error('API Error'));

        render(
            <MemoryRouter>
                <Dashboard />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(/Failed to load dashboard data/i)).toBeInTheDocument();
        });
    });
});
