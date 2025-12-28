/**
 * Section - Reusable section wrapper component
 * 
 * Matches PM's design spec: 24px padding, bgSurface background, optional border
 * 
 * TypeScript Concepts:
 * - Optional props with default values
 * - ReactNode for children
 */

import type { ReactNode } from 'react';

interface SectionProps {
  /** Section content */
  children: ReactNode;
  /** If true, removes bottom border */
  noBorder?: boolean;
}

/**
 * Section - Consistent section wrapper
 * 
 * @example
 * ```tsx
 * <Section>
 *   <SectionHeader title="MACROS" />
 *   Your content here
 * </Section>
 * 
 * <Section noBorder>
 *   Last section, no border
 * </Section>
 * ```
 */
function Section({ children, noBorder = false }: SectionProps) {
  return (
    <div 
      className="section-component"
      style={{
        background: 'var(--color-bg-primary)',
        borderBottom: noBorder ? 'none' : '1px solid var(--color-border-default)',
        padding: '24px',
      }}
    >
      {children}
    </div>
  );
}

export default Section;

