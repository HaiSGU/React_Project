import React from 'react';
import './SearchBar.css';

/**
 * SearchBar component cho Web
 * @param {string} value - Giá trị search
 * @param {function} onChange - Callback khi text thay đổi
 * @param {string} placeholder - Placeholder text
 * @param {function} onClear - Callback khi clear search
 * @param {string} className - Custom CSS class
 */
const SearchBar = ({ 
  value, 
  onChange, 
  placeholder = 'Tìm kiếm...', 
  onClear,
  className = ''
}) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  const handleClear = () => {
    if (onClear) {
      onClear();
    } else {
      onChange('');
    }
  };

  return (
    <div className={`search-bar ${className}`}>
      <span className="search-icon">🔍</span>
      <input
        type="text"
        className="search-input"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
      />
      {value && (
        <button 
          className="search-clear" 
          onClick={handleClear}
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default SearchBar;
