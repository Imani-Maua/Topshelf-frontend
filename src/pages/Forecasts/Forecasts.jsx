import React, { useState, useEffect } from 'react';
import { forecastService } from '../../services/forecastService';
import { authService } from '../../services/authService';
import './Forecasts.css';

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const Forecasts = () => {
    const [forecasts, setForecasts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [currentForecast, setCurrentForecast] = useState({
        month: 1,
        year: selectedYear,
        targetAmount: '',
        threshold: 90
    });
    const [isEditing, setIsEditing] = useState(false);
    const [validationErrors, setValidationErrors] = useState([]);

    useEffect(() => {
        loadForecasts();
    }, []);

    const loadForecasts = async () => {
        try {
            setLoading(true);
            const res = await forecastService.getForecasts();
            setForecasts(res.data || []);
        } catch (err) {
            console.error('Failed to load forecasts');
        } finally {
            setLoading(false);
        }
    };

    const getForecastForMonth = (month, year) => {
        return forecasts.find(f => f.month === month && f.year === year);
    };

    const openModal = (month, forecast = null) => {
        if (forecast) {
            setCurrentForecast({
                ...forecast,
                threshold: Math.round(forecast.threshold * 100),
                targetAmount: forecast.targetAmount.toString()
            });
            setIsEditing(true);
        } else {
            setCurrentForecast({
                month,
                year: selectedYear,
                targetAmount: '',
                threshold: 90
            });
            setIsEditing(false);
        }
        setValidationErrors([]);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setValidationErrors([]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Frontend validation
        const errors = [];
        const targetAmount = parseFloat(currentForecast.targetAmount);
        if (isNaN(targetAmount) || targetAmount <= 0) {
            errors.push('Target amount must be a positive number');
        }

        if (errors.length > 0) {
            setValidationErrors(errors);
            return;
        }

        try {
            const forecastData = {
                month: currentForecast.month,
                year: currentForecast.year,
                targetAmount: parseFloat(currentForecast.targetAmount),
                threshold: currentForecast.threshold / 100 // Convert percentage to decimal
            };

            if (isEditing) {
                await forecastService.updateForecast(currentForecast.id, forecastData);
            } else {
                await forecastService.createForecast(forecastData);
            }
            loadForecasts();
            closeModal();
        } catch (err) {
            const backendErrors = err.response?.data?.details || [err.response?.data?.error || 'Operation failed'];
            setValidationErrors(backendErrors);
        }
    };

    const handleDelete = async (id, month, year) => {
        if (window.confirm(`Are you sure you want to delete the forecast for ${MONTHS[month - 1]} ${year}?`)) {
            try {
                await forecastService.deleteForecast(id);
                loadForecasts();
            } catch (err) {
                alert(err.response?.data?.error || 'Failed to delete forecast');
            }
        }
    };

    const calculateTriggerAmount = () => {
        const target = parseFloat(currentForecast.targetAmount) || 0;
        const threshold = currentForecast.threshold / 100;
        return (target * threshold).toFixed(2);
    };

    // Calculate stats
    const forecastsForYear = forecasts.filter(f => f.year === selectedYear);
    const totalForecasts = forecastsForYear.length;
    const averageTarget = totalForecasts > 0
        ? (forecastsForYear.reduce((sum, f) => sum + f.targetAmount, 0) / totalForecasts).toFixed(0)
        : '0';
    const monthsRemaining = 12 - totalForecasts;

    const currentMonth = new Date().getMonth() + 1;
    const currentYearActual = new Date().getFullYear();

    if (loading && forecasts.length === 0) {
        return (
            <div className="forecasts-container">
                <div className="loading-state">
                    <p>Loading forecasts...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="forecasts-container">
            {/* Header */}
            <div className="forecasts-header">
                <div className="forecasts-title">
                    <h2>Revenue Forecasts</h2>
                    <p>Set monthly revenue targets and bonus thresholds.</p>
                </div>
                <select
                    className="year-selector"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                >
                    {[2024, 2025, 2026, 2027, 2028].map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
            </div>

            {/* Stats Row */}
            <div className="forecasts-stats">
                <div className="stat-card">
                    <span className="stat-label">Forecasts Set</span>
                    <span className="stat-value">{totalForecasts}/12</span>
                </div>
                <div className="stat-card">
                    <span className="stat-label">Average Target</span>
                    <span className="stat-value">Ft {parseInt(averageTarget).toLocaleString()}</span>
                </div>
                <div className="stat-card">
                    <span className="stat-label">Months Remaining</span>
                    <span className="stat-value">{monthsRemaining}</span>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="calendar-grid">
                {MONTHS.map((monthName, index) => {
                    const monthNum = index + 1;
                    const forecast = getForecastForMonth(monthNum, selectedYear);
                    const isCurrentMonth = monthNum === currentMonth && selectedYear === currentYearActual;
                    const isPastMonth = selectedYear < currentYearActual ||
                        (selectedYear === currentYearActual && monthNum < currentMonth);

                    return (
                        <div
                            key={monthNum}
                            className={`month-card ${forecast ? 'has-forecast' : ''} ${isCurrentMonth ? 'current-month' : ''} ${isPastMonth ? 'past-month' : ''}`}
                        >
                            <div className="month-header">
                                <span className="month-name">{monthName}</span>
                                <span className="month-indicator">
                                    {forecast ? '🎯' : isCurrentMonth ? '📍' : ''}
                                </span>
                            </div>

                            {forecast ? (
                                <>
                                    <div className="forecast-details">
                                        <div className="forecast-row">
                                            <span className="forecast-label">Target</span>
                                            <span className="forecast-value target">
                                                Ft{forecast.targetAmount.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="forecast-row">
                                            <span className="forecast-label">Threshold</span>
                                            <span className="forecast-value threshold">
                                                {Math.round(forecast.threshold * 100)}%
                                            </span>
                                        </div>
                                        <div className="forecast-row">
                                            <span className="forecast-label">Trigger At</span>
                                            <span className="forecast-value">
                                                Ft{(forecast.targetAmount * forecast.threshold).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                    {authService.canPerformOperations() && (
                                        <div className="month-actions">
                                            <button className="btn-edit" title={`Edit ${monthName} Forecast`} onClick={() => openModal(monthNum, forecast)}>
                                                Edit
                                            </button>
                                            <button className="btn-delete" title={`Delete ${monthName} Forecast`} onClick={() => handleDelete(forecast.id, monthNum, selectedYear)}>
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                authService.canPerformOperations() && (
                                    <button className="btn-add-forecast" title={`Add ${monthName} Forecast`} onClick={() => openModal(monthNum)}>
                                        <span>➕</span>
                                        Add Forecast
                                    </button>
                                )
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{isEditing ? 'Edit Forecast' : 'Create Forecast'}</h3>
                            <p className="modal-subtitle">
                                {MONTHS[currentForecast.month - 1]} {currentForecast.year}
                            </p>
                        </div>

                        {validationErrors.length > 0 && (
                            <div className="validation-error">
                                {validationErrors.map((err, idx) => (
                                    <div key={idx}>• {err}</div>
                                ))}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="targetAmount">Target Revenue Amount</label>
                                <div className="price-input-wrapper">
                                    <span className="price-prefix">Ft</span>
                                    <input
                                        id="targetAmount"
                                        type="number"
                                        className="price-input"
                                        required
                                        min="1"
                                        step="0.01"
                                        value={currentForecast.targetAmount}
                                        onChange={(e) => setCurrentForecast({ ...currentForecast, targetAmount: e.target.value })}
                                        placeholder="50000"
                                    />
                                </div>
                            </div>

                            <div className="threshold-slider-container">
                                <label>Bonus Threshold</label>
                                <div className="threshold-display">
                                    <span className="threshold-percentage">{currentForecast.threshold}%</span>
                                    <span className="threshold-amount">
                                        Triggers at Ft {parseFloat(calculateTriggerAmount()).toLocaleString()}
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    className="threshold-slider"
                                    min="0"
                                    max="100"
                                    value={currentForecast.threshold}
                                    onChange={(e) => setCurrentForecast({ ...currentForecast, threshold: parseInt(e.target.value) })}
                                />
                                <p className="threshold-hint">
                                    Bonuses are paid when revenue reaches {currentForecast.threshold}% of the target
                                </p>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn-cancel" onClick={closeModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-save">
                                    {isEditing ? 'Save Changes' : 'Create Forecast'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Forecasts;
