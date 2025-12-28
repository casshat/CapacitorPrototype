/**
 * PrimaryButton - Dark button with white text
 * 
 * TypeScript Concepts:
 * - ReactNode for children
 * - Variant prop for different sizes
 */

import type { ReactNode, ButtonHTMLAttributes } from 'react';

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button content */
  children: ReactNode;
  /** Size variant */
  variant?: 'default' | 'small';
}

/**
 * PrimaryButton - Main action button
 * 
 * Usage:
 * <PrimaryButton onClick={handleClick}>Add</PrimaryButton>
 * <PrimaryButton variant="small" disabled>Save</PrimaryButton>
 */
function PrimaryButton({ 
  children, 
  variant = 'default',
  className = '',
  ...props 
}: PrimaryButtonProps) {
  const variantClass = variant === 'small' ? 'primary-button--small' : '';
  
  return (
    <button
      className={`primary-button ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default PrimaryButton;

