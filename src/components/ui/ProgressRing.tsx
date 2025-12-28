/**
 * ProgressRing Component
 * 
 * A circular progress indicator using SVG.
 * 
 * TypeScript Concepts:
 * - ReactNode type for children prop
 * - SVG math for circular progress
 * - Inline SVG gradient definition
 */

import type { ReactNode } from 'react';

interface ProgressRingProps {
  /** Current value */
  value: number;
  /** Maximum/goal value */
  max: number;
  /** Diameter in pixels (optional, defaults to 130) */
  size?: number;
  /** Ring thickness (optional, defaults to 12) */
  strokeWidth?: number;
  /** Content to display in center */
  children?: ReactNode;
  /** Show loading state */
  isLoading?: boolean;
}

/**
 * ProgressRing - Circular progress indicator
 * 
 * Usage:
 * <ProgressRing value={6200} max={10000}>
 *   <span className="steps-value">6.2k</span>
 * </ProgressRing>
 */
function ProgressRing({ 
  value, 
  max, 
  size = 130, 
  strokeWidth = 12,
  children,
  isLoading = false
}: ProgressRingProps) {
  // Calculate the radius (accounting for stroke width)
  const radius = (size - strokeWidth) / 2;
  
  // Calculate circumference of the circle
  const circumference = 2 * Math.PI * radius;
  
  // Calculate percentage (capped at 100%)
  const percentage = Math.min((value / max) * 100, 100);
  
  // Calculate stroke dash offset (how much of the circle to "hide")
  // Full offset = empty, 0 offset = full circle
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Center point for the circle
  const center = size / 2;

  return (
    <div className="steps-ring-container" style={{ width: size, height: size }}>
      {/* SVG with gradient definition */}
      <svg
        className={`progress-ring ${isLoading ? 'skeleton' : ''}`}
        width={size}
        height={size}
      >
        {/* Define the gradient for the ring stroke */}
        <defs>
          <linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-gradient-start)" />
            <stop offset="100%" stopColor="var(--color-gradient-end)" />
          </linearGradient>
        </defs>
        
        {/* Background track */}
        <circle
          className="progress-ring__track"
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
        />
        
        {/* Filled progress arc */}
        {!isLoading && (
          <circle
            className="progress-ring__fill"
            cx={center}
            cy={center}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        )}
      </svg>
      
      {/* Center content (passed as children) */}
      {children && (
        <div className="steps-ring-content">
          {children}
        </div>
      )}
    </div>
  );
}

export default ProgressRing;

