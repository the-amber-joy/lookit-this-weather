import dayjs from "dayjs";

import { WeatherResponse } from "./types";

export interface DailyPoint {
  time: string;
  weatherCode: number;
  temperatureMax: number;
  temperatureMin: number;
  precipitationProbability: number;
  windSpeed: number;
  windDirection: number;
}

function dayLabel(time: dayjs.Dayjs, today: dayjs.Dayjs): string {
  const days = time.startOf("day").diff(today.startOf("day"), "day");
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  return time.format("dddd");
}

export interface DailyForecast {
  point: DailyPoint;
  label: string;
}

export function getDailyForecast(
  weather: WeatherResponse | null,
): DailyForecast[] {
  const daily = weather?.daily;
  if (!daily) return [];

  const today = dayjs(weather.current.time);

  return daily.time.map((time, i) => ({
    label: dayLabel(dayjs(time), today),
    point: {
      time,
      weatherCode: daily.weather_code[i],
      temperatureMax: daily.temperature_2m_max[i],
      temperatureMin: daily.temperature_2m_min[i],
      precipitationProbability: daily.precipitation_probability_max[i],
      windSpeed: daily.wind_speed_10m_max[i],
      windDirection: daily.wind_direction_10m_dominant[i],
    },
  }));
}
