import React, { useState, useRef, useEffect } from 'react';
import './MonthYearPicker.css';

const MONTHS = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const MonthYearPicker = ({ selectedMonth, selectedYear, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [viewYear, setViewYear] = useState(selectedYear);
    const pickerRef = useRef(null);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMonthSelect = (monthIndex) => {
        onChange(monthIndex + 1, viewYear); // 1-indexed month
        setIsOpen(false);
    };

    const adjustYear = (delta) => {
        setViewYear(prev => prev + delta);
    };

    return (
        <div className="month-year-picker" ref={pickerRef}>
            <div className="picker-toggle" onClick={() => setIsOpen(!isOpen)}>
                <span className="calendar-icon">📅</span>
                <span>{MONTHS[selectedMonth - 1]} {selectedYear}</span>
            </div>

            {isOpen && (
                <div className="picker-dropdown">
                    <div className="picker-header">
                        <button className="year-nav-btn" onClick={() => adjustYear(-1)}>‹</button>
                        <span className="current-year">{viewYear}</span>
                        <button className="year-nav-btn" onClick={() => adjustYear(1)}>›</button>
                    </div>
                    <div className="months-grid">
                        {MONTHS.map((month, index) => (
                            <button
                                key={month}
                                className={`month-btn ${selectedMonth === index + 1 && viewYear === selectedYear ? 'active' : ''}`}
                                onClick={() => handleMonthSelect(index)}
                            >
                                {month}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MonthYearPicker;
