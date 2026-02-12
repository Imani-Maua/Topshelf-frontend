import React from 'react';
import './ParticipantDetail.css';

const ParticipantDetail = ({ participant, onClose }) => {
    if (!participant) return null;

    // Calculate total sales revenue
    const totalRevenue = participant.receipts?.reduce((sum, receipt) => sum + receipt.price, 0) || 0;
    const totalBonuses = participant.bonusPayouts?.reduce((sum, bonus) => sum + bonus.amount, 0) || 0;

    // Group receipts by product
    const productSales = {};
    participant.receipts?.forEach(receipt => {
        const productName = receipt.product?.name || 'Unknown';
        if (!productSales[productName]) {
            productSales[productName] = { count: 0, revenue: 0 };
        }
        productSales[productName].count += 1;
        productSales[productName].revenue += receipt.price;
    });

    const topProducts = Object.entries(productSales)
        .sort((a, b) => b[1].revenue - a[1].revenue)
        .slice(0, 5);

    return (
        <div className="detail-overlay" onClick={onClose}>
            <div className="detail-panel" onClick={(e) => e.stopPropagation()}>
                <div className="detail-header">
                    <div className="detail-avatar">
                        {participant.firstname[0]}{participant.lastname[0]}
                    </div>
                    <div className="detail-title">
                        <h2>{participant.firstname} {participant.lastname}</h2>
                        <p className="detail-subtitle">Performance Overview</p>
                    </div>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>

                <div className="detail-body">
                    {/* Summary Stats */}
                    <div className="detail-stats">
                        <div className="stat-box">
                            <span className="stat-label">Total Sales</span>
                            <span className="stat-value">{participant.receipts?.length || 0}</span>
                        </div>
                        <div className="stat-box">
                            <span className="stat-label">Revenue Generated</span>
                            <span className="stat-value">Ft {totalRevenue.toLocaleString()}</span>
                        </div>
                        <div className="stat-box">
                            <span className="stat-label">Bonuses Earned</span>
                            <span className="stat-value success">Ft {totalBonuses.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Top Products */}
                    <div className="detail-section">
                        <h3>Top Products Sold</h3>
                        {topProducts.length > 0 ? (
                            <div className="products-list">
                                {topProducts.map(([product, data]) => (
                                    <div className="product-item" key={product}>
                                        <div className="product-info">
                                            <span className="product-name">{product}</span>
                                            <span className="product-count">{data.count} sold</span>
                                        </div>
                                        <span className="product-revenue">Ft {data.revenue.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="empty-message">No sales recorded yet.</p>
                        )}
                    </div>

                    {/* Recent Bonuses */}
                    <div className="detail-section">
                        <h3>Bonus History</h3>
                        {participant.bonusPayouts && participant.bonusPayouts.length > 0 ? (
                            <div className="bonuses-list">
                                {participant.bonusPayouts.map((bonus, idx) => (
                                    <div className="bonus-item" key={idx}>
                                        <div className="bonus-info">
                                            <span className="bonus-period">
                                                {new Date(bonus.createdAt).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                        <span className="bonus-amount">+ Ft{bonus.amount.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="empty-message">No bonuses earned yet.</p>
                        )}
                    </div>

                    {/* Recent Sales */}
                    <div className="detail-section">
                        <h3>Recent Sales</h3>
                        {participant.receipts && participant.receipts.length > 0 ? (
                            <div className="sales-list">
                                {participant.receipts.slice(0, 10).map((receipt) => (
                                    <div className="sale-item" key={receipt.id}>
                                        <div className="sale-info">
                                            <span className="sale-product">{receipt.product?.name || 'Unknown'}</span>
                                            <span className="sale-date">
                                                {new Date(receipt.date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <span className="sale-price">Ft {receipt.price}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="empty-message">No sales recorded yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParticipantDetail;
