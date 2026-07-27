import { describe, expect, it } from "vitest";

import { getPrecipitationIcon, getWeatherTextTone } from "./weatherIcon";

describe("getPrecipitationIcon", () => {
  it("returns the 'none' icon when probability is 0", () => {
    expect(getPrecipitationIcon(0, 61)).toBe(getPrecipitationIcon(0, 95));
  });

  it("returns the 'none' icon for codes below the precipitation threshold", () => {
    expect(getPrecipitationIcon(80, 2)).toBe(getPrecipitationIcon(0, 61));
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
