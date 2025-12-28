/**
 * SectionHeader - Section title with optional action
 * 
 * Matches PM's design spec: flex layout, 20px margin-bottom, overline typography
 * 
 * TypeScript Concepts:
 * - Optional props
 * - ReactNode for flexible content
 */

import type { ReactNode } from 'react';

interface SectionHeaderProps {
  /** Section title text */
  title: string;
  /** Optional action element (e.g., dropdown, button) on the right */
  action?: ReactNode;
}

/**
 * SectionHeader - Section title with optional right-side action
 * 
 * Usage:
 * <SectionHeader title="MACROS" />
 * <SectionHeader title="Weight Trend" action={<ChartRangeSelector />} />
 */
function SectionHeader({ title, action }: SectionHeaderProps) {
  return (
    <div 
      className="section-header-component"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
      }}
    >
      <div
        style={{
          fontSize: 'var(--font-size-caption)',
          fontWeight: 'var(--font-weight-medium)',
          color: 'var(--color-text-tertiary)',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          fontFamily: 'var(--font-family)',
        }}
      >
        {title}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export default SectionHeader;

