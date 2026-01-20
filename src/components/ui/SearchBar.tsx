/**
 * SearchBar - Text input for searching
 * 
 * Features:
 * - Search icon
 * - Placeholder text
 * - Clear button when input has value
 * - Optional + button for manual entry
 */

import { Search, X, Plus } from 'lucide-react';

interface SearchBarProps {
  /** Current input value */
  value: string;
  /** Called when input changes */
  onChange: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Auto focus on mount */
  autoFocus?: boolean;
  /** Optional callback for manual entry button */
  onAddManual?: () => void;
}

function SearchBar({
  value,
  onChange,
  placeholder = 'Search foods...',
  autoFocus = false,
  onAddManual,
}: SearchBarProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <div className="search-bar">
      <Search size={20} className="search-bar__icon" />
      <input
        type="text"
        className="search-bar__input"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
      />
      {value && (
        <button
          className="search-bar__clear"
          onClick={handleClear}
          type="button"
          aria-label="Clear search"
        >
          <X size={18} />
        </button>
      )}
      {onAddManual && (
        <button
          className="search-bar__add"
          onClick={onAddManual}
          type="button"
          aria-label="Add food manually"
        >
          <Plus size={20} />
        </button>
      )}
    </div>
  );
}

export default SearchBar;
