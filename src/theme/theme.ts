import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

import brand from "./brandColors";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  fonts: {
    heading: `Comfortaa, sans-serif`,
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

export default theme;
