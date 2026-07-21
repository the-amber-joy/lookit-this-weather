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

function buildTheme(brand: BrandPalette, headingFont: string) {
  return extendTheme({
    config,
    fonts: {
      heading: headingFont,
      body: `Comfortaa, sans-serif`,
    },
    colors: {
      brand,
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
  default: buildTheme(brandPalettes.default, headingFonts.default),
  fairycore: buildTheme(brandPalettes.fairycore, headingFonts.fairycore),
};

export function getTheme(themeName: ThemeName) {
  return themesByName[themeName];
}

export default themesByName.fairycore;

