import React from "react";
import { NavLink } from "react-router-dom";
import './Sidebar.css';


const getInitials = (name) => {
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase();
};

function Sidebar() {
    const userName = "Elaine Maua"
    return (
        <aside>
            <div className="sidebar">
                <div className="sidebar-header">
                    <h2>TopShelf</h2>
                    <p className="sidebar-subtitle">Incentive Management</p>
                </div>

                <nav className="sidebar-nav">
                    <NavLink to="/" className={({ isActive }) =>
                        (isActive ? 'nav-item active' : 'nav-item')}>
                        <span className="icon">🏠</span>Dashboard
                    </NavLink>

                    <NavLink to='/participants' className={({ isActive }) =>
                        (isActive ? 'nav-item active' : 'nav-item')}>
                        <span className="icon">👤</span>Participants
                    </NavLink>

                    <NavLink to='/categories' className={({ isActive }) =>
                        (isActive ? 'nav-item active' : 'nav-item')}>
                        <span className="icon">📁</span>Categories
                    </NavLink>

                    <NavLink to='/products' className={({ isActive }) =>
                        (isActive ? 'nav-item active' : 'nav-item')}>
                        <span className="icon">🛍️</span>Products
                    </NavLink>

                    <NavLink to='/forecasts' className={({ isActive }) =>
                        (isActive ? 'nav-item active' : 'nav-item')}>
                        <span className="icon">📊</span>Forecasts
                    </NavLink>

                    <NavLink to='/bonuses' className={({ isActive }) =>
                        (isActive ? 'nav-item active' : 'nav-item')}>
                        <span className="icon">💰</span>Bonuses
                    </NavLink>
                </nav>

                <div className="sidebar-footer">
                    <div className="user-profile">
                        <div className="user-avatar">
                            <span className="initials">{getInitials(userName)}</span>
                        </div>
                        <div className="user-info">
                            <p className="user-name">{userName}</p>
                            <p className="user-role">Administrator</p>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    )
}


export default Sidebar;