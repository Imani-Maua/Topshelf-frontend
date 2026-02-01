import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import MetricCard from '../../../components/MetricCard';

describe('MetricCard Component Tests', () => {
    it('should render with all props', () => {
        render(
            <MetricCard
                label="Total Participants"
                value="15"
                icon="👥"
                color="#4A90E2"
            />
        );

        expect(screen.getByText('Total Participants')).toBeInTheDocument();
        expect(screen.getByText('15')).toBeInTheDocument();
        expect(screen.getByText('👥')).toBeInTheDocument();
    });

    it('should apply custom border color', () => {
        const { container } = render(
            <MetricCard
                label="Revenue"
                value="Ft 50,000"
                icon="💰"
                color="#34A853"
            />
        );

        const card = container.querySelector('.metric-card');
        expect(card).toHaveStyle({ borderLeft: '6px solid #34A853' });
    });

    it('should handle large numbers', () => {
        render(
            <MetricCard
                label="Estimated Payout"
                value="Ft 1,250,500"
                icon="💸"
                color="#FFA940"
            />
        );

        expect(screen.getByText('Ft 1,250,500')).toBeInTheDocument();
    });

    it('should render icon as emoji', () => {
        render(
            <MetricCard
                label="Test"
                value="100%"
                icon="🎯"
                color="#4A90E2"
            />
        );

        expect(screen.getByText('🎯')).toBeInTheDocument();
    });

    it('should display percentage values', () => {
        render(
            <MetricCard
                label="Threshold Reached"
                value="85%"
                icon="📊"
                color="#4CAF50"
            />
        );

        expect(screen.getByText('85%')).toBeInTheDocument();
    });
});
