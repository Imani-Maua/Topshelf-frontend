import React, { useState, useEffect } from 'react';
import { receiptService } from '../../services/receiptService';
import './Receipts.css';

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

const Receipts = () => {
    const [receipts, setReceipts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        month: '',
        year: '',
        participantId: '',
        productId: '',
        limit: 100,
        offset: 0
    });
    const [totalReceipts, setTotalReceipts] = useState(0);

    useEffect(() => {
        loadReceipts();
    }, [filters]);

    const loadReceipts = async () => {
        try {
            setLoading(true);
            setError(null);

            // Build filters for API
            const apiFilters = {};
            if (filters.month && filters.year) {
                const startDate = new Date(filters.year, filters.month - 1, 1).toISOString();
                const endDate = new Date(filters.year, filters.month, 0, 23, 59, 59).toISOString();
                apiFilters.startDate = startDate;
                apiFilters.endDate = endDate;
            }
            if (filters.participantId) apiFilters.participantId = filters.participantId;
            if (filters.productId) apiFilters.productId = filters.productId;
            apiFilters.limit = filters.limit;
            apiFilters.offset = filters.offset;
            apiFilters.sortBy = 'date';
            apiFilters.sortOrder = 'desc';

            const response = await receiptService.getReceipts(apiFilters);
            setReceipts(response.data.receipts || []);
            setTotalReceipts(response.data.total || 0);
        } catch (err) {
            console.error('Error loading receipts:', err);
            setError(err.response?.data?.error || 'Failed to load receipts');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
            offset: 0 // Reset to first page when filters change
        }));
    };

    const handleNextPage = () => {
        setFilters(prev => ({
            ...prev,
            offset: prev.offset + prev.limit
        }));
    };

    const handlePrevPage = () => {
        setFilters(prev => ({
            ...prev,
            offset: Math.max(0, prev.offset - prev.limit)
        }));
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const currentPage = Math.floor(filters.offset / filters.limit) + 1;
    const totalPages = Math.ceil(totalReceipts / filters.limit);

    return (
        <div className="receipts-container">
            <div className="receipts-header">
                <div>
                    <h2>Receipt Data</h2>
                    <p>View all imported sales receipts. This data is READ-ONLY.</p>
                </div>
                <div className="readonly-badge">
                    🔒 READ-ONLY
                </div>
            </div>

            <div className="filters-section">
                <div className="filter-group">
                    <label>Month</label>
                    <select
                        value={filters.month}
                        onChange={(e) => handleFilterChange('month', e.target.value)}
                    >
                        <option value="">All Months</option>
                        {MONTHS.map(m => (
                            <option key={m.value} value={m.value}>{m.label}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label>Year</label>
                    <select
                        value={filters.year}
                        onChange={(e) => handleFilterChange('year', e.target.value)}
                    >
                        <option value="">All Years</option>
                        {[2024, 2025, 2026, 2027, 2028].map(y => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label>Results per page</label>
                    <select
                        value={filters.limit}
                        onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
                    >
                        <option value="50">50</option>
                        <option value="100">100</option>
                        <option value="200">200</option>
                        <option value="500">500</option>
                    </select>
                </div>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="loading-state">
                    <p>Loading receipts...</p>
                </div>
            ) : receipts.length === 0 ? (
                <div className="empty-state">
                    <h3>No Receipts Found</h3>
                    <p>Import CSV data from the Bonuses page to see receipts here.</p>
                </div>
            ) : (
                <>
                    <div className="receipts-stats">
                        <span>Showing {filters.offset + 1} - {Math.min(filters.offset + filters.limit, totalReceipts)} of {totalReceipts} receipts</span>
                    </div>

                    <div className="receipts-table">
                        <div className="table-header">
                            <div className="header-cell">Date</div>
                            <div className="header-cell">Seller</div>
                            <div className="header-cell">Product</div>
                            <div className="header-cell">Category</div>
                            <div className="header-cell">Price</div>
                        </div>

                        {receipts.map((receipt, idx) => (
                            <div key={receipt.id || idx} className="table-row">
                                <div className="table-cell">{formatDate(receipt.date)}</div>
                                <div className="table-cell">
                                    {receipt.participant?.firstname} {receipt.participant?.lastname}
                                </div>
                                <div className="table-cell">{receipt.product?.name}</div>
                                <div className="table-cell">{receipt.product?.category?.name}</div>
                                <div className="table-cell price">${receipt.price.toFixed(2)}</div>
                            </div>
                        ))}
                    </div>

                    <div className="pagination">
                        <button
                            className="pagination-btn"
                            onClick={handlePrevPage}
                            disabled={filters.offset === 0}
                        >
                            ← Previous
                        </button>
                        <span className="pagination-info">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            className="pagination-btn"
                            onClick={handleNextPage}
                            disabled={filters.offset + filters.limit >= totalReceipts}
                        >
                            Next →
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Receipts;
