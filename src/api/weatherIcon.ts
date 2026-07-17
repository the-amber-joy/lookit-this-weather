import clearDay from "@meteocons/svg/fill/clear-day.svg";
import clearNight from "@meteocons/svg/fill/clear-night.svg";
import drizzle from "@meteocons/svg/fill/drizzle.svg";
import fogDay from "@meteocons/svg/fill/fog-day.svg";
import fogNight from "@meteocons/svg/fill/fog-night.svg";
import notAvailable from "@meteocons/svg/fill/not-available.svg";
import overcastDay from "@meteocons/svg/fill/overcast-day.svg";
import overcastNight from "@meteocons/svg/fill/overcast-night.svg";
import partlyCloudyDayRain from "@meteocons/svg/fill/partly-cloudy-day-rain.svg";
import partlyCloudyDaySnow from "@meteocons/svg/fill/partly-cloudy-day-snow.svg";
import partlyCloudyDay from "@meteocons/svg/fill/partly-cloudy-day.svg";
import partlyCloudyNightRain from "@meteocons/svg/fill/partly-cloudy-night-rain.svg";
import partlyCloudyNightSnow from "@meteocons/svg/fill/partly-cloudy-night-snow.svg";
import partlyCloudyNight from "@meteocons/svg/fill/partly-cloudy-night.svg";
import rain from "@meteocons/svg/fill/rain.svg";
import sleet from "@meteocons/svg/fill/sleet.svg";
import snow from "@meteocons/svg/fill/snow.svg";
import thunderstormsDayRain from "@meteocons/svg/fill/thunderstorms-day-rain.svg";
import thunderstormsDay from "@meteocons/svg/fill/thunderstorms-day.svg";
import thunderstormsNightRain from "@meteocons/svg/fill/thunderstorms-night-rain.svg";
import thunderstormsNight from "@meteocons/svg/fill/thunderstorms-night.svg";

import drizzleMono from "@meteocons/svg/monochrome/drizzle.svg?raw";
import rainMono from "@meteocons/svg/monochrome/rain.svg?raw";
import sleetMono from "@meteocons/svg/monochrome/sleet.svg?raw";
import snowMono from "@meteocons/svg/monochrome/snow.svg?raw";
import thunderstormsMono from "@meteocons/svg/monochrome/thunderstorms.svg?raw";
import umbrellaClosed from "@meteocons/svg/monochrome/umbrella-closed.svg?raw";
import beaufort0 from "@meteocons/svg/monochrome/wind-beaufort-0.svg?raw";
import beaufort1 from "@meteocons/svg/monochrome/wind-beaufort-1.svg?raw";
import beaufort10 from "@meteocons/svg/monochrome/wind-beaufort-10.svg?raw";
import beaufort11 from "@meteocons/svg/monochrome/wind-beaufort-11.svg?raw";
import beaufort12 from "@meteocons/svg/monochrome/wind-beaufort-12.svg?raw";
import beaufort2 from "@meteocons/svg/monochrome/wind-beaufort-2.svg?raw";
import beaufort3 from "@meteocons/svg/monochrome/wind-beaufort-3.svg?raw";
import beaufort4 from "@meteocons/svg/monochrome/wind-beaufort-4.svg?raw";
import beaufort5 from "@meteocons/svg/monochrome/wind-beaufort-5.svg?raw";
import beaufort6 from "@meteocons/svg/monochrome/wind-beaufort-6.svg?raw";
import beaufort7 from "@meteocons/svg/monochrome/wind-beaufort-7.svg?raw";
import beaufort8 from "@meteocons/svg/monochrome/wind-beaufort-8.svg?raw";
import beaufort9 from "@meteocons/svg/monochrome/wind-beaufort-9.svg?raw";

// The monochrome icons are hardcoded to black; swap to currentColor so they
// inherit the surrounding text color when inlined.
const toCurrentColor = (svg: string) => svg.replace(/black/g, "currentColor");

const PRECIPITATION_ICONS = {
  none: toCurrentColor(umbrellaClosed),
  drizzle: toCurrentColor(drizzleMono),
  rain: toCurrentColor(rainMono),
  snow: toCurrentColor(snowMono),
  sleet: toCurrentColor(sleetMono),
  thunder: toCurrentColor(thunderstormsMono),
};

export function getPrecipitationIcon(
  probability: number,
  weatherCode: number,
): string {
  if (probability === 0 || weatherCode < 51) return PRECIPITATION_ICONS.none;
  if ([95, 96, 99].includes(weatherCode)) return PRECIPITATION_ICONS.thunder;
  if ([56, 57, 66, 67].includes(weatherCode)) return PRECIPITATION_ICONS.sleet;
  if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) {
    return PRECIPITATION_ICONS.snow;
  }
  if ([51, 53, 55].includes(weatherCode)) return PRECIPITATION_ICONS.drizzle;
  return PRECIPITATION_ICONS.rain;
}

// Beaufort icons indexed 0–12, so the wind tile reflects the actual speed.
const BEAUFORT_ICONS = [
  beaufort0,
  beaufort1,
  beaufort2,
  beaufort3,
  beaufort4,
  beaufort5,
  beaufort6,
  beaufort7,
  beaufort8,
  beaufort9,
  beaufort10,
  beaufort11,
  beaufort12,
].map(toCurrentColor);

// Lower bounds (mph) for Beaufort forces 1–12.
const BEAUFORT_THRESHOLDS = [1, 4, 8, 13, 19, 25, 32, 39, 47, 55, 64, 73];

export function getWindSpeedIcon(mph: number): string {
  let force = 0;
  for (let i = 0; i < BEAUFORT_THRESHOLDS.length; i += 1) {
    if (mph >= BEAUFORT_THRESHOLDS[i]) force = i + 1;
  }
  return BEAUFORT_ICONS[force];
}

interface WeatherIcon {
  /** Meteocons SVG asset URL. */
  src: string;
  /** Human-readable description of the condition, used as alt text. */
  label: string;
}

interface IconVariants {
  day: string;
  night: string;
  label: string;
}

// WMO weather interpretation codes returned by Open-Meteo, mapped to Meteocons.
// https://open-meteo.com/en/docs#weathervariables
const WMO_CODES: Record<number, IconVariants> = {
  0: { day: clearDay, night: clearNight, label: "Clear sky" },
  1: { day: clearDay, night: clearNight, label: "Mainly clear" },
  2: {
    day: partlyCloudyDay,
    night: partlyCloudyNight,
    label: "Partly cloudy",
  },
  3: { day: overcastDay, night: overcastNight, label: "Overcast" },
  45: { day: fogDay, night: fogNight, label: "Fog" },
  48: { day: fogDay, night: fogNight, label: "Depositing rime fog" },
  51: { day: drizzle, night: drizzle, label: "Light drizzle" },
  53: { day: drizzle, night: drizzle, label: "Moderate drizzle" },
  55: { day: drizzle, night: drizzle, label: "Dense drizzle" },
  56: { day: sleet, night: sleet, label: "Light freezing drizzle" },
  57: { day: sleet, night: sleet, label: "Dense freezing drizzle" },
  61: { day: rain, night: rain, label: "Slight rain" },
  63: { day: rain, night: rain, label: "Moderate rain" },
  65: { day: rain, night: rain, label: "Heavy rain" },
  66: { day: sleet, night: sleet, label: "Light freezing rain" },
  67: { day: sleet, night: sleet, label: "Heavy freezing rain" },
  71: { day: snow, night: snow, label: "Slight snowfall" },
  73: { day: snow, night: snow, label: "Moderate snowfall" },
  75: { day: snow, night: snow, label: "Heavy snowfall" },
  77: { day: snow, night: snow, label: "Snow grains" },
  80: {
    day: partlyCloudyDayRain,
    night: partlyCloudyNightRain,
    label: "Slight rain showers",
  },
  81: {
    day: partlyCloudyDayRain,
    night: partlyCloudyNightRain,
    label: "Moderate rain showers",
  },
  82: {
    day: partlyCloudyDayRain,
    night: partlyCloudyNightRain,
    label: "Violent rain showers",
  },
  85: {
    day: partlyCloudyDaySnow,
    night: partlyCloudyNightSnow,
    label: "Slight snow showers",
  },
  86: {
    day: partlyCloudyDaySnow,
    night: partlyCloudyNightSnow,
    label: "Heavy snow showers",
  },
  95: {
    day: thunderstormsDay,
    night: thunderstormsNight,
    label: "Thunderstorm",
  },
  96: {
    day: thunderstormsDayRain,
    night: thunderstormsNightRain,
    label: "Thunderstorm with slight hail",
  },
  99: {
    day: thunderstormsDayRain,
    night: thunderstormsNightRain,
    label: "Thunderstorm with heavy hail",
  },
};

export function getWeatherIcon(
  weatherCode: number,
  isDay: number,
): WeatherIcon {
  const variants = WMO_CODES[weatherCode];

  if (!variants) {
    return { src: notAvailable, label: "Unknown conditions" };
  }

  return {
    src: isDay ? variants.day : variants.night,
    label: variants.label,
  };
}

type Condition = "clear" | "cloudy" | "fog" | "rain" | "snow" | "thunder";

// Static, on-brand gradients (brand blues/purples/gold) for each condition,
// split into day and night so the card background reflects the weather.
const BACKGROUNDS: Record<Condition, { day: string; night: string }> = {
  clear: {
    day: "linear-gradient(160deg, #245da8, #2c73d2, #ffaf1b)",
    night: "linear-gradient(160deg, #09172a, #1b467e, #4d2f7c)",
  },
  cloudy: {
    day: "linear-gradient(160deg, #1b467e, #245da8, #5790db)",
    night: "linear-gradient(160deg, #09172a, #122f54, #1b467e)",
  },
  fog: {
    day: "linear-gradient(160deg, #245da8, #5790db, #81ace4)",
    night: "linear-gradient(160deg, #09172a, #122f54, #245da8)",
  },
  rain: {
    day: "linear-gradient(160deg, #122f54, #1b467e, #245da8)",
    night: "linear-gradient(160deg, #09172a, #122f54, #1b467e)",
  },
  snow: {
    day: "linear-gradient(160deg, #245da8, #5790db, #81ace4)",
    night: "linear-gradient(160deg, #122f54, #1b467e, #5790db)",
  },
  thunder: {
    day: "linear-gradient(160deg, #1a1029, #331f53, #663fa6)",
    night: "linear-gradient(160deg, #09172a, #1a1029, #4d2f7c)",
  },
};

function getCondition(weatherCode: number): Condition {
  if ([95, 96, 99].includes(weatherCode)) return "thunder";
  if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) return "snow";
  if ([45, 48].includes(weatherCode)) return "fog";
  if (weatherCode >= 51) return "rain";
  if ([2, 3].includes(weatherCode)) return "cloudy";
  return "clear";
}

export function getWeatherBackground(
  weatherCode: number,
  isDay: number,
): string {
  const { day, night } = BACKGROUNDS[getCondition(weatherCode)];
  return isDay ? day : night;
}
