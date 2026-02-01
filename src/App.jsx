import { AuthProvider } from './context/AuthContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard/Dashboard';
import Participants from './pages/Participants/Participants';
import Categories from './pages/Categories/Categories';
import Products from './pages/Products/Products';
import Forecasts from './pages/Forecasts/Forecasts';
import Bonuses from './pages/Bonuses/Bonuses';
import Receipts from './pages/Receipts/Receipts';
import './App.css';

const ComingSoon = ({ title, icon }) => (
  <div className="coming-soon-container">
    <span>{icon}</span>
    <h2>{title} Page</h2>
    <p>We're building this feature for you right now!</p>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app">
          <div className="layout-wrapper">
            <Sidebar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/participants" element={<Participants />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/products" element={<Products />} />
                <Route path="/forecasts" element={<Forecasts />} />
                <Route path="/bonuses" element={<Bonuses />} />
                <Route path="/receipts" element={<Receipts />} />
              </Routes>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;