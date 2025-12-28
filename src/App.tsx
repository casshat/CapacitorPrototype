/**
 * App - Main layout component
 * 
 * This component:
 * 1. Checks if user is authenticated
 * 2. Shows AuthPage if not logged in
 * 3. Shows the main app with routes if logged in
 */

import { Routes, Route } from 'react-router-dom';
import './App.css';

// Auth
import { useAuth } from './context/AuthContext';
import AuthPage from './pages/AuthPage';

// Pages
import HomePage from './pages/HomePage';
import LogPage from './pages/LogPage';
import OverviewPage from './pages/OverviewPage';

// Components
import TabBar from './components/TabBar';

function App() {
  const { user, isLoading } = useAuth();

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
      <main className="main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/log" element={<LogPage />} />
          <Route path="/overview" element={<OverviewPage />} />
        </Routes>
      </main>

      {/* Tab bar - always visible at bottom */}
      <TabBar />
    </div>
  );
}

export default App;
