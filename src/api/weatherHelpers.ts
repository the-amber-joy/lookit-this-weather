import { AirQualityObservation } from "./types";

export function getPrecipitationType(
  probability: number,
  weatherCode: number,
): string {
  if (probability === 0 || weatherCode < 51) {
    return "None expected";
  }

  if ([56, 57, 66, 67].includes(weatherCode)) {
    return "Freezing rain";
  }

  if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) {
    return "Snow";
  }

  if ([80, 81, 82].includes(weatherCode)) {
    return "Rain showers";
  }

  if ([95, 96, 99].includes(weatherCode)) {
    return "Thunderstorms";
  }

  return "Rain";
}

export function getWindDirection(degrees: number): string {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const directionIndex = Math.round(degrees / 45) % directions.length;
  return directions[directionIndex];
}

/** Open-Meteo reports mph as "mp/h"; normalize it to the familiar "mph". */
export function formatWindUnit(unit?: string): string {
  return unit === "mp/h" ? "mph" : (unit ?? "mph");
}

export interface AqiCategory {
  label: string;
  color: string;
}

/** US AQI breakpoints and colors, per the EPA. https://www.airnow.gov/aqi/aqi-basics/ */
export function getAqiCategory(aqi: number): AqiCategory {
  if (aqi <= 50) return { label: "Good", color: "#00e400" };
  if (aqi <= 100) return { label: "Moderate", color: "#ffde33" };
  if (aqi <= 150) {
    return { label: "Unhealthy for sensitive groups", color: "#ff9933" };
  }
  if (aqi <= 200) return { label: "Unhealthy", color: "#cc0033" };
  if (aqi <= 300) return { label: "Very unhealthy", color: "#9933cc" };
  return { label: "Hazardous", color: "#7e0023" };
}

/** Normalize AirNow's parameterName values (e.g. "OZONE") into display-friendly labels. */
export function getPollutantLabel(parameterName: string): string {
  const labels: Record<string, string> = {
    "PM2.5": "PM2.5",
    PM10: "PM10",
    OZONE: "Ozone",
    O3: "Ozone",
  };
  return labels[parameterName.toUpperCase()] ?? parameterName;
}

export interface HighestAirQuality {
  aqi: number;
  pollutant: string;
  category: AqiCategory;
}

/** Picks the observation with the highest AQI value across all reported pollutants. */
export function getHighestAirQuality(
  observations: AirQualityObservation[],
): HighestAirQuality | null {
  if (!observations.length) return null;

  const highest = observations.reduce((max, observation) =>
    observation.nowcastAQI > max.nowcastAQI ? observation : max,
  );

  return {
    aqi: highest.nowcastAQI,
    pollutant: getPollutantLabel(highest.parameterName),
    category: getAqiCategory(highest.nowcastAQI),
  };
}
