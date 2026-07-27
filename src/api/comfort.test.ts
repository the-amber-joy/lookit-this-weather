import { describe, expect, it } from "vitest";

import { getComfort } from "./comfort";

describe("getComfort", () => {
  it.each([
    [10, 0, "Bitterly Cold"],
    [30, 0, "Freezing"],
    [45, 20, "Crisp & Cold"],
    [45, 55, "Raw & Damp"],
    [55, 20, "Cool & Crisp"],
    [70, 40, "Chef's Kiss"],
    [70, 66, "Warm & Muggy"],
    [70, 72, "Sticky Warmth"],
    [80, 40, "Warm & Comfy"],
    [80, 66, "Warm & Sticky"],
    [80, 72, "Hot & Heavy"],
    [90, 40, "Dry Heat"],
    [90, 62, "Hot"],
    [90, 72, "Oppressive"],
    [98, 40, "Scorching"],
    [98, 72, "Dangerously Hot"],
  ])(
    "labels %i°F with %i°F dew point as %s",
    (temperature, dewPoint, label) => {
      expect(getComfort(temperature, dewPoint).label).toBe(label);
    },
  );

  it("picks a blurb deterministically from the seed", () => {
    const first = getComfort(70, 40, 0);
    const second = getComfort(70, 40, 1);
    expect(first.blurb).not.toBe(second.blurb);
    // Same seed always yields the same blurb.
    expect(getComfort(70, 40, 0).blurb).toBe(first.blurb);
  });
});
