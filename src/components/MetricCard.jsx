import React from 'react';
import './MetricCard.css';

function MetricCard({ label, value, icon, color }) {
    return (
        <div className="metric-card" style={{ borderLeft: `6px solid ${color}` }}>
            <div className="metric-icon">{icon}</div>
            <div className="metric-content">
                <p className="metric-label">{label}</p>
                <h3 className="metric-value">{value}</h3>
            </div>
        </div>
    );
}

export default MetricCard;