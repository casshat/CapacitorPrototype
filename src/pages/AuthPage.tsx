/**
 * AuthPage - Login and Sign Up screen
 * 
 * Allows users to sign in or create an account using email and password.
 * 
 * TypeScript Concepts:
 * - Form state management
 * - Async form submission
 * - Conditional rendering based on mode
 */

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import StyledInput from '../components/ui/StyledInput';
import PrimaryButton from '../components/ui/PrimaryButton';

/**
 * AuthPage - Email/password authentication
 */
function AuthPage() {
  // Toggle between sign in and sign up modes
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // UI state
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    
    // Validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    if (mode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setIsSubmitting(true);
    
    if (mode === 'signin') {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error);
      }
    } else {
      const { error } = await signUp(email, password);
      if (error) {
        setError(error);
      } else {
        setSuccessMessage('Account created! You can now sign in.');
        setMode('signin');
        setPassword('');
        setConfirmPassword('');
      }
    }
    
    setIsSubmitting(false);
  };

  const toggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setError(null);
    setSuccessMessage(null);
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Header */}
        <div className="auth-header">
          <h1 className="auth-title">FitTrack</h1>
          <p className="auth-subtitle">
            {mode === 'signin' ? 'Welcome back' : 'Create your account'}
          </p>
        </div>

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit}>
          {/* Success message */}
          {successMessage && (
            <div className="auth-success">{successMessage}</div>
          )}
          
          {/* Error message */}
          {error && (
            <div className="auth-error">{error}</div>
          )}

          <div className="auth-field">
            <label className="auth-label">Email</label>
            <StyledInput
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@example.com"
            />
          </div>

          <div className="auth-field">
            <label className="auth-label">Password</label>
            <StyledInput
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
            />
          </div>

          {mode === 'signup' && (
            <div className="auth-field">
              <label className="auth-label">Confirm Password</label>
              <StyledInput
                type="password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                placeholder="••••••••"
              />
            </div>
          )}

          <PrimaryButton
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting 
              ? (mode === 'signin' ? 'Signing in...' : 'Creating account...') 
              : (mode === 'signin' ? 'Sign In' : 'Create Account')
            }
          </PrimaryButton>
        </form>

        {/* Toggle mode */}
        <div className="auth-toggle">
          {mode === 'signin' ? (
            <p>
              Don't have an account?{' '}
              <button className="auth-toggle-button" onClick={toggleMode}>
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button className="auth-toggle-button" onClick={toggleMode}>
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthPage;

