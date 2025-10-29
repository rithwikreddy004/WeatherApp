/*
import React from "react";
import "./WeatherDisplay.css";
import { Cloud, Sun, CloudRain, Snowflake, Wind } from "lucide-react";

function WeatherDisplay({ weather, loading, error }) { // Removed cityName prop
  if (loading) {
    return <p className="status-message">Loading weather...</p>;
  }

  if (error) {
    return <p className="status-message error">{error}</p>;
  }

  if (!weather) {
    return <p className="status-message">Search for a city to see the weather.</p>;
  }

  // Weather icon mapping (based on Open-Meteo weather codes)
  const getWeatherIcon = (code) => {
    if (code === 0) return <Sun className="icon sun" />;
    if ([1, 2, 3].includes(code)) return <Cloud className="icon cloud" />;
    if ([45, 48].includes(code)) return <CloudRain className="icon rain" />; // Fog
    if ([51, 61, 63, 65, 80, 81, 82].includes(code)) return <CloudRain className="icon rain" />; // Rain
    if ([71, 73, 75, 77, 85, 86].includes(code)) return <Snowflake className="icon snow" />; // Snow
    return <Wind className="icon wind" />;
  };

  const icon = getWeatherIcon(weather.weathercode);

  // --- 1. TIMEZONE FIX ---
  // Format the time using the timezone provided by the API
  const updatedTime = new Date(weather.time).toLocaleTimeString('en-US', {
    timeZone: weather.timezone,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  return (
    <div className="weather-card">
      
      <h2 className="city-name">{weather.city}</h2>
      
      <div className="weather-main">
        <div className="weather-icon">{icon}</div>

        <div className="weather-temp">
          {weather.temperature}
          <span>°C</span>
        </div>
      </div>

      <div className="weather-extra">
        <div className="extra-item">
          <Wind size={18} /> <span>{weather.windspeed} km/h</span>
        </div>
        <div className="extra-item">
          <span>Direction:</span> <strong>{weather.winddirection}°</strong>
        </div>
      </div>

      <div className="weather-footer">
        <span className="weather-code">Code {weather.weathercode}</span>
        
        
        <span className="weather-time">
          Updated: {updatedTime}
        </span>
      </div>
    </div>
  );
}

export default WeatherDisplay;


*/

import React from "react";
import "./WeatherDisplay.css";
import { 
  Cloud, Sun, CloudRain, Snowflake, Wind, 
  Droplet, Thermometer, Sunrise, Sunset, ArrowUp, ArrowDown, Umbrella 
} from "lucide-react";

function WeatherDisplay({ weather, loading, error }) {
  if (loading) {
    return <p className="status-message">Loading weather...</p>;
  }

  if (error) {
    return <p className="status-message error">{error}</p>;
  }

  if (!weather) {
    return <p className="status-message">Search for a city to see the weather.</p>;
  }

  // --- Helper Functions ---

  // Weather icon mapping
  const getWeatherIcon = (code) => {
    if (code === 0) return <Sun className="icon sun" />;
    if ([1, 2, 3].includes(code)) return <Cloud className="icon cloud" />;
    if ([45, 48].includes(code)) return <CloudRain className="icon rain" />; // Fog
    if ([51, 61, 63, 65, 80, 81, 82].includes(code)) return <CloudRain className="icon rain" />; // Rain
    if ([71, 73, 75, 77, 85, 86].includes(code)) return <Snowflake className="icon snow" />; // Snow
    return <Wind className="icon wind" />;
  };

  // --- *** TIME FIX INTEGRATED *** ---
  // This function bypasses the new Date() bug by formatting the string manually.
  const formatTime = (isoString) => {
    try {
      // 1. Get the time part of the string, e.g., "15:35" from "2025-10-29T15:35"
      const timeString = isoString.split('T')[1];
      
      // 2. Get hours and minutes
      const [hour, minute] = timeString.split(':');
      
      // 3. Convert to number
      const hourNum = parseInt(hour);
      
      // 4. Determine AM/PM
      const ampm = hourNum >= 12 ? 'PM' : 'AM';
      
      // 5. Convert to 12-hour format
      const formattedHour = hourNum % 12 === 0 ? 12 : hourNum % 12;
      
      // 6. Return the formatted string
      return `${formattedHour}:${minute} ${ampm}`;
    
    } catch (e) {
      // Fallback in case of an error
      console.error("Error formatting time:", e);
      return "Invalid Time";
    }
  };

  const icon = getWeatherIcon(weather.weathercode);
  const updatedTime = formatTime(weather.time);
  const sunriseTime = formatTime(weather.sunrise);
  const sunsetTime = formatTime(weather.sunset);



  let displayTimezoneName = "";
  const cityParts = weather.city.split(', ');
  
  if (cityParts.length > 1) {
    displayTimezoneName = cityParts[1]; // e.g., "United Kingdom" or "India"
  } else {
    // Fallback to the timezone name (e.g., "London" from "Europe/London")
    displayTimezoneName = weather.timezone.split('/')[1].replace('_', ' ');
  }
  return (
    <div className="weather-card">
      <h2 className="city-name">{weather.city}</h2>
      
      <div className="weather-main">
        <div className="weather-icon">{icon}</div>
        <div className="weather-temp">
          {Math.round(weather.temperature)}
          <span>°C</span>
        </div>
      </div>

      {/* --- Details Section (2x2 Grid) --- */}
      <div className="weather-details">
        <div className="detail-item">
          <Thermometer size={18} />
          <span>Feels like: <strong>{Math.round(weather.apparentTemperature)}°</strong></span>
        </div>
        <div className="detail-item">
          <Droplet size={18} />
          <span>Humidity: <strong>{weather.humidity}%</strong></span>
        </div>
        <div className="detail-item">
          <Umbrella size={18} />
          <span>Precipitation: <strong>{weather.precipitationProbability}%</strong></span>
        </div>
        <div className="detail-item">
          <Wind size={18} />
          <span>Wind: <strong>{weather.windspeed} km/h</strong></span>
        </div>
      </div>

      {/* --- Daily Forecast Section --- */}
      <div className="weather-daily-forecast">
        <div className="daily-item">
          <ArrowUp size={18} />
          <span>High: <strong>{Math.round(weather.high)}°</strong></span>
        </div>
        <div className="daily-item">
          <ArrowDown size={18} />
          <span>Low: <strong>{Math.round(weather.low)}°</strong></span>
        </div>
        <div className="daily-item">
          <Sunrise size={18} />
          <span>Sunrise: <strong>{sunriseTime}</strong></span>
        </div>
        <div className="daily-item">
          <Sunset size={18} />
          <span>Sunset: <strong>{sunsetTime}</strong></span>
        </div>
      </div>

      <div className="weather-footer">
        <span className="weather-code">Code {weather.weathercode}</span>
        <span className="weather-time">
          Updated ({displayTimezoneName} time): {updatedTime}
        </span>
      </div>
    </div>
  );
}

export default WeatherDisplay;