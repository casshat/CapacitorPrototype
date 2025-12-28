/**
 * ChartRangeSelector - Dropdown for selecting chart time range
 * 
 * TypeScript Concepts:
 * - Union types for range values
 */

import { ChevronDown } from 'lucide-react';

interface ChartRangeSelectorProps {
  /** Selected range */
  value: '7d' | '14d' | '30d';
  /** Change handler */
  onChange: (value: '7d' | '14d' | '30d') => void;
}

/**
 * ChartRangeSelector - Time range dropdown
 */
function ChartRangeSelector({ value, onChange }: ChartRangeSelectorProps) {
  return (
    <div className="chart-range-selector">
      <select
        className="chart-range-select"
        value={value}
        onChange={(e) => onChange(e.target.value as '7d' | '14d' | '30d')}
      >
        <option value="7d">7d</option>
        <option value="14d">14d</option>
        <option value="30d">30d</option>
      </select>
      <ChevronDown size={16} className="chart-range-chevron" />
    </div>
  );
}

export default ChartRangeSelector;

