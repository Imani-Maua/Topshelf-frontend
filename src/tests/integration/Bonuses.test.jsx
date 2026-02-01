import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import Bonuses from '../../pages/Bonuses/Bonuses';
import { bonusService } from '../../services/bonusService';
import { participantService } from '../../services/participantService';
import { forecastService } from '../../services/forecastService';
import { MemoryRouter } from 'react-router-dom';

// Mock auth context
vi.mock('../../context/AuthContext', () => ({
    useAuth: () => ({ user: { name: 'Test User' }, loading: false })
}));

// Mock services
vi.mock('../../services/bonusService');
vi.mock('../../services/participantService');
vi.mock('../../services/forecastService');

describe('Bonuses Integration Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const mockBonusData = {
        forecastMet: true,
        revenues: {
            total: 100000,
            target: 80000,
            forecast: 80000
        },
        metrics: {
            totalRevenue: 100000,
            estimatedPayout: 5000,
            earningCount: 2,
            topCategory: 'Steaks'
        },
        payouts: [
            { id: '1', participant: { name: 'John Doe', firstname: 'John', lastname: 'Doe' }, amount: 3000, potentialBonus: 3000, breakdown: [] },
            { id: '2', participant: { name: 'Jane Smith', firstname: 'Jane', lastname: 'Smith' }, amount: 2000, potentialBonus: 2000, breakdown: [] }
        ]
    };

    it('should calculate and display bonuses correctly', async () => {
        bonusService.calculateBonuses.mockResolvedValue({ data: mockBonusData });
        forecastService.getForecastByMonthYear.mockResolvedValue({
            data: { targetAmount: 80000, threshold: 0.9, month: 2, year: 2026 }
        });

        render(
            <MemoryRouter>
                <Bonuses />
            </MemoryRouter>
        );

        const revInput = await screen.findByLabelText(/Total Revenue/i);
        fireEvent.change(revInput, { target: { value: '100000' } });

        const calcBtn = screen.getByText(/Calculate Bonuses/i);
        fireEvent.click(calcBtn);

        // Wait for results and check if participant names appear
        await waitFor(() => {
            const johnElements = screen.getAllByText('John Doe');
            const janeElements = screen.getAllByText('Jane Smith');
            expect(johnElements.length).toBeGreaterThan(0);
            expect(janeElements.length).toBeGreaterThan(0);
        });
    });
});
