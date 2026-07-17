import { Location, WeatherResponse } from "./types";

export async function getWeather(location: Location): Promise<WeatherResponse> {
  const parameters = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    current:
      "temperature_2m,dew_point_2m,precipitation_probability,weather_code,is_day,wind_speed_10m,wind_gusts_10m,wind_direction_10m",
    temperature_unit: "fahrenheit",
    wind_speed_unit: "mph",
    timezone: "auto",
  });

  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?${parameters}`,
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
