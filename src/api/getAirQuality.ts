import { AirQualityResponse, Location } from "./types";

const AQI_PROXY_URL =
  "https://lookit-this-weather-aqi-proxy.the-amber-joy.workers.dev";

export async function getAirQuality(
  location: Location,
): Promise<AirQualityResponse> {
  const parameters = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
  });

  const response = await fetch(`${AQI_PROXY_URL}/?${parameters}`);

  if (!response.ok) {
    throw new Error("Air quality data could not be loaded.");
  }

  const data: AirQualityResponse = await response.json();
  if (!data.length) {
    throw new Error("Current air quality data is unavailable.");
  }

  return data;
}
