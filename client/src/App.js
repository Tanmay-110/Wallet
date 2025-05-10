import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { TransactionProvider } from './context/TransactionContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SendMoney from './pages/SendMoney';
import RequestMoney from './pages/RequestMoney';
import Transactions from './pages/Transactions';
import NotFound from './pages/NotFound';
import LandingPage from './pages/LandingPage';

// Components
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="App">
      {/* Only show navbar when not on landing page or when authenticated */}
      {(isAuthenticated || window.location.pathname !== '/') && <Navbar />}
      
      <div className={isAuthenticated || window.location.pathname !== '/' ? "container" : ""}>
        <TransactionProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Landing Page / Dashboard Route */}
            <Route 
              path="/" 
              element={
                isAuthenticated ? (
                  <PrivateRoute><Dashboard /></PrivateRoute>
                ) : (
                  <LandingPage />
                )
              } 
            />
            
            {/* Protected Routes */}
            <Route path="/send" element={<PrivateRoute><SendMoney /></PrivateRoute>} />
            <Route path="/request" element={<PrivateRoute><RequestMoney /></PrivateRoute>} />
            <Route path="/transactions" element={<PrivateRoute><Transactions /></PrivateRoute>} />
            
            {/* Not Found */}
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </TransactionProvider>
      </div>
    </div>
  );
}

export default App; 