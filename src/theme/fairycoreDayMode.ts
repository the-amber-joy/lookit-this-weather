import { useTheme } from "@chakra-ui/react";

import { useDayModePreference } from "../context/DayModePreferenceContext";
import { useThemeName } from "../context/ThemeNameContext";
import { useWeatherContext } from "../context/WeatherContext";

export interface DayMode {
  isDay: boolean;
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
  /** Fixed full-page background gradient shown behind everything during the
   * day. Undefined keeps the existing static (night) body background. */
  pageBackground: string | undefined;
}

/**
 * Both themes swap to a lighter daytime look and need dark text/accents for
 * contrast; their nighttime look (deep tones, white text) is handled
 * entirely by the static theme. This hook centralizes that swap so Hero,
 * ComfortCard, MetricCard, and Layout stay in sync. Whether "day" actually
 * means it's daytime, or is forced on/off, is controlled by the user's
 * day-mode preference (dynamic/day/night).
 */
export function useDayMode(): DayMode {
  const { colors } = useTheme();
  const { themeName } = useThemeName();
  const { weather } = useWeatherContext();
  const { dayModePreference } = useDayModePreference();

  const isDay =
    dayModePreference === "dynamic"
      ? weather?.current.is_day === 1
      : dayModePreference === "day";

  if (!isDay) {
    return {
      isDay,
      textColor: colors.white,
      textShadow: colors.brand.ajBlueLvls["200"],
      subTextColor: colors.whiteAlpha["900"],
      surfaceBg: undefined,
      accentColor: "brand.ajCheez",
      pageBackground: undefined,
    };
  }

  if (themeName === "fairycore") {
    return {
      isDay,
      textColor: colors.brand.ajBlueLvls["200"],
      textShadow: colors.blackAlpha["400"],
      subTextColor: colors.brand.ajBlueLvls["100"],
      surfaceBg: colors.brand.ajPurpleLvls["600"],
      accentColor: "brand.ajPinkLvls.200",
      // Starting with lilac (bridging the Hero/ComfortCard's purple-gold
      // gradient) before easing into blush and antique gold keeps the page
      // from clashing with the purple showcase cards up top.
      pageBackground: `linear-gradient(160deg, ${colors.brand.ajPurpleLvls["300"]}, ${colors.brand.ajPinkLvls["300"]}, ${colors.brand.ajCheezLvls["300"]})`,
    };
  }

  // Default theme, daytime: lighter blue surface with dark text, instead of
  // the navy chrome used at night. Matches the brightness of the existing
  // clear-day card gradient so plain white text elsewhere (Daily, Hourly,
  // Controls) stays legible against the page background.
  return {
    isDay,
    textColor: colors.brand.ajBlueLvls["200"],
    textShadow: colors.blackAlpha["400"],
    subTextColor: colors.brand.ajBlueLvls["300"],
    surfaceBg: colors.brand.ajBlueLvls["800"],
    accentColor: colors.brand.ajBlueLvls["400"],
    pageBackground: `linear-gradient(160deg, ${colors.brand.ajBlueLvls["400"]}, ${colors.brand.ajBlueLvls["600"]}, ${colors.brand.ajBlueLvls["800"]})`,
  };
}
