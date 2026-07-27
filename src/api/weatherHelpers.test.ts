import { describe, expect, it } from "vitest";

import { AirQualityObservation } from "./types";
import {
  formatWindUnit,
  getAqiCategory,
  getHighestAirQuality,
  getPollutantLabel,
  getPrecipitationType,
  getWindDirection,
} from "./weatherHelpers";

describe("getPrecipitationType", () => {
  it("returns 'None expected' when probability is 0", () => {
    expect(getPrecipitationType(0, 61)).toBe("None expected");
  });

  it("returns 'None expected' for codes below the precipitation threshold", () => {
    expect(getPrecipitationType(80, 2)).toBe("None expected");
  });

  it.each([
    [56, "Freezing rain"],
    [66, "Freezing rain"],
    [71, "Snow"],
    [85, "Snow"],
    [80, "Rain showers"],
    [95, "Thunderstorms"],
    [61, "Rain"],
  ])("maps weather code %i to %s", (weatherCode, expected) => {
    expect(getPrecipitationType(50, weatherCode)).toBe(expected);
  });
});

describe("getWindDirection", () => {
  it.each([
    [0, "N"],
    [45, "NE"],
    [90, "E"],
    [135, "SE"],
    [180, "S"],
    [225, "SW"],
    [270, "W"],
    [315, "NW"],
    [360, "N"],
  ])("maps %i degrees to %s", (degrees, expected) => {
    expect(getWindDirection(degrees)).toBe(expected);
  });
});

describe("formatWindUnit", () => {
  it("normalizes Open-Meteo's 'mp/h' to 'mph'", () => {
    expect(formatWindUnit("mp/h")).toBe("mph");
  });

  it("passes through other units unchanged", () => {
    expect(formatWindUnit("km/h")).toBe("km/h");
  });

  it("defaults to 'mph' when no unit is given", () => {
    expect(formatWindUnit(undefined)).toBe("mph");
  });
});

describe("getAqiCategory", () => {
  it.each([
    [25, "Good"],
    [75, "Moderate"],
    [125, "Unhealthy for sensitive groups"],
    [175, "Unhealthy"],
    [250, "Very unhealthy"],
    [400, "Hazardous"],
  ])("labels AQI %i as %s", (aqi, expected) => {
    expect(getAqiCategory(aqi).label).toBe(expected);
  });
});

describe("getPollutantLabel", () => {
  it("maps known parameter names to friendly labels", () => {
    expect(getPollutantLabel("OZONE")).toBe("Ozone");
    expect(getPollutantLabel("PM2.5")).toBe("PM2.5");
  });

  it("falls back to the raw value for unknown parameters", () => {
    expect(getPollutantLabel("CO")).toBe("CO");
  });
});

describe("getHighestAirQuality", () => {
  function observation(
    overrides: Partial<AirQualityObservation>,
  ): AirQualityObservation {
    return {
      dateObserved: "2026-07-26",
      hourObserved: "14",
      localTimeZone: "PST",
      reportingAreaName: "Test Area",
      siteID: null,
      siteName: null,
      parameterName: "OZONE",
      nowcastAQI: 50,
      aqiCategoryName: "Good",
      reportingAgency: "EPA",
      ...overrides,
    };
  }

  it("returns null for an empty list", () => {
    expect(getHighestAirQuality([])).toBeNull();
  });

  it("picks the observation with the highest AQI", () => {
    const observations = [
      observation({ parameterName: "OZONE", nowcastAQI: 40 }),
      observation({ parameterName: "PM2.5", nowcastAQI: 90 }),
    ];

    const result = getHighestAirQuality(observations);
    expect(result?.aqi).toBe(90);
    expect(result?.pollutant).toBe("PM2.5");
    expect(result?.category.label).toBe("Moderate");
  });
});
