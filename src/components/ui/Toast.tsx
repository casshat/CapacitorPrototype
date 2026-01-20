/**
 * Toast - Notification message
 * 
 * Displays a temporary message at the bottom of the screen.
 * Supports success and error variants.
 */

import { Check, AlertCircle } from 'lucide-react';

interface ToastProps {
  /** Message to display */
  message: string;
  /** Toast variant */
  type?: 'success' | 'error';
  /** Whether the toast is visible */
  visible: boolean;
  /** Called when toast should be dismissed */
  onDismiss?: () => void;
}

function Toast({ message, type = 'success', visible, onDismiss }: ToastProps) {
  if (!visible) return null;

  const Icon = type === 'success' ? Check : AlertCircle;

  return (
    <div 
      className={`toast toast--${type}`}
      onClick={onDismiss}
      role="alert"
    >
      <Icon size={20} className="toast__icon" />
      <span className="toast__message">{message}</span>
    </div>
  );
}

export default Toast;
