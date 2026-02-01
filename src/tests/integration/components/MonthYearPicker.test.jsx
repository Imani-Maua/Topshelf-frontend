import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import MonthYearPicker from '../../../components/MonthYearPicker/MonthYearPicker';

describe('MonthYearPicker Component Tests', () => {
    it('should render with initial month and year', () => {
        const mockOnChange = vi.fn();

        render(
            <MonthYearPicker
                selectedMonth={2}
                selectedYear={2026}
                onChange={mockOnChange}
            />
        );

        expect(screen.getByText('Feb 2026')).toBeInTheDocument();
        expect(screen.getByText('📅')).toBeInTheDocument();
    });

    it('should toggle dropdown when clicked', () => {
        const mockOnChange = vi.fn();

        render(
            <MonthYearPicker
                selectedMonth={1}
                selectedYear={2026}
                onChange={mockOnChange}
            />
        );

        // Dropdown should not be visible initially
        expect(screen.queryByText('2026')).not.toBeInTheDocument();

        // Click to open
        const toggle = screen.getByText('Jan 2026');
        fireEvent.click(toggle);

        // Dropdown should now be visible
        expect(screen.getByText('2026')).toBeInTheDocument();
    });

    it('should display all 12 months in  dropdown', () => {
        const mockOnChange = vi.fn();

        render(
            <MonthYearPicker
                selectedMonth={1}
                selectedYear={2026}
                onChange={mockOnChange}
            />
        );

        // Open dropdown
        fireEvent.click(screen.getByText('Jan 2026'));

        // All months should be visible
        const monthButtons = screen.getAllByRole('button');
        const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        monthLabels.forEach(month => {
            expect(screen.getByText(month)).toBeInTheDocument();
        });
    });

    it('should call onChange when a month is selected', () => {
        const mockOnChange = vi.fn();

        render(
            <MonthYearPicker
                selectedMonth={1}
                selectedYear={2026}
                onChange={mockOnChange}
            />
        );

        // Open dropdown
        fireEvent.click(screen.getByText('Jan 2026'));

        // Click on March
        const monthButtons = screen.getAllByRole('button');
        const marchButton = monthButtons.find(btn => btn.textContent === 'Mar');
        fireEvent.click(marchButton);

        expect(mockOnChange).toHaveBeenCalledWith(3, 2026);
    });

    it('should navigate to previous year', () => {
        const mockOnChange = vi.fn();

        render(
            <MonthYearPicker
                selectedMonth={1}
                selectedYear={2026}
                onChange={mockOnChange}
            />
        );

        // Open dropdown
        fireEvent.click(screen.getByText('Jan 2026'));

        // Click previous year button
        const prevButton = screen.getByText('‹');
        fireEvent.click(prevButton);

        // Year should change to 2025
        expect(screen.getByText('2025')).toBeInTheDocument();
    });

    it('should navigate to next year', () => {
        const mockOnChange = vi.fn();

        render(
            <MonthYearPicker
                selectedMonth={1}
                selectedYear={2026}
                onChange={mockOnChange}
            />
        );

        // Open dropdown
        fireEvent.click(screen.getByText('Jan 2026'));

        // Click next year button
        const nextButton = screen.getByText('›');
        fireEvent.click(nextButton);

        // Year should change to 2027
        expect(screen.getByText('2027')).toBeInTheDocument();
    });

    it('should highlight the active month', () => {
        const mockOnChange = vi.fn();

        render(
            <MonthYearPicker
                selectedMonth={2}
                selectedYear={2026}
                onChange={mockOnChange}
            />
        );

        // Open dropdown
        fireEvent.click(screen.getByText('Feb 2026'));

        // Find February button
        const buttons = screen.getAllByRole('button');
        const febButton = buttons.find(btn => btn.textContent === 'Feb' && btn.classList.contains('active'));

        expect(febButton).toBeTruthy();
    });

    it('should close dropdown when clicking outside', async () => {
        const mockOnChange = vi.fn();

        const { container } = render(
            <div>
                <MonthYearPicker
                    selectedMonth={1}
                    selectedYear={2026}
                    onChange={mockOnChange}
                />
                <div data-testid="outside">Outside element</div>
            </div>
        );

        // Open dropdown
        fireEvent.click(screen.getByText('Jan 2026'));
        expect(screen.getByText('2026')).toBeInTheDocument();

        // Click outside
        const outside = screen.getByTestId('outside');
        fireEvent.mouseDown(outside);

        await waitFor(() => {
            expect(screen.queryByText('2026')).not.toBeInTheDocument();
        });
    });
});
