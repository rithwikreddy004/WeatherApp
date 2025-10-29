// src/components/SearchBar.jsx
import React, { useState } from 'react';
import './SearchBar.css'; 

function SearchBar({ onSearch, loading }) {
  const [city, setCity] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(city); // Pass the city up to App.jsx
  };

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="search-input"
        placeholder="Enter city name..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
        disabled={loading} // Disable input while loading
      />
      <button type="submit" className="search-button" disabled={loading}>
        {loading ? '...' : 'Search'}
      </button>
    </form>
  );
}

export default SearchBar;