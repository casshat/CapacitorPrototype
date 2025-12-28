/**
 * StyledInput - Base input component with FitTrack styling
 * 
 * TypeScript Concepts:
 * - Extending HTML input props
 * - Omit type to exclude certain props
 */

import type { InputHTMLAttributes } from 'react';

interface StyledInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  /** Current value */
  value: string | number;
  /** Change handler - receives the raw value */
  onChange: (value: string) => void;
  /** Width in pixels (optional) */
  width?: number;
}

/**
 * StyledInput - Rounded input with distinct background
 * 
 * Usage:
 * <StyledInput value={value} onChange={setValue} placeholder="0" />
 */
function StyledInput({ 
  value, 
  onChange, 
  width,
  className = '',
  ...props 
}: StyledInputProps) {
  return (
    <input
      className={`styled-input ${className}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={width ? { width: `${width}px` } : undefined}
      {...props}
    />
  );
}

export default StyledInput;

