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
 * weather-gradient background). In the Fairycore theme this layers a thin
 * lilac-to-gold gradient border on top of the weather gradient and swaps in
 * an asymmetric corner radius; other themes get the plain gradient and the
 * given base radius.
 */
export function getOrganicCardStyle(
  themeName: ThemeName,
  brandColors: { ajPurple: string; ajCheez: string },
  background: string,
  baseRadius: string,
): OrganicCardStyle {
  if (themeName !== "fairycore") {
    return { background, borderRadius: baseRadius };
  }

  return {
    background: `${background} padding-box, linear-gradient(135deg, ${brandColors.ajPurple}, ${brandColors.ajCheez}) border-box`,
    borderRadius: ORGANIC_RADIUS,
    border: "1px solid transparent",
  };
}
