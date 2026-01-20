/**
 * App - Main layout component
 * 
 * This component:
 * 1. Checks if user is authenticated
 * 2. Shows AuthPage if not logged in
 * 3. Shows the main app with routes if logged in
 * 4. Hides tab bar on settings page and add food page
 */

import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';

// Auth
import { useAuth } from './context/AuthContext';
import AuthPage from './pages/AuthPage';

// Pages
import HomePage from './pages/HomePage';
import LogPage from './pages/LogPage';
import AddFoodPage from './pages/AddFoodPage';
import OverviewPage from './pages/OverviewPage';
import SettingsPage from './pages/SettingsPage';

// Components
import TabBar from './components/TabBar';

function App() {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // Check if we're on a page that should hide the tab bar
  const hideTabBar = 
    location.pathname === '/settings' ||
    location.pathname === '/log/add';

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // Show auth page if not logged in
  if (!user) {
    return <AuthPage />;
  }

  // Show main app if logged in
  return (
    <div className="app">
      {/* Main content area - changes based on URL */}
      <main className={`main ${hideTabBar ? 'main--no-tabbar' : ''}`}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/log" element={<LogPage />} />
          <Route path="/log/add" element={<AddFoodPage />} />
          <Route path="/overview" element={<OverviewPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>

      {/* Tab bar - hidden on settings and food sub-pages */}
      {!hideTabBar && <TabBar />}
    </div>
  );
}

export default App;
