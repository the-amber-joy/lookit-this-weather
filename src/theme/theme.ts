import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

import brandPalettes, { BrandPalette } from "./brandColors";
import { ThemeName } from "./themeNames";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const headingFonts: Record<ThemeName, string> = {
  default: `Comfortaa, sans-serif`,
  fairycore: `"Cormorant Garamond", serif`,
};

const fairycoreGlowColor = brandPalettes.fairycore.ajPurple;

// Card shadows: default theme keeps a standard drop shadow, fairycore gets
// a subtle color glow to match the whimsical palette (kept small so it
// doesn't get clipped by tight layout margins).
const cardShadows: Record<ThemeName, string> = {
  default:
    "0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.4)",
  fairycore: `0 0 6px ${fairycoreGlowColor}40, 0 4px 10px rgba(28, 26, 46, 0.4)`,
};

function buildTheme(brand: BrandPalette, headingFont: string, cardShadow: string) {
  return extendTheme({
    config,
    fonts: {
      heading: headingFont,
      body: `Comfortaa, sans-serif`,
    },
    colors: {
      brand,
    },
    shadows: {
      card: cardShadow,
    },
    styles: {
      global: {
        "html, body": {
          height: "100%",
          overscrollBehavior: "none",
        },
        body: {
          bg: brand.ajBlueLvls["100"],
          overflow: "hidden",
        },
      },
    },
    components: {
      Button: {
        baseStyle: {
          borderRadius: ".25rem",
          _focus: {
            // Hex codes for transparency https://gist.github.com/lopspower/03fb1cc0ac9f32ef38f4
            // 99 == 60%
            boxShadow: `0 0 0 3px ${brand.ajPurple}99`,
          },
        },
      },
      Link: {
        baseStyle: {
          color: brand.ajCheez,
          borderRadius: ".25rem",
          _focus: {
            boxShadow: `0 0 0 3px ${brand.ajPurple}99`,
          },
        },
      },
    },
  });
}

export const themesByName: Record<ThemeName, ReturnType<typeof buildTheme>> = {
  default: buildTheme(brandPalettes.default, headingFonts.default, cardShadows.default),
  fairycore: buildTheme(
    brandPalettes.fairycore,
    headingFonts.fairycore,
    cardShadows.fairycore,
  ),
};


export function getTheme(themeName: ThemeName) {
  return themesByName[themeName];
}

export default themesByName.fairycore;

