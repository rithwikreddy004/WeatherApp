// src/App.jsx
import React, { useState } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import WeatherDisplay from './components/WeatherDisplay';
// Import our new service!
import { getWeatherForCity } from './api/weatherService';

function App() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchedCity, setSearchedCity] = useState('');

  const handleSearch = async (city) => {
    if (!city) {
      setError('Please enter a city name.');
      return;
    }

    setWeather(null);
    setError(null);
    setLoading(true);
    // We don't set searchedCity here anymore, we'll use the API's response

    try {
      // THIS IS THE NEW LOGIC
      const data = await getWeatherForCity(city);
      setWeather(data); // data is { temperature, windspeed, ... }
      setSearchedCity(data.city); // Use the formatted name from the API
      setError(null);
    } catch (err) {
      // If the API throws an error, we catch it here
      setError(err.message);
      setWeather(null);
    } finally {
      // This runs whether it succeeded or failed
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h1>Weather Now</h1>
      <SearchBar onSearch={handleSearch} loading={loading} />
      <WeatherDisplay
        weather={weather}
        loading={loading}
        error={error}
        cityName={searchedCity} // Pass the name we got from the API
      />
    </div>
  );
}

export default App;
