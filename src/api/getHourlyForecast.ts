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

const HOURS = 48;

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
