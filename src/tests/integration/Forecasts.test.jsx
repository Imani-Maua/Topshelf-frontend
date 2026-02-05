import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import Forecasts from '../../pages/Forecasts/Forecasts';
import { forecastService } from '../../services/forecastService';
import { MemoryRouter } from 'react-router-dom';

// Mock auth context
vi.mock('../../context/AuthContext', () => ({
    useAuth: () => ({ user: { name: 'Test User' }, loading: false })
}));

// Mock authService
vi.mock('../../services/authService', () => ({
    authService: {
        canPerformOperations: () => true  // Mock as operations user for tests
    }
}));

// Mock forecastService
vi.mock('../../services/forecastService');

describe('Forecasts Integration Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render forecasts calendar', async () => {
        forecastService.getForecasts.mockResolvedValue({
            data: [{ id: '1', targetAmount: 50000, month: 2, year: 2026, threshold: 0.9 }]
        });

        render(
            <MemoryRouter>
                <Forecasts />
            </MemoryRouter>
        );

        // Wait for page to load
        expect(await screen.findByText(/Revenue Forecasts/i)).toBeInTheDocument();
        expect(screen.getByText(/February/i)).toBeInTheDocument();

        // Check if forecast data appears in the calendar
        expect(screen.getByText(/Ft50,000/i)).toBeInTheDocument();
    });
});
