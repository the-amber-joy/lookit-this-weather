import dayjs from "dayjs";

import { WeatherResponse } from "./types";

export interface HourlyPoint {
  time: string;
  temperature: number;
  dewPoint: number;
  precipitationProbability: number;
  weatherCode: number;
  isDay: number;
  windSpeed: number;
}

export interface HourlyDay {
  /** Display label for the day, e.g. "Today", "Tomorrow", "Fri, Jul 18". */
  label: string;
  hours: HourlyPoint[];
}

const HOURS = 72;

function dayLabel(time: dayjs.Dayjs, now: dayjs.Dayjs): string {
  const days = time.startOf("day").diff(now.startOf("day"), "day");
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  return time.format("ddd, MMM D");
}

export function getHourlyForecast(
  weather: WeatherResponse | null,
): HourlyDay[] {
  const hourly = weather?.hourly;
  if (!hourly) return [];

  const now = dayjs(weather.current.time).startOf("hour");

  const points: HourlyPoint[] = [];
  for (let i = 0; i < hourly.time.length && points.length < HOURS; i += 1) {
    const time = dayjs(hourly.time[i]);
    if (time.isBefore(now)) continue;

    points.push({
      time: hourly.time[i],
      temperature: hourly.temperature_2m[i],
      dewPoint: hourly.dew_point_2m[i],
      precipitationProbability: hourly.precipitation_probability[i],
      weatherCode: hourly.weather_code[i],
      isDay: hourly.is_day[i],
      windSpeed: hourly.wind_speed_10m[i],
    });
  }

  const days: HourlyDay[] = [];
  points.forEach((point) => {
    const label = dayLabel(dayjs(point.time), now);
    const current = days[days.length - 1];
    if (current && current.label === label) {
      current.hours.push(point);
    } else {
      days.push({ label, hours: [point] });
    }
  });

  return days;
}

/**
 * Details about the next upcoming hour today whose precipitation chance
 * meets or exceeds a threshold: a display time like "3:00 PM" (or "now" if
 * it's already the current hour), plus the probability at that hour.
 */
export interface PrecipitationTiming {
  time: string;
  probability: number;
}

/**
 * Finds the first upcoming hour today whose precipitation chance meets or
 * exceeds `thresholdPercent`. Returns null if no hour today meets the
 * threshold.
 */
export function getPrecipitationTiming(
  weather: WeatherResponse | null,
  thresholdPercent = 25,
): PrecipitationTiming | null {
  if (!weather?.hourly) return null;

  const now = dayjs(weather.current.time);
  const today = getHourlyForecast(weather).find((day) => day.label === "Today");
  const hit = today?.hours.find(
    (hour) => hour.precipitationProbability >= thresholdPercent,
  );
  if (!hit) return null;

  const hitTime = dayjs(hit.time);
  return {
    time: hitTime.isSame(now, "hour") ? "now" : hitTime.format("h:mm A"),
    probability: hit.precipitationProbability,
  };
}
