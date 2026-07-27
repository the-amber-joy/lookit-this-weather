import { describe, expect, it } from "vitest";

import {
  getHourlyForecast,
  getPrecipitationTiming,
  getRemainingPrecipitation,
} from "./getHourlyForecast";
import { WeatherResponse } from "./types";

function makeWeather(overrides: {
  currentTime: string;
  hourlyTimes: string[];
  precipitationProbability: number[];
  weatherCode: number[];
}): WeatherResponse {
  const { currentTime, hourlyTimes, precipitationProbability, weatherCode } =
    overrides;
  return {
    current: {
      time: currentTime,
      temperature_2m: 70,
      dew_point_2m: 55,
      precipitation_probability: precipitationProbability[0] ?? 0,
      weather_code: weatherCode[0] ?? 0,
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
    hourly: {
      time: hourlyTimes,
      temperature_2m: hourlyTimes.map(() => 70),
      dew_point_2m: hourlyTimes.map(() => 55),
      precipitation_probability: precipitationProbability,
      weather_code: weatherCode,
      is_day: hourlyTimes.map(() => 1),
      wind_speed_10m: hourlyTimes.map(() => 5),
    },
    hourly_units: {
      temperature_2m: "°F",
      dew_point_2m: "°F",
      precipitation_probability: "%",
      wind_speed_10m: "mph",
    },
    timezone_abbreviation: "PST",
  };
}

describe("getHourlyForecast", () => {
  it("returns an empty array when there's no hourly data", () => {
    expect(getHourlyForecast(null)).toEqual([]);
  });

  it("drops hours before the current hour and groups the rest by day", () => {
    const weather = makeWeather({
      currentTime: "2026-07-26T14:00",
      hourlyTimes: [
        "2026-07-26T13:00",
        "2026-07-26T14:00",
        "2026-07-26T15:00",
        "2026-07-27T00:00",
      ],
      precipitationProbability: [10, 20, 30, 40],
      weatherCode: [1, 1, 1, 1],
    });

    const days = getHourlyForecast(weather);

    expect(days).toHaveLength(2);
    expect(days[0].label).toBe("Today");
    expect(days[0].hours.map((h) => h.time)).toEqual([
      "2026-07-26T14:00",
      "2026-07-26T15:00",
    ]);
    expect(days[1].label).toBe("Tomorrow");
  });
});

describe("getPrecipitationTiming", () => {
  it("returns null when no hour today meets the threshold", () => {
    const weather = makeWeather({
      currentTime: "2026-07-26T14:00",
      hourlyTimes: ["2026-07-26T14:00", "2026-07-26T15:00"],
      precipitationProbability: [5, 10],
      weatherCode: [1, 1],
    });

    expect(getPrecipitationTiming(weather, 25)).toBeNull();
  });

  it("reports 'now' when the current hour already meets the threshold", () => {
    const weather = makeWeather({
      currentTime: "2026-07-26T14:00",
      hourlyTimes: ["2026-07-26T14:00", "2026-07-26T15:00"],
      precipitationProbability: [60, 10],
      weatherCode: [61, 1],
    });

    expect(getPrecipitationTiming(weather, 25)).toEqual({
      time: "now",
      probability: 60,
    });
  });

  it("finds the first future hour meeting the threshold", () => {
    const weather = makeWeather({
      currentTime: "2026-07-26T14:00",
      hourlyTimes: ["2026-07-26T14:00", "2026-07-26T15:00", "2026-07-26T16:00"],
      precipitationProbability: [5, 10, 45],
      weatherCode: [1, 1, 61],
    });

    const timing = getPrecipitationTiming(weather, 25);
    expect(timing?.probability).toBe(45);
    expect(timing?.time).toBe("4:00 PM");
  });
});

describe("getRemainingPrecipitation", () => {
  it("returns null when there's no hourly data", () => {
    expect(getRemainingPrecipitation(null)).toBeNull();
  });

  it("ignores hours before now and picks the peak remaining hour", () => {
    const weather = makeWeather({
      currentTime: "2026-07-26T14:00",
      hourlyTimes: [
        "2026-07-26T09:00", // already passed; a bigger storm, but shouldn't count
        "2026-07-26T14:00",
        "2026-07-26T18:00",
      ],
      precipitationProbability: [90, 20, 55],
      weatherCode: [95, 3, 61],
    });

    expect(getRemainingPrecipitation(weather)).toEqual({
      probability: 55,
      weatherCode: 61,
    });
  });
});
