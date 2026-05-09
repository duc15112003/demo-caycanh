import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MainLayout from './components/MainLayout';
import ErrorBoundary from './components/ErrorBoundary';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Products from './pages/Products';
import Customers from './pages/Customers';
import Login from './pages/Login';
import Analysis from './pages/Analysis';
import Settings from './pages/Settings';
import Help from './pages/Help';
import NotFound from './pages/NotFound';
import { apiService } from './services/api';

const AdminApp = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [authState, setAuthState] = useState({
    loading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    const sync = async () => {
      setAuthState((current) => ({ ...current, loading: true }));
      try {
        const session = await apiService.verifySession();
        if (session.authenticated) {
          localStorage.setItem('isAuthenticated', 'true');
        } else {
          localStorage.removeItem('isAuthenticated');
        }
        setAuthState({
          loading: false,
          isAuthenticated: session.authenticated,
        });
      } catch {
        localStorage.removeItem('isAuthenticated');
        setAuthState({
          loading: false,
          isAuthenticated: false,
        });
      }
    };

    sync();
    window.addEventListener('auth:changed', sync);
    return () => window.removeEventListener('auth:changed', sync);
  }, []);

  if (authState.loading) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-background flex items-center justify-center font-sans">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            <p className="mt-4 text-sm font-bold text-text-muted">Đang kiểm tra phiên đăng nhập...</p>
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <Routes>
        <Route
          path="login"
          element={authState.isAuthenticated ? <Navigate to="/admin/dashboard" replace /> : <Login />}
        />
        <Route
          path="*"
          element={
            !authState.isAuthenticated ? (
              <Navigate to="/admin/login" replace />
            ) : (
              <div className="min-h-screen bg-background flex font-sans">
                <Sidebar
                  isCollapsed={sidebarCollapsed}
                  onToggle={() => setSidebarCollapsed((current) => !current)}
                />
                <div className="flex-1 flex flex-col">
                  <Header onToggleSidebar={() => setSidebarCollapsed((current) => !current)} />
                  <MainLayout>
                    <Routes>
                      <Route index element={<Navigate to="/admin/dashboard" replace />} />
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="orders" element={<Orders />} />
                      <Route path="products" element={<Products />} />
                      <Route path="customers" element={<Customers />} />
                      <Route path="analysis" element={<Analysis />} />
                      <Route path="settings" element={<Settings />} />
                      <Route path="help" element={<Help />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </MainLayout>
                </div>
              </div>
            )
          }
        />
      </Routes>
    </ErrorBoundary>
  );
};

export default AdminApp;
