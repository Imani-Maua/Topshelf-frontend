import { AuthProvider } from './context/AuthContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard/Dashboard';
import Participants from './pages/Participants/Participants';
import Categories from './pages/Categories/Categories';
import Products from './pages/Products/Products';
import Forecasts from './pages/Forecasts/Forecasts';
import Bonuses from './pages/Bonuses/Bonuses';
import Receipts from './pages/Receipts/Receipts';
import UserManagement from './pages/UserManagement/UserManagement';
import Login from './pages/Login/Login';
import SetPassword from './pages/SetPassword/SetPassword';
import './App.css';

// Layout wrapper for protected pages
const AppLayout = ({ children }) => (
  <div className="app">
    <div className="layout-wrapper">
      <Sidebar />
      <main className="main-content">
        {children}
      </main>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/set-password" element={<SetPassword />} />

          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <AppLayout><Dashboard /></AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/dashboard" element={
            <ProtectedRoute>
              <AppLayout><Dashboard /></AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/participants" element={
            <ProtectedRoute>
              <AppLayout><Participants /></AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/categories" element={
            <ProtectedRoute>
              <AppLayout><Categories /></AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/products" element={
            <ProtectedRoute>
              <AppLayout><Products /></AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/forecasts" element={
            <ProtectedRoute>
              <AppLayout><Forecasts /></AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/bonuses" element={
            <ProtectedRoute>
              <AppLayout><Bonuses /></AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/receipts" element={
            <ProtectedRoute>
              <AppLayout><Receipts /></AppLayout>
            </ProtectedRoute>
          } />

          {/* Admin Only Routes */}
          <Route path="/users" element={
            <ProtectedRoute requireAdmin={true}>
              <AppLayout><UserManagement /></AppLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;