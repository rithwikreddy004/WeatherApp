/*
const GEOCODING_API_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast";

export const getWeatherForCity = async (city) => {
  // --- 1. Get coordinates and timezone for the city ---
  const geoUrl = `${GEOCODING_API_URL}?name=${encodeURIComponent(city)}&count=1&language=en`;

  let location;
  try {
    const response = await fetch(geoUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch location data.");
    }

    const data = await response.json();
    if (!data.results || data.results.length === 0) {
      throw new Error(`City not found: ${city}`);
    }

    location = data.results[0];
  } catch (err) {
    console.error("Geocoding Error:", err);
    throw new Error("Unable to find the city. Please check the spelling.");
  }

  // --- ADDED `timezone` HERE ---
  const { latitude, longitude, name: foundCityName, country, timezone } = location;

  // Add a check in case timezone isn't provided
  if (!timezone) {
    throw new Error("Timezone information not available for this location.");
  }

  // --- 2. Get current weather, passing the new timezone ---
  
  // --- ADDED `&timezone=${encodeURIComponent(timezone)}` TO THE URL ---
  const weatherUrl = `${WEATHER_API_URL}?latitude=${latitude}&longitude=${longitude}&current_weather=true&temperature_unit=celsius&windspeed_unit=kmh&timezone=${encodeURIComponent(timezone)}`;

  try {
    const response = await fetch(weatherUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch weather data.");
    }

    const data = await response.json();
    const current = data.current_weather;

    if (!current || current.temperature === undefined) {
      throw new Error("Weather data not available.");
    }

    // --- 3. Return clean formatted object (ADDED `timezone`) ---
    return {
      city: `${foundCityName}${country ? ", " + country : ""}`,
      temperature: current.temperature,
      windspeed: current.windspeed,
      winddirection: current.winddirection,
      weathercode: current.weathercode,
      time: current.time, // This will now be in the city's local time, e.g., "2025-10-29T20:30"
      timezone: timezone,   // e.g., "Asia/Kolkata"
    };
  } catch (err) {
    console.error("Weather Fetch Error:", err);
    throw new Error("Unable to fetch current weather data.");
  }
};
*/

const GEOCODING_API_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast";

export const getWeatherForCity = async (city) => {
  // --- 1. Get coordinates and timezone for the city ---
  const geoUrl = `${GEOCODING_API_URL}?name=${encodeURIComponent(city)}&count=1&language=en`;

  let location;
  try {
    const response = await fetch(geoUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch location data.");
    }

    const data = await response.json();
    if (!data.results || data.results.length === 0) {
      throw new Error(`City not found: ${city}`);
    }

    location = data.results[0];
  } catch (err) {
    console.error("Geocoding Error:", err);
    throw new Error("Unable to find the city. Please check the spelling.");
  }

  const { latitude, longitude, name: foundCityName, country, timezone } = location;

  if (!timezone) {
    throw new Error("Timezone information not available for this location.");
  }

  // --- 2. Get current and daily weather, passing the timezone ---

  // --- MODIFIED URL ---
  // Added 'precipitation_probability' to both 'current' and 'daily' lists
  const weatherUrl = `${WEATHER_API_URL}?latitude=${latitude}&longitude=${longitude}` +
    `&current=temperature_2m,relativehumidity_2m,apparent_temperature,precipitation,precipitation_probability,weathercode,windspeed_10m,winddirection_10m` +
    `&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max` +
    `&temperature_unit=celsius&windspeed_unit=kmh&timezone=${encodeURIComponent(timezone)}&forecast_days=1`;

  try {
    const response = await fetch(weatherUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch weather data.");
    }

    const data = await response.json();

    if (!data.current || !data.daily) {
      throw new Error("Weather data not available.");
    }

    const current = data.current;
    const daily = data.daily;

    // --- 3. Return expanded formatted object ---
    return {
      city: `${foundCityName}${country ? ", " + country : ""}`,
      timezone: timezone,
      
      // Current Conditions
      time: current.time,
      temperature: current.temperature_2m,
      apparentTemperature: current.apparent_temperature,
      humidity: current.relativehumidity_2m,
      precipitationAmount: current.precipitation, // Renamed for clarity
      precipitationProbability: current.precipitation_probability, // <-- HERE IT IS (%)
      windspeed: current.windspeed_10m,
      winddirection: current.winddirection_10m,
      weathercode: current.weathercode,

      // Daily Forecast (for today)
      high: daily.temperature_2m_max[0],
      low: daily.temperature_2m_min[0],
      sunrise: daily.sunrise[0],
      sunset: daily.sunset[0],
      dailyWeatherCode: daily.weathercode[0],
      dailyPrecipitationProbability: daily.precipitation_probability_max[0] // <-- HERE IT IS (%)
    };
  } catch (err) {
    console.error("Weather Fetch Error:", err);
    throw new Error("Unable to fetch current weather data.");
  }
};