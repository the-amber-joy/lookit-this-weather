import { useTheme } from "@chakra-ui/react";

import { useDayModePreference } from "../context/DayModePreferenceContext";
import { useThemeName } from "../context/ThemeNameContext";
import { useWeatherContext } from "../context/WeatherContext";
import { useSystemPrefersDark } from "./systemColorScheme";

export interface DayMode {
  isDay: boolean;
  /** Primary heading/label text color for nav, MetricCard, and other chrome
   * sitting on top of surfaceBg/pageBackground. */
  textColor: string;
  /** Shadow color paired with textColor for contrast against the card's gradient. */
  textShadow: string;
  /** Secondary/quieter text color. */
  subTextColor: string;
  /** Background for neutral surfaces (MetricCard, nav bar). Undefined keeps
   * the existing default/night styling untouched. */
  surfaceBg: string | undefined;
  /** Text/icon color for MetricCard specifically, which renders directly on
   * surfaceBg rather than pageBackground. Fairycore's surfaceBg is a light
   * pastel purple, so it needs dark text here even though textColor (used
   * elsewhere against the darker pageBackground) is light. */
  cardTextColor: string;
  /** Accent color (Chakra color token) for active nav items etc. */
  accentColor: string;
  /** Fixed full-page background gradient shown behind everything during the
   * day. Undefined keeps the existing static (night) body background. */
  pageBackground: string | undefined;
  /** Heading/temperature text color for the Hero and ComfortCard showcase
   * cards specifically. These sit on their own weather-gradient background
   * (which ranges from mid to very light tones), not surfaceBg/pageBackground,
   * so they're kept separate from textColor. */
  showcaseTextColor: string;
  /** Shadow color paired with showcaseTextColor. */
  showcaseTextShadow: string;
  /** Secondary/quieter text color for the showcase cards. */
  showcaseSubTextColor: string;
}

/**
 * Both themes swap to a lighter daytime look and need dark text/accents for
 * contrast; their nighttime look (deep tones, white text) is handled
 * entirely by the static theme. This hook centralizes that swap so Hero,
 * ComfortCard, MetricCard, and Layout stay in sync. Whether "day" actually
 * means it's daytime, or is forced on/off, or follows the device's light/
 * dark setting, is controlled by the user's day-mode preference
 * (time/system/day/night).
 */
export function useDayMode(): DayMode {
  const { colors } = useTheme();
  const { themeName } = useThemeName();
  const { weather } = useWeatherContext();
  const { dayModePreference } = useDayModePreference();
  const systemPrefersDark = useSystemPrefersDark();

  const isDay =
    dayModePreference === "time"
      ? weather?.current.is_day === 1
      : dayModePreference === "system"
        ? !systemPrefersDark
        : dayModePreference === "day";

  if (!isDay) {
    return {
      isDay,
      textColor: colors.white,
      textShadow: colors.brand.ajBlueLvls["200"],
      subTextColor: colors.whiteAlpha["900"],
      surfaceBg: undefined,
      cardTextColor: colors.white,
      accentColor: "brand.ajCheez",
      pageBackground: undefined,
      // Unused by Hero/ComfortCard at night (they compute their own
      // per-condition tone), but kept consistent with the chrome colors.
      showcaseTextColor: colors.white,
      showcaseTextShadow: colors.brand.ajBlueLvls["200"],
      showcaseSubTextColor: colors.whiteAlpha["900"],
    };
  }

  if (themeName === "fairycore") {
    return {
      isDay,
      // Light text (rather than dark) so it stays legible and on-brand
      // against the purple/pink/gold pastel page gradient below, paired
      // with a dark shadow for contrast against the lighter parts of it.
      textColor: colors.white,
      textShadow: colors.blackAlpha["400"],
      subTextColor: colors.whiteAlpha["900"],
      surfaceBg: colors.brand.ajPurpleLvls["600"],
      // Dark, unlike textColor above: MetricCard sits on this light pastel
      // purple surface, not the page gradient, so it needs dark text for
      // contrast rather than the light text used elsewhere.
      cardTextColor: colors.brand.ajPurpleLvls["200"],
      accentColor: "brand.ajPinkLvls.200",
      // Starting with lilac (bridging the Hero/ComfortCard's purple-gold
      // gradient) before easing into blush and antique gold keeps the page
      // from clashing with the purple showcase cards up top.
      pageBackground: `linear-gradient(160deg, ${colors.brand.ajPurpleLvls["300"]}, ${colors.brand.ajPinkLvls["300"]}, ${colors.brand.ajCheezLvls["300"]})`,
      showcaseTextColor: colors.brand.ajBlueLvls["200"],
      showcaseTextShadow: colors.blackAlpha["400"],
      showcaseSubTextColor: colors.brand.ajBlueLvls["100"],
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
    cardTextColor: colors.brand.ajBlueLvls["200"],
    accentColor: colors.brand.ajBlueLvls["400"],
    // A warm-gold-into-sky-blue gradient, distinct from the Hero/ComfortCard's
    // own weather-condition gradient (which for clear skies is built from
    // these same blue levels) so the page doesn't read as an enlarged copy
    // of the showcase cards.
    pageBackground: `linear-gradient(160deg, ${colors.brand.ajCheezLvls["700"]}, ${colors.brand.ajBlueLvls["700"]}, ${colors.brand.ajBlueLvls["900"]})`,
    // White showcase text with a strong dark shadow reads well across the
    // Hero/ComfortCard gradient's full range, from medium to very light blue.
    showcaseTextColor: colors.white,
    showcaseTextShadow: colors.blackAlpha["700"],
    showcaseSubTextColor: colors.whiteAlpha["900"],
  };
}
