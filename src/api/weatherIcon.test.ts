import { describe, expect, it } from "vitest";

import { getPrecipitationIcon, getWeatherTextTone } from "./weatherIcon";

describe("getPrecipitationIcon", () => {
  it("returns the 'none' icon when probability is 0", () => {
    expect(getPrecipitationIcon(0, 61)).toBe(getPrecipitationIcon(0, 95));
  });

  it("returns the 'none' icon for a non-precipitation code only when probability is low", () => {
    expect(getPrecipitationIcon(0, 2)).toBe(getPrecipitationIcon(0, 61));
  });

  it("returns the 'none' icon for probabilities at or below the 20% threshold", () => {
    expect(getPrecipitationIcon(20, 61)).toBe(getPrecipitationIcon(0, 61));
    expect(getPrecipitationIcon(21, 61)).not.toBe(getPrecipitationIcon(0, 61));
  });

  it("still shows a rain icon for a 'partly cloudy' code with a nonzero chance of rain", () => {
    // A day/hour's summary weatherCode (e.g. "partly cloudy") can legitimately
    // co-occur with a real chance of rain -- it must not force the "none" icon.
    expect(getPrecipitationIcon(47, 2)).not.toBe(getPrecipitationIcon(0, 61));
    expect(getPrecipitationIcon(47, 2)).toBe(getPrecipitationIcon(47, 61));
  });

  it("distinguishes thunder, sleet, snow, drizzle, and rain codes", () => {
    const thunder = getPrecipitationIcon(50, 95);
    const sleet = getPrecipitationIcon(50, 56);
    const snow = getPrecipitationIcon(50, 71);
    const drizzle = getPrecipitationIcon(50, 51);
    const rain = getPrecipitationIcon(50, 61);

    const icons = [thunder, sleet, snow, drizzle, rain];
    expect(new Set(icons).size).toBe(icons.length);
  });
});

describe("getWeatherTextTone", () => {
  it("returns either 'light' or 'dark' for every condition/day-night combination", () => {
    const weatherCodes = [0, 2, 45, 61, 71, 95];
    for (const code of weatherCodes) {
      for (const isDay of [0, 1]) {
        expect(["light", "dark"]).toContain(getWeatherTextTone(code, isDay));
      }
    }
  });
});
