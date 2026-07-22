import { Location, WeatherResponse } from "./types";

export async function getWeather(location: Location): Promise<WeatherResponse> {
  const parameters = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    current:
      "temperature_2m,dew_point_2m,precipitation_probability,weather_code,is_day,wind_speed_10m,wind_gusts_10m,wind_direction_10m",
    hourly:
      "temperature_2m,dew_point_2m,precipitation_probability,weather_code,is_day,wind_speed_10m",
    daily:
      "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,wind_direction_10m_dominant",
    forecast_days: "14",
    temperature_unit: "fahrenheit",
    wind_speed_unit: "mph",
    timezone: "auto",
  });

  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?${parameters}`,
    { signal: AbortSignal.timeout(10000) },
  );

  if (!response.ok) {
    throw new Error("Weather data could not be loaded.");
  }

  const data: WeatherResponse = await response.json();
  if (!data.current) {
    throw new Error("Current weather data is unavailable.");
  }

  return data;
}
