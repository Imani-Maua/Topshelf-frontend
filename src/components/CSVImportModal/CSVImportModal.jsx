import React, { useState } from 'react';
import { receiptService } from '../../services/receiptService';
import './CSVImportModal.css';

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

const CSVImportModal = ({ isOpen, onClose }) => {
    const [file, setFile] = useState(null);
    const [filterByMonth, setFilterByMonth] = useState(false);
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [uploading, setUploading] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (!selectedFile.name.endsWith('.csv')) {
                setError('Please select a CSV file');
                setFile(null);
                return;
            }
            if (selectedFile.size > 10 * 1024 * 1024) {
                setError('File size must not exceed 10MB');
                setFile(null);
                return;
            }
            setFile(selectedFile);
            setError(null);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setError('Please select a file');
            return;
        }

        try {
            setUploading(true);
            setError(null);

            const options = filterByMonth ? { filterByMonth: true, month, year } : {};
            const response = await receiptService.uploadCSV(file, options);

            setResults(response.data);
        } catch (err) {
            const errorMsg = err.response?.data?.details?.[0] || err.response?.data?.error || err.response?.data?.message || 'Upload failed';
            setError(errorMsg);
        } finally {
            setUploading(false);
        }
    };

    const handleClose = () => {
        setFile(null);
        setFilterByMonth(false);
        setResults(null);
        setError(null);
        onClose();
    };

    const getMonthName = (monthNum) => {
        return MONTHS.find(m => m.value === monthNum)?.label || monthNum;
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>📊 Import Receipt Data</h3>
                    <button className="modal-close" onClick={handleClose}>×</button>
                </div>

                {!results ? (
                    <div className="modal-body">
                        <p className="modal-description">
                            Upload a CSV file with sales data. Expected format: seller, item, quantity, price, date
                        </p>

                        {error && (
                            <div className="upload-error">
                                {error}
                            </div>
                        )}

                        <div className="file-upload-section">
                            <label className="file-upload-label">
                                <input
                                    type="file"
                                    accept=".csv"
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                />
                                <div className="file-upload-button">
                                    📁 Choose CSV File
                                </div>
                            </label>
                            {file && (
                                <div className="file-selected">
                                    ✓ {file.name} ({(file.size / 1024).toFixed(1)} KB)
                                </div>
                            )}
                        </div>

                        <div className="filter-section">
                            <label className="filter-checkbox">
                                <input
                                    type="checkbox"
                                    checked={filterByMonth}
                                    onChange={(e) => setFilterByMonth(e.target.checked)}
                                />
                                <span>Only import receipts for:</span>
                            </label>

                            {filterByMonth && (
                                <div className="filter-selectors">
                                    <select value={month} onChange={(e) => setMonth(parseInt(e.target.value))}>
                                        {MONTHS.map(m => (
                                            <option key={m.value} value={m.value}>{m.label}</option>
                                        ))}
                                    </select>
                                    <select value={year} onChange={(e) => setYear(parseInt(e.target.value))}>
                                        {[2024, 2025, 2026, 2027, 2028].map(y => (
                                            <option key={y} value={y}>{y}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>

                        <button
                            className="btn-upload"
                            onClick={handleUpload}
                            disabled={!file || uploading}
                        >
                            {uploading ? 'Uploading...' : 'Upload & Process'}
                        </button>
                    </div>
                ) : (
                    <div className="modal-body">
                        <div className="results-section">
                            <div className="results-header">
                                <span className="results-icon">✅</span>
                                <h4>Import Successful</h4>
                            </div>

                            <div className="results-stats">
                                <div className="stat-row">
                                    <span className="stat-label">Successfully imported:</span>
                                    <span className="stat-value">{results.processed} receipts</span>
                                </div>
                            </div>

                            {Object.keys(results.monthBreakdown || {}).length > 0 && (
                                <div className="month-breakdown">
                                    <h5>Breakdown by Month:</h5>
                                    {Object.entries(results.monthBreakdown).map(([key, data]) => (
                                        <div key={key} className="month-row">
                                            <span className="month-label">
                                                {getMonthName(data.month)} {data.year}:
                                            </span>
                                            <span className="month-count">{data.count} receipts</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {results.errors && results.errors.length > 0 && (
                                <div className="errors-section">
                                    <h5>⚠️ Errors ({results.errors.length}):</h5>
                                    <div className="errors-list">
                                        {results.errors.slice(0, 10).map((err, idx) => (
                                            <div key={idx} className="error-row">
                                                <span className="error-row-num">Row {err.row}:</span>
                                                <span className="error-message">{err.message}</span>
                                            </div>
                                        ))}
                                        {results.errors.length > 10 && (
                                            <div className="error-more">
                                                ... and {results.errors.length - 10} more errors
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <button className="btn-close-results" onClick={handleClose}>
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CSVImportModal;
