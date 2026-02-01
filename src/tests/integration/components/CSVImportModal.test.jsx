import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import CSVImportModal from '../../../components/CSVImportModal/CSVImportModal';
import { receiptService } from '../../../services/receiptService';

vi.mock('../../../services/receiptService');

describe('CSVImportModal Component Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const mockOnClose = vi.fn();

    it('should not render when isOpen is false', () => {
        const { container } = render(
            <CSVImportModal isOpen={false} onClose={mockOnClose} />
        );
        expect(container.firstChild).toBeNull();
    });

    it('should render when isOpen is true', () => {
        render(<CSVImportModal isOpen={true} onClose={mockOnClose} />);
        expect(screen.getByText(/Import Receipt Data/i)).toBeInTheDocument();
    });

    it('should call onClose when close button is clicked', () => {
        render(<CSVImportModal isOpen={true} onClose={mockOnClose} />);

        const closeBtn = screen.getByText('×');
        fireEvent.click(closeBtn);

        expect(mockOnClose).toHaveBeenCalled();
    });

    it('should enable month filtering', () => {
        render(<CSVImportModal isOpen={true} onClose={mockOnClose} />);

        const checkbox = screen.getByRole('checkbox');
        fireEvent.click(checkbox);

        // Month and year selects should appear
        expect(screen.getAllByRole('combobox')).toHaveLength(2);
    });

    it('should show file input field', () => {
        render(<CSVImportModal isOpen={true} onClose={mockOnClose} />);

        // Verify file input exists
        const input = document.querySelector('input[type="file"]');
        expect(input).toBeTruthy();
    });

    it('should show upload button', () => {
        render(<CSVImportModal isOpen={true} onClose={mockOnClose} />);

        const uploadBtn = screen.getByText('Upload & Process');
        expect(uploadBtn).toBeInTheDocument();
    });

    it('should display modal title', () => {
        render(<CSVImportModal isOpen={true} onClose={mockOnClose} />);

        expect(screen.getByText(/Import Receipt Data/i)).toBeInTheDocument();
        expect(screen.getByText(/Upload a CSV file/i)).toBeInTheDocument();
    });

    it('should show month filtering checkbox', () => {
        render(<CSVImportModal isOpen={true} onClose={mockOnClose} />);

        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).toBeInTheDocument();
    });
});
