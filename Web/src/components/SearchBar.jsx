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
export default function SearchBar(props){
  const {
    value, 
    onChange, 
    placeholder = 'Tìm kiếm...', 
    onClear,
    className = ''
  } = props;

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
    <div className="search-wrap">
      <span className="material-icons-outlined search-icon">search</span>
      {/* đảm bảo input chính dùng className bên dưới */}
      <input className="search-input" {...props} />
    </div>
  );
};
