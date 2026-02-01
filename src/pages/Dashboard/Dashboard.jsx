import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import MetricCard from '../../components/MetricCard';
import CSVImportModal from '../../components/CSVImportModal/CSVImportModal';
import MonthYearPicker from '../../components/MonthYearPicker/MonthYearPicker';
import { dashboardService } from '../../services/dashboardService';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import './Dashboard.css';

const CHART_COLORS = ['#4A90E2', '#34A853', '#FBBC05', '#EA4335', '#8E44AD'];

function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Date State - Defaulting to January as that's where the data is!
  const [selectedDate, setSelectedDate] = useState({
    month: 1,
    year: 2026
  });

  // Data State
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCSVModal, setShowCSVModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const dashboardData = await dashboardService.getDashboardData(
          selectedDate.month,
          selectedDate.year
        );
        setData(dashboardData);
      } catch (err) {
        console.error("Fetch Error:", err);
        const message = err.response?.data?.message || err.message || "Unknown error";
        setError(`Failed to load dashboard data: ${message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedDate]);

  const handleDateChange = (month, year) => {
    setSelectedDate({ month, year });
  };

  const handleAddParticipant = () => {
    navigate('/participants', { state: { openModal: true } });
  };

  const handleCalculateBonuses = () => {
    navigate('/bonuses', {
      state: {
        month: selectedDate.month,
        year: selectedDate.year
      }
    });
  };

  const handleCSVImport = () => {
    setShowCSVModal(true);
  };

  if (authLoading || (isLoading && !data)) {
    return <div className="dashboard-loading">Loading Dashboard Intelligence...</div>;
  }

  if (error) {
    return <div className="dashboard-error">{error}</div>;
  }

  return (
    <div className='dashboard-container'>
      {/* Header with Custom Month/Year Picker */}
      <div className='dashboard-header'>
        <div className='dashboard-title'>
          {!authLoading && <h2>Welcome back, {user?.name}!</h2>}
        </div>
        <div className='dashboard-filters'>
          <MonthYearPicker
            selectedMonth={selectedDate.month}
            selectedYear={selectedDate.year}
            onChange={handleDateChange}
          />
        </div>
      </div>

      {/* Company Goal Progress Bar */}
      <div className='company-goal-section'>
        <div className='goal-header'>
          <span>Monthly Revenue Target</span>
          <span>({data?.revenue?.percentage?.toFixed(0) || 0}%)</span>
        </div>
        <div className='progress-bar-container'>
          <div className='progress-bar' style={{ width: `${data?.revenue.percentage}%` }}>
            <div className='progress-glow'></div>
          </div>
          <div className='target-marker' style={{ left: '90%' }}>
            <span className='marker-label'>Tier 2 Bonus</span>
          </div>
        </div>
      </div>

      {/* Metrics Section */}
      <div className='dashboard-metrics'>
        <MetricCard
          label="Total Participants"
          value={data?.metrics.totalParticipants || "0"}
          icon="👥"
          color="#4285F4"
        />
        <MetricCard
          label="Threshold Reached"
          value={data?.metrics.thresholdReached || "0%"}
          icon="📈"
          color="#34A853"
        />
        <MetricCard
          label="Estimated Payout"
          value={data?.metrics.estimatedPayout || "Ft 0"}
          icon="💰"
          color="#FBBC05"
        />
      </div>

      {/* Graphs Section */}
      <div className='dashboard-charts'>
        <div className='chart-container'>
          <h3>Performance per Participant</h3>
          <div className='chart-visual-container'>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data?.performanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: '#f8f9fa' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="revenue" fill="#4A90E2" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className='chart-container'>
          <h3>Sales Breakdown</h3>
          <div className='chart-visual-container'>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={data?.salesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data?.salesData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="vertical" align="right" verticalAlign="middle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className='dashboard-intelligence-grid'>
        {/* Quick Insights */}
        <div className='intelligence-card alerts-feed'>
          <h3>💡 Quick Insights</h3>
          <div className='feed-content'>
            {/* Top Category */}
            {data?.salesData && data.salesData.length > 0 && (
              <div className='alert-item info'>
                <span className='alert-icon'>🏆</span>
                <div className='alert-info'>
                  <p className='alert-title'>Top Category: {data.salesData[0].name}</p>
                  <p className='alert-desc'>Ft {data.salesData[0].value.toLocaleString()} in sales</p>
                </div>
              </div>
            )}

            {/* Momentum Status */}
            {data?.revenue && data.revenue.target > 0 && (
              <div className={`alert-item ${data.revenue.percentage >= 100 ? 'success' : 'warning'}`}>
                <span className='alert-icon'>{data.revenue.percentage >= 100 ? '🔥' : '📈'}</span>
                <div className='alert-info'>
                  <p className='alert-title'>
                    Momentum: {data.revenue.percentage.toFixed(0)}% of forecast
                  </p>
                  <p className='alert-desc'>
                    {data.revenue.percentage >= 100
                      ? "You're crushing it!"
                      : `Ft ${(data.revenue.target - data.revenue.current).toLocaleString()} to go!`}
                  </p>
                </div>
              </div>
            )}

            {/* Bonus Pool */}
            {data?.topPerformers && (
              <div className='alert-item info'>
                <span className='alert-icon'>💰</span>
                <div className='alert-info'>
                  <p className='alert-title'>Bonus Pool: {data.metrics.estimatedPayout}</p>
                  <p className='alert-desc'>
                    {data.metrics.earningCount}/{data.metrics.totalParticipants} participants earning
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Top Performers Table */}
        <div className='intelligence-card top-performers'>
          <h3>Top Performers</h3>
          <div className='performers-table'>
            <div className='table-row header'>
              <span>Name</span>
              <span>Bonus</span>
            </div>
            {data?.topPerformers && data.topPerformers.length > 0 ? (
              data.topPerformers.map((payout, index) => (
                <div className='table-row' key={index}>
                  <span className='performer-name'>{payout.participant.name}</span>
                  <span className='bonus-plus'>+ Ft {payout.amount.toLocaleString()}</span>
                </div>
              ))
            ) : (
              <p className="no-data">No performers found for this period.</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className='dashboard-actions'>
        <div className='actions-title'>
          <h3>Quick Actions</h3>
        </div>
        <div className='actions-grid'>
          <button className='action-btn primary' onClick={handleAddParticipant}>
            <span className='icon'>➕</span>
            Create New Participant
          </button>
          <button className='action-btn secondary' onClick={handleCalculateBonuses}>
            <span className='icon'>🧮</span>
            Calculate Monthly Bonuses
          </button>
          <button className='action-btn outline' onClick={handleCSVImport}>
            <span className='icon'>📥</span>
            Import Sales Data (CSV)
          </button>
        </div>
      </div>

      <CSVImportModal
        isOpen={showCSVModal}
        onClose={() => setShowCSVModal(false)}
      />
    </div>
  );
}

export default Dashboard;