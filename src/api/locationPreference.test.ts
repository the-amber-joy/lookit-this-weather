import { describe, expect, it } from "vitest";

import { isSameLocation } from "./locationPreference";
import { Location } from "./types";

describe("isSameLocation", () => {
  it("returns true for identical lat/lng", () => {
    const a: Location = {
      latitude: 44.9778,
      longitude: -93.265,
      name: "Minneapolis, MN",
    };
    const b: Location = {
      latitude: 44.9778,
      longitude: -93.265,
      name: "Minneapolis, MN",
    };
    expect(isSameLocation(a, b)).toBe(true);
  });

  it("returns true when lat/lng differ slightly but the name matches", () => {
    const a: Location = {
      latitude: 44.9778,
      longitude: -93.265,
      name: "Minneapolis, MN",
    };
    const b: Location = {
      latitude: 44.978,
      longitude: -93.2648,
      name: "Minneapolis, MN",
    };
    expect(isSameLocation(a, b)).toBe(true);
  });

  it("returns true when names match with different casing", () => {
    const a: Location = {
      latitude: 44.9778,
      longitude: -93.265,
      name: "Minneapolis, MN",
    };
    const b: Location = {
      latitude: 44.978,
      longitude: -93.2648,
      name: "minneapolis, mn",
    };
    expect(isSameLocation(a, b)).toBe(true);
  });

  it("returns false for different locations", () => {
    const a: Location = {
      latitude: 44.9778,
      longitude: -93.265,
      name: "Minneapolis, MN",
    };
    const b: Location = {
      latitude: 34.0522,
      longitude: -118.2437,
      name: "Los Angeles, CA",
    };
    expect(isSameLocation(a, b)).toBe(false);
  });
});
