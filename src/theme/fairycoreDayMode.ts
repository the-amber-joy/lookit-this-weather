import { useTheme } from "@chakra-ui/react";

import { useThemeName } from "../context/ThemeNameContext";
import { useWeatherContext } from "../context/WeatherContext";

export interface FairycoreDayMode {
  isFairycoreDay: boolean;
  /** Primary heading/label text color for showcase cards (Hero, ComfortCard). */
  textColor: string;
  /** Shadow color paired with textColor for contrast against the card's gradient. */
  textShadow: string;
  /** Secondary/quieter text color. */
  subTextColor: string;
  /** Background for neutral surfaces (MetricCard, nav bar). Undefined keeps
   * the existing default/night styling untouched. */
  surfaceBg: string | undefined;
  /** Accent color (Chakra color token) for active nav items etc. */
  accentColor: string;
}

/**
 * Fairycore's night look (deep jewel tones, white text) is handled entirely
 * by the static theme. During the day it swaps to a lighter, pastel garden
 * palette, which needs dark text/accents for contrast. This hook centralizes
 * that swap so Hero, ComfortCard, MetricCard, and Layout stay in sync.
 */
export function useFairycoreDayMode(): FairycoreDayMode {
  const { colors } = useTheme();
  const { themeName } = useThemeName();
  const { weather } = useWeatherContext();

  const isFairycoreDay =
    themeName === "fairycore" && weather?.current.is_day === 1;

  if (!isFairycoreDay) {
    return {
      isFairycoreDay,
      textColor: colors.white,
      textShadow: colors.brand.ajBlueLvls["200"],
      subTextColor: colors.whiteAlpha["900"],
      surfaceBg: undefined,
      accentColor: "brand.ajCheez",
    };
  }

  return {
    isFairycoreDay,
    textColor: colors.brand.ajBlueLvls["200"],
    textShadow: colors.brand.ajPurpleLvls["900"],
    subTextColor: colors.brand.ajBlueLvls["300"],
    surfaceBg: colors.brand.ajPurpleLvls["800"],
    accentColor: "brand.ajCheezLvls.300",
  };
}
