import { AirQualityResponse, Location } from "./types";

export async function getAirQuality(
  location: Location,
): Promise<AirQualityResponse> {
  const parameters = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    current: "us_aqi",
    timezone: "auto",
  });

  const response = await fetch(
    `https://air-quality-api.open-meteo.com/v1/air-quality?${parameters}`,
  );

  if (!response.ok) {
    throw new Error("Air quality data could not be loaded.");
  }

  const data: AirQualityResponse = await response.json();
  if (!data.current) {
    throw new Error("Current air quality data is unavailable.");
  }

  return data;
}
