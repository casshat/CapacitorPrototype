/**
 * SettingsPage - App settings and preferences
 * 
 * Contains:
 * - Theme selection (4 themes)
 * - Apple Health integration (moved from Log page)
 * - Sign out functionality
 * 
 * TypeScript Concepts:
 * - React Router navigation
 * - Combining multiple contexts (Auth, Theme)
 */

import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useHealthKit } from '../hooks/useHealthKit';
import Section from '../components/ui/Section';
import SettingsHeader from '../components/settings/SettingsHeader';
import ThemeGrid from '../components/settings/ThemeGrid';
import SignOutButton from '../components/settings/SignOutButton';

/**
 * SettingsPage - Main settings screen
 */
function SettingsPage() {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  // HealthKit integration (moved from LogPage)
  const {
    isAvailable: healthKitAvailable,
    isLinked: healthKitLinked,
    isLoading: healthKitLoading,
    error: healthKitError,
    linkHealth,
  } = useHealthKit();

  const handleBack = () => {
    navigate('/overview');
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="settings-page">
      {/* Header with back button */}
      <SettingsHeader onBack={handleBack} />

      {/* Theme Section */}
      <Section>
        <div className="settings-section-title">THEME</div>
        <ThemeGrid />
      </Section>

      {/* Integrations Section */}
      <Section>
        <div className="settings-section-title">INTEGRATIONS</div>
        
        {healthKitAvailable ? (
          <div className="health-link-section">
            {healthKitLinked ? (
              // Connected state
              <div className="health-link-connected">
                <div className="health-link-status">
                  <Check size={18} />
                  <span>Connected</span>
                </div>
                <p className="health-link-description">
                  Steps are synced from Apple Health
                </p>
              </div>
            ) : (
              // Not linked state
              <div className="health-link-prompt">
                <p className="health-link-description">
                  Connect to automatically sync your step count
                </p>
                <button
                  className="health-link-button"
                  onClick={linkHealth}
                  disabled={healthKitLoading}
                >
                  {healthKitLoading ? 'Connecting...' : 'Link Apple Health'}
                </button>
                {healthKitError && (
                  <p className="health-link-error">{healthKitError}</p>
                )}
              </div>
            )}
          </div>
        ) : (
          // Apple Health not available (not on iOS)
          <div className="health-link-section">
            <div className="health-link-prompt">
              <p className="health-link-description">
                Apple Health is available on iOS devices only
              </p>
            </div>
          </div>
        )}
      </Section>

      {/* Sign Out Section */}
      <Section noBorder>
        <SignOutButton onSignOut={handleSignOut} />
      </Section>
    </div>
  );
}

export default SettingsPage;



