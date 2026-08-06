import { ThemeName } from "./themeNames";

// A softly asymmetric radius used for the Fairycore theme's showcase cards
// (Hero, ComfortCard) so they read as organic/whimsical rather than boxy.
const ORGANIC_RADIUS = "2rem 3.5rem 2rem 3.5rem";

interface OrganicCardStyle {
  background: string;
  borderRadius: string;
  border?: string;
}

/**
 * Builds the background/border/radius for a "showcase" card (one with a
 * weather-gradient background). Fairycore layers a thin lilac-to-gold
 * gradient border on top of the weather gradient and swaps in an asymmetric
 * corner radius; synthwave layers a neon magenta-to-cyan gradient border but
 * keeps the given base radius (square/retro rather than organic); other
 * themes get the plain gradient and the given base radius.
 */
export function getOrganicCardStyle(
  themeName: ThemeName,
  brandColors: {
    ajPurple: string;
    ajCheez: string;
    ajMagenta: string;
    ajBlue: string;
  },
  background: string,
  baseRadius: string,
): OrganicCardStyle {
  if (themeName === "synthwave") {
    return {
      background: `${background} padding-box, linear-gradient(135deg, ${brandColors.ajMagenta}, ${brandColors.ajBlue}) border-box`,
      borderRadius: baseRadius,
      border: "2px solid transparent",
    };
  }

  if (themeName !== "fairycore") {
    return { background, borderRadius: baseRadius };
  }

  return {
    background: `${background} padding-box, linear-gradient(135deg, ${brandColors.ajPurple}, ${brandColors.ajCheez}) border-box`,
    borderRadius: ORGANIC_RADIUS,
    border: "1px solid transparent",
  };
}
