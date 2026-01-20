/**
 * SettingsHeader - Header with back navigation
 * 
 * TypeScript Concepts:
 * - Function props for navigation
 * - Lucide icons
 */

import { ArrowLeft } from 'lucide-react';

interface SettingsHeaderProps {
  /** Navigation handler to return to previous page */
  onBack: () => void;
}

/**
 * SettingsHeader - Back button + "Settings" title
 */
function SettingsHeader({ onBack }: SettingsHeaderProps) {
  return (
    <header className="settings-header">
      <button
        className="settings-back-button"
        onClick={onBack}
        aria-label="Back to Overview"
      >
        <ArrowLeft size={24} strokeWidth={2} />
      </button>
      <h1 className="settings-title">Settings</h1>
    </header>
  );
}

export default SettingsHeader;



