import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { bonusService } from '../../services/bonusService';
import { forecastService } from '../../services/forecastService';
import CSVImportModal from '../../components/CSVImportModal/CSVImportModal';
import './Bonuses.css';

const MONTHS = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
];

const Bonuses = () => {
    const location = useLocation();
    const [mode, setMode] = useState('input'); // 'input' or 'results'
    const [viewMode, setViewMode] = useState('breakdown'); // 'breakdown' or 'leaderboard'
    const [month, setMonth] = useState(location.state?.month || new Date().getMonth() + 1);
    const [year, setYear] = useState(location.state?.year ||new Date().getFullYear());
    const [totalRevenue, setTotalRevenue] = useState('');
    const [forecast, setForecast] = useState(null);
    const [loadingForecast, setLoadingForecast] = useState(false);
    const [results, setResults] = useState(null);
    const [calculating, setCalculating] = useState(false);
    const [validationErrors, setValidationErrors] = useState([]);
    const [expandedParticipants, setExpandedParticipants] = useState(new Set());
    const [showCelebration, setShowCelebration] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);

    useEffect(() => {
        loadForecast();
    }, [month, year]);

    const loadForecast = async () => {
        try {
            setLoadingForecast(true);
            const res = await forecastService.getForecastByMonthYear(month, year);
            setForecast(res.data);
        } catch (err) {
            setForecast(null);
        } finally {
            setLoadingForecast(false);
        }
    };

    const handleCalculate = async (e) => {
        e.preventDefault();

        // Frontend validation
        const errors = [];
        const revenue = parseFloat(totalRevenue);
        if (isNaN(revenue) || revenue < 0) {
            errors.push('Total revenue must be a non-negative number');
        }
        if (!forecast) {
            errors.push('No forecast exists for this month/year. Create one first.');
        }

        if (errors.length > 0) {
            setValidationErrors(errors);
            return;
        }

        try {
            setCalculating(true);
            setValidationErrors([]);
            const res = await bonusService.calculateBonuses(month, year, revenue);
            setResults(res.data);
            setMode('results');

            // Trigger celebration if forecast met
            if (res.data.forecastMet) {
                setShowCelebration(true);
                triggerConfetti();
                setTimeout(() => setShowCelebration(false), 5000);
            }
        } catch (err) {
            const backendErrors = err.response?.data?.details || [err.response?.data?.error || err.response?.data?.message || 'Calculation failed'];
            setValidationErrors(backendErrors);
        } finally {
            setCalculating(false);
        }
    };

    const triggerConfetti = () => {
        const colors = ['#4A90E2', '#34A853', '#FFA940', '#FF4D4F', '#9C27B0'];
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.animationDelay = Math.random() * 0.5 + 's';
                document.body.appendChild(confetti);
                setTimeout(() => confetti.remove(), 3000);
            }, i * 30);
        }
    };

    const handleNewCalculation = () => {
        setMode('input');
        setResults(null);
        setValidationErrors([]);
        setExpandedParticipants(new Set());
        setShowCelebration(false);
    };

    const toggleParticipant = (participantId) => {
        const newExpanded = new Set(expandedParticipants);
        if (newExpanded.has(participantId)) {
            newExpanded.delete(participantId);
        } else {
            newExpanded.add(participantId);
        }
        setExpandedParticipants(newExpanded);
    };

    const getForecastStatus = () => {
        if (!forecast) return 'no-forecast';
        const revenue = parseFloat(totalRevenue);
        if (isNaN(revenue)) return 'no-forecast';
        const threshold = forecast.targetAmount * forecast.threshold;
        return revenue >= threshold ? 'met' : 'not-met';
    };

    const getStatusMessage = () => {
        const status = getForecastStatus();
        if (status === 'no-forecast') return '⚠️ No forecast set for this month';
        if (status === 'met') return '✅ Forecast Met - Bonuses Will Be Paid';
        return '⚠️ Forecast Not Met - No Bonuses';
    };

    const getProgressPercentage = () => {
        if (!forecast || !totalRevenue) return 0;
        const revenue = parseFloat(totalRevenue);
        return Math.min((revenue / forecast.targetAmount) * 100, 100);
    };

    const getThresholdPercentage = () => {
        if (!forecast) return 0;
        return forecast.threshold * 100;
    };

    const getCategoryPerformance = () => {
        if (!results || !results.payouts) return [];
        const categoryTotals = {};
        results.payouts.forEach(payout => {
            payout.breakdown.forEach(cat => {
                if (!categoryTotals[cat.category]) {
                    categoryTotals[cat.category] = 0;
                }
                categoryTotals[cat.category] += cat.bonus;
            });
        });
        const maxBonus = Math.max(...Object.values(categoryTotals), 1);
        return Object.entries(categoryTotals)
            .map(([category, bonus]) => ({
                category,
                bonus,
                percentage: (bonus / maxBonus) * 100
            }))
            .sort((a, b) => b.bonus - a.bonus);
    };

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    const getRankIcon = (rank) => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return null;
    };

    const getHighestEarner = () => {
        if (!results || !results.payouts || results.payouts.length === 0) return null;
        return results.payouts.reduce((max, p) => p.amount > max.amount ? p : max, results.payouts[0]);
    };

    const getAverageBonus = () => {
        if (!results || !results.payouts || results.payouts.length === 0) return 0;
        const total = results.payouts.reduce((sum, p) => sum + p.amount, 0);
        return total / results.payouts.length;
    };

    const monthName = MONTHS.find(m => m.value === month)?.label || '';

    return (
        <div className="bonuses-container">
            <div className="bonuses-header">
                <div>
                    <h2>Bonus Calculations</h2>
                    <p>Calculate monthly bonuses based on sales performance and tier rules.</p>
                </div>
                <button className="btn-import-csv" onClick={() => setShowImportModal(true)}>
                    📊 Import Receipts
                </button>
            </div>

            {mode === 'input' && (
                <>
                    {validationErrors.length > 0 && (
                        <div className="validation-error">
                            {validationErrors.map((err, idx) => (
                                <div key={idx}>• {err}</div>
                            ))}
                        </div>
                    )}

                    <div className="calculation-form-container">
                        <div className="form-section">
                            <h3>Calculation Parameters</h3>
                            <form onSubmit={handleCalculate}>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Month</label>
                                        <select value={month} onChange={(e) => setMonth(parseInt(e.target.value))}>
                                            {MONTHS.map(m => (
                                                <option key={m.value} value={m.value}>{m.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Year</label>
                                        <select value={year} onChange={(e) => setYear(parseInt(e.target.value))}>
                                            {[2024, 2025, 2026, 2027, 2028].map(y => (
                                                <option key={y} value={y}>{y}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Total Revenue</label>
                                    <div className="revenue-input-wrapper">
                                        <span className="revenue-prefix">Ft</span>
                                        <input
                                            type="number"
                                            className="revenue-input"
                                            required
                                            min="0"
                                            step="0.01"
                                            value={totalRevenue}
                                            onChange={(e) => setTotalRevenue(e.target.value)}
                                            placeholder="50000"
                                        />
                                    </div>
                                </div>

                                {forecast && totalRevenue && (
                                    <div className="progress-section">
                                        <div className="progress-header">
                                            <span className="progress-label">Revenue Progress</span>
                                            <span className="progress-values">
                                                Ft {parseFloat(totalRevenue).toLocaleString()} / Ft {forecast.targetAmount.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="progress-bar-container">
                                            <div
                                                className="progress-bar-fill"
                                                style={{ width: `${getProgressPercentage()}%` }}
                                            >
                                                {getProgressPercentage().toFixed(0)}%
                                            </div>
                                            <div
                                                className="progress-threshold-marker"
                                                style={{ left: `${getThresholdPercentage()}%` }}
                                            >
                                                <span className="progress-threshold-label">
                                                    Threshold ({Math.round(forecast.threshold * 100)}%)
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className="btn-calculate"
                                    disabled={!forecast || calculating || loadingForecast || getForecastStatus() === 'not-met'}
                                >
                                    {calculating ? 'Calculating...' : 'Calculate Bonuses'}
                                </button>
                            </form>
                        </div>

                        <div className="forecast-preview">
                            <h3>Forecast for {monthName} {year}</h3>
                            {loadingForecast ? (
                                <p>Loading forecast...</p>
                            ) : forecast ? (
                                <>
                                    <div className="forecast-info">
                                        <div className="forecast-row">
                                            <span className="forecast-label">Target Revenue</span>
                                            <span className="forecast-value">Ft {forecast.targetAmount.toLocaleString()}</span>
                                        </div>
                                        <div className="forecast-row">
                                            <span className="forecast-label">Threshold</span>
                                            <span className="forecast-value">{Math.round(forecast.threshold * 100)}%</span>
                                        </div>
                                        <div className="forecast-row">
                                            <span className="forecast-label">Minimum Required</span>
                                            <span className="forecast-value">
                                                Ft {(forecast.targetAmount * forecast.threshold).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                    {totalRevenue && (
                                        <div className={`status-indicator ${getForecastStatus()}`}>
                                            {getStatusMessage()}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="status-indicator no-forecast">
                                    ⚠️ No forecast set for {monthName} {year}. Create one in the Forecasts page.
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}

            {mode === 'results' && results && (
                <div className="results-container">
                    {showCelebration && results.forecastMet && (
                        <div className="celebration-banner">
                            <span className="icon">🎉</span>
                            <div className="message">
                                <h4>Congratulations! Forecast Met!</h4>
                                <p>Total bonuses: Ft {results.payouts.reduce((sum, p) => sum + p.amount, 0).toFixed(2)} to be distributed</p>
                            </div>
                        </div>
                    )}

                    <div className="results-header">
                        <h3>Calculation Results for {monthName} {year}</h3>
                        <button className="btn-new-calculation" onClick={handleNewCalculation}>
                            New Calculation
                        </button>
                    </div>

                    <div className="summary-cards enhanced">
                        <div className="summary-card">
                            <span className="summary-label">Forecast Status</span>
                            <span className={`summary-value ${results.forecastMet ? 'success' : 'warning'}`}>
                                {results.forecastMet ? '✅ Met' : '⚠️ Not Met'}
                            </span>
                            <div className="stat-detail">
                                Target: Ft {results.revenues.target.toLocaleString()}
                            </div>
                        </div>
                        <div className="summary-card">
                            <span className="summary-label">Total Revenue</span>
                            <span className="summary-value">Ft {results.revenues.total.toLocaleString()}</span>
                            <div className="stat-detail">
                                {((results.revenues.total / results.revenues.target) * 100).toFixed(1)}% of target
                            </div>
                        </div>
                        <div className="summary-card">
                            <span className="summary-label">Total Bonuses</span>
                            <span className="summary-value success">
                                Ft {results.payouts.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
                            </span>
                            <div className="stat-detail">
                                Avg: Ft {getAverageBonus().toFixed(2)} per participant
                            </div>
                        </div>
                        <div className="summary-card">
                            <span className="summary-label">Participants</span>
                            <span className="summary-value">
                                {results.payouts.filter(p => p.amount > 0).length}/{results.payouts.length}
                            </span>
                            <div className="stat-detail">
                                {getHighestEarner() && `Top: ${getHighestEarner().participant.name}`}
                            </div>
                        </div>
                        <div className="summary-card large">
                            <span className="summary-label">Highest Earner</span>
                            <span className="summary-value success">
                                {getHighestEarner() ? `Ft ${getHighestEarner().amount.toFixed(2)}` : '$0.00'}
                            </span>
                            <div className="stat-detail">
                                {getHighestEarner()?.participant.name}
                            </div>
                        </div>
                    </div>

                    {/* Revenue Breakdown */}
                    {results.revenues && (
                        <div className="revenue-breakdown-card">
                            <h3>Revenue Breakdown</h3>
                            <div className="revenue-row">
                                <span>Total Restaurant Revenue:</span>
                                <span className="revenue-value">Ft {results.revenues.total?.toLocaleString() || '0'}</span>
                            </div>
                            {results.revenues.bonusEligible !== undefined && (
                                <>
                                    <div className="revenue-row highlight">
                                        <span>Bonus-Eligible Revenue:</span>
                                        <span className="revenue-value">Ft {results.revenues.bonusEligible.toLocaleString()}</span>
                                    </div>
                                    <div className="revenue-row muted">
                                        <span>Non-Eligible Revenue:</span>
                                        <span className="revenue-value">
                                            Ft {(results.revenues.total - results.revenues.bonusEligible).toLocaleString()}
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* Data Completeness Warning */}
                    {results.dataCompleteness && results.dataCompleteness.missingDays && results.dataCompleteness.missingDays.length > 0 && (
                        <div className="data-completeness-warning">
                            <div className="warning-header">
                                <span className="icon">⚠️</span>
                                <h4>Data Completeness Notice</h4>
                            </div>
                            <p>
                                Receipt data available for <strong>{results.dataCompleteness.daysWithData}/{results.dataCompleteness.totalDays} days</strong> ({results.dataCompleteness.completenessPercentage}%)
                            </p>
                            <p className="date-range">
                                Date range: {results.dataCompleteness.startDate} to {results.dataCompleteness.endDate}
                            </p>
                            {results.dataCompleteness.missingDays.length <= 10 ? (
                                <details>
                                    <summary>Missing {results.dataCompleteness.missingDays.length} days</summary>
                                    <div className="missing-days-list">
                                        {results.dataCompleteness.missingDays.map(day => (
                                            <span key={day} className="missing-day">{day}</span>
                                        ))}
                                    </div>
                                </details>
                            ) : (
                                <p className="missing-count">
                                    Missing {results.dataCompleteness.missingDays.length} days of data
                                </p>
                            )}
                        </div>
                    )}

                    {getCategoryPerformance().length > 0 && (
                        <div className="category-performance">
                            <h3>Category Performance</h3>
                            <div className="category-bars">
                                {getCategoryPerformance().map((cat, idx) => (
                                    <div key={idx} className="category-bar-row">
                                        <span className="category-bar-label">{cat.category}</span>
                                        <div className="category-bar-track">
                                            <div
                                                className="category-bar-fill"
                                                style={{ width: `${cat.percentage}%` }}
                                            >
                                                {cat.percentage > 20 && `${cat.percentage.toFixed(0)}%`}
                                            </div>
                                        </div>
                                        <span className="category-bar-value">Ft {cat.bonus.toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="view-toggle">
                        <button
                            className={`toggle-btn ${viewMode === 'breakdown' ? 'active' : ''}`}
                            onClick={() => setViewMode('breakdown')}
                        >
                            Detailed Breakdown
                        </button>
                        <button
                            className={`toggle-btn ${viewMode === 'leaderboard' ? 'active' : ''}`}
                            onClick={() => setViewMode('leaderboard')}
                        >
                            Leaderboard
                        </button>
                    </div>

                    {viewMode === 'leaderboard' ? (
                        <div className="leaderboard-table">
                            {results.payouts.map((payout, index) => {
                                const rank = index + 1;
                                const rankIcon = getRankIcon(rank);
                                const categoryCount = payout.breakdown.length;
                                return (
                                    <div key={payout.participant.id} className="leaderboard-row">
                                        <div className={rankIcon ? 'rank-badge' : 'rank-number'}>
                                            {rankIcon || rank}
                                        </div>
                                        <div className="participant-info">
                                            <div className="participant-avatar">
                                                {getInitials(payout.participant.name)}
                                            </div>
                                            <span className="participant-name">{payout.participant.name}</span>
                                        </div>
                                        <div className="leaderboard-bonus">
                                           Ft {payout.amount.toFixed(2)}
                                        </div>
                                        <div className="leaderboard-categories">
                                            {categoryCount} {categoryCount === 1 ? 'category' : 'categories'}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="breakdown-table">
                            {results.payouts.map((payout) => {
                                const isExpanded = expandedParticipants.has(payout.participant.id);
                                return (
                                    <div key={payout.participant.id} className="participant-row">
                                        <div
                                            className="participant-header"
                                            onClick={() => toggleParticipant(payout.participant.id)}
                                        >
                                            <span className="participant-name">{payout.participant.name}</span>
                                            <span className={`participant-bonus ${payout.amount === 0 ? 'zero' : ''}`}>
                                               Ft {payout.amount.toFixed(2)}
                                            </span>
                                            <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>
                                                ▼
                                            </span>
                                        </div>

                                        {isExpanded && (
                                            <div className="participant-details">
                                                {payout.breakdown.map((categoryBreakdown, idx) => (
                                                    <div key={idx} className="category-breakdown">
                                                        <div className="category-header">
                                                            <span className="category-name">{categoryBreakdown.category}</span>
                                                            <span className="category-bonus">
                                                                Ft {categoryBreakdown.bonus.toFixed(2)}
                                                            </span>
                                                        </div>

                                                        <div className="items-list">
                                                            {categoryBreakdown.items.map((item, itemIdx) => (
                                                                <div
                                                                    key={itemIdx}
                                                                    className={`item-row ${item.qualified ? 'qualified' : 'not-qualified'}`}
                                                                >
                                                                    <div className="item-details">
                                                                        <div className="item-product">
                                                                            {item.productName || 'Category Total'}
                                                                            {item.products && (
                                                                                <div className="products-list">
                                                                                    {item.products.join(', ')}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        <div className="item-value">
                                                                            {item.quantity} items
                                                                        </div>
                                                                        <div className="item-value">
                                                                            Ft {item.revenue.toFixed(2)}
                                                                        </div>
                                                                        <div>
                                                                            {item.tierQualified ? (
                                                                                <span className="tier-badge">
                                                                                    {item.tierQualified} → {item.bonusPercentage}%
                                                                                </span>
                                                                            ) : (
                                                                                <span className="item-value">—</span>
                                                                            )}
                                                                        </div>
                                                                        <div className="item-value">
                                                                            Ft {item.bonus.toFixed(2)}
                                                                        </div>
                                                                    </div>
                                                                    {item.reason && (
                                                                        <div className="item-reason">
                                                                            {item.reason}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            <CSVImportModal
                isOpen={showImportModal}
                onClose={() => setShowImportModal(false)}
            />
        </div>
    );
};

export default Bonuses;
