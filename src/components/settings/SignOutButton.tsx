/**
 * SignOutButton - Full-width sign out button with loading state
 * 
 * TypeScript Concepts:
 * - Async handlers with loading state
 * - Error handling
 */

import { useState } from 'react';

interface SignOutButtonProps {
  /** Sign out handler */
  onSignOut: () => Promise<void>;
}

/**
 * SignOutButton - Button to sign out the user
 */
function SignOutButton({ onSignOut }: SignOutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await onSignOut();
    } catch (err) {
      setError('Failed to sign out. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <p style={{ 
          color: '#B91C1C', 
          fontSize: '14px', 
          marginBottom: '12px',
          textAlign: 'center'
        }}>
          {error}
        </p>
      )}
      <button
        className="signout-button"
        onClick={handleClick}
        disabled={isLoading}
        aria-label="Sign out of FitTrack"
      >
        {isLoading ? 'Signing out...' : 'Sign Out'}
      </button>
    </div>
  );
}

export default SignOutButton;



