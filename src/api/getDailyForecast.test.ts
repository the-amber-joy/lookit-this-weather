import { describe, expect, it } from "vitest";

import { getDailyForecast } from "./getDailyForecast";
import { WeatherResponse } from "./types";

function makeWeather(
  currentTime: string,
  dailyTimes: string[],
): WeatherResponse {
  return {
    current: {
      time: currentTime,
      temperature_2m: 70,
      dew_point_2m: 55,
      precipitation_probability: 0,
      weather_code: 1,
      is_day: 1,
      wind_speed_10m: 5,
      wind_gusts_10m: 8,
      wind_direction_10m: 180,
    },
    current_units: {
      temperature_2m: "°F",
      dew_point_2m: "°F",
      precipitation_probability: "%",
      wind_speed_10m: "mph",
      wind_gusts_10m: "mph",
      wind_direction_10m: "°",
    },
    daily: {
      time: dailyTimes,
      weather_code: dailyTimes.map(() => 1),
      temperature_2m_max: dailyTimes.map(() => 80),
      temperature_2m_min: dailyTimes.map(() => 60),
      precipitation_probability_max: dailyTimes.map(() => 10),
      wind_speed_10m_max: dailyTimes.map(() => 12),
      wind_direction_10m_dominant: dailyTimes.map(() => 180),
    },
    daily_units: {
      temperature_2m_max: "°F",
      temperature_2m_min: "°F",
      precipitation_probability_max: "%",
      wind_speed_10m_max: "mph",
    },
    timezone_abbreviation: "PST",
  };
}

describe("getDailyForecast", () => {
  it("returns an empty array when there's no daily data", () => {
    expect(getDailyForecast(null)).toEqual([]);
  });

  it("labels today, tomorrow, and later days by weekday", () => {
    const weather = makeWeather("2026-07-26T14:00", [
      "2026-07-26",
      "2026-07-27",
      "2026-07-28",
    ]);

    const days = getDailyForecast(weather);

    expect(days.map((d) => d.label)).toEqual(["Today", "Tomorrow", "Tuesday"]);
    expect(days[0].point.temperatureMax).toBe(80);
    expect(days[0].point.temperatureMin).toBe(60);
  });
});
