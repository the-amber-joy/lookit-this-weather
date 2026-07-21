// Brand color palettes, one per theme. Key names are kept stable
// (ajBlue/ajPurple/etc.) across palettes so component references
// don't need to change when the active theme changes.
import { ThemeName } from "./themeNames";

export type ColorLevels = Record<
  100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900,
  string
>;

export interface BrandPalette {
  ajBlue: string;
  ajPurple: string;
  ajMagenta: string;
  ajPink: string;
  ajOrange: string;
  ajCheez: string;
  ajYellow: string;
  ajLtGreen: string;
  ajDkGreen: string;
  ajBlueLvls: ColorLevels;
  ajPurpleLvls: ColorLevels;
  ajMagentaLvls: ColorLevels;
  ajPinkLvls: ColorLevels;
  ajOrangeLvls: ColorLevels;
  ajCheezLvls: ColorLevels;
  ajYellowLvls: ColorLevels;
  ajLtGreenLvls: ColorLevels;
  ajDkGreenLvls: ColorLevels;
}

// The original blue-and-gold palette.
const defaultBrand: BrandPalette = {
  ajBlue: "#2c73d2",
  ajPurple: "#845ec2",
  ajMagenta: "#d65db1",
  ajPink: "#ff6f91",
  ajOrange: "#ff9671",
  ajCheez: "#ffc75f",
  ajYellow: "#f9f871",
  ajLtGreen: "#7dc476",
  ajDkGreen: "#008f7a",

  ajBlueLvls: {
    100: "#09172a",
    200: "#122f54",
    300: "#1b467e",
    400: "#245da8",
    500: "#2c73d2",
    600: "#5790db",
    700: "#81ace4",
    800: "#abc8ed",
    900: "#d5e3f6",
  },
  ajPurpleLvls: {
    100: "#1a1029",
    200: "#331f53",
    300: "#4d2f7c",
    400: "#663fa6",
    500: "#845ec2",
    600: "#9c7dce",
    700: "#b59dda",
    800: "#cdbee6",
    900: "#e6def3",
  },
  ajMagentaLvls: {
    100: "#310c26",
    200: "#62184c",
    300: "#932572",
    400: "#c43198",
    500: "#d65db1",
    600: "#de7cc1",
    700: "#e79dd0",
    800: "#efbee0",
    900: "#f7deef",
  },
  ajPinkLvls: {
    100: "#490011",
    200: "#930022",
    300: "#dc0033",
    400: "#ff2759",
    500: "#ff6f91",
    600: "#ff8da7",
    700: "#ffa9bd",
    800: "#ffc6d3",
    900: "#ffe2e9",
  },
  ajOrangeLvls: {
    100: "#491400",
    200: "#932700",
    300: "#dc3b00",
    400: "#ff6027",
    500: "#ff9671",
    600: "#ffab8d",
    700: "#ffc0a9",
    800: "#ffd5c6",
    900: "#ffeae2",
  },
  ajCheezLvls: {
    100: "#462e00",
    200: "#8d5b00",
    300: "#d38900",
    400: "#ffaf1b",
    500: "#ffc75f",
    600: "#ffd381",
    700: "#ffdea0",
    800: "#ffe9c0",
    900: "#fff4df",
  },
  ajYellowLvls: {
    100: "#464603",
    200: "#8b8b06",
    300: "#d1d109",
    400: "#f6f62b",
    500: "#f9f871",
    600: "#fafa8d",
    700: "#fbfbaa",
    800: "#fdfdc6",
    900: "#fefee3",
  },
  ajLtGreenLvls: {
    100: "#152c13",
    200: "#2a5926",
    300: "#3f8539",
    400: "#54b14c",
    500: "#7dc476",
    600: "#98d092",
    700: "#b1dcae",
    800: "#cbe8c9",
    900: "#e5f3e4",
  },
  ajDkGreenLvls: {
    100: "#001d18",
    200: "#003931",
    300: "#005649",
    400: "#007261",
    500: "#008f7a",
    600: "#00d8b8",
    700: "#23ffde",
    800: "#6cffe9",
    900: "#b6fff4",
  },
};

// "Enchanted dusk garden" fairycore palette: twilight indigo, dusty lilac,
// moss/sage green, blush rose, and antique gold.
const fairycoreBrand: BrandPalette = {
  ajBlue: "#7d67a8",
  ajPurple: "#b8a4d4",
  ajMagenta: "#c98ca0",
  ajPink: "#e8b4bc",
  ajOrange: "#e2a76f",
  ajCheez: "#d4af7a",
  ajYellow: "#f2e2b6",
  ajLtGreen: "#8ba888",
  ajDkGreen: "#3f6b52",

  ajBlueLvls: {
    100: "#1c1a2e",
    200: "#2e2447",
    300: "#433566",
    400: "#5b4a85",
    500: "#7d67a8",
    600: "#9c86bf",
    700: "#b8a4d4",
    800: "#d4c4e6",
    900: "#ede4f5",
  },
  ajPurpleLvls: {
    100: "#16211a",
    200: "#2c4334",
    300: "#43644e",
    400: "#598568",
    500: "#8ba888",
    600: "#a3bc9f",
    700: "#bccfb8",
    800: "#d5e2d2",
    900: "#edf1ec",
  },
  ajMagentaLvls: {
    100: "#2c1620",
    200: "#582c40",
    300: "#844260",
    400: "#b05880",
    500: "#c98ca0",
    600: "#d5a3b3",
    700: "#e0bac6",
    800: "#ecd1da",
    900: "#f7e8ed",
  },
  ajPinkLvls: {
    100: "#331a1f",
    200: "#66333d",
    300: "#994d5c",
    400: "#cc667a",
    500: "#e8b4bc",
    600: "#ecc3ca",
    700: "#f1d2d7",
    800: "#f6e1e5",
    900: "#faf0f2",
  },
  ajOrangeLvls: {
    100: "#2f1d0e",
    200: "#5e3a1c",
    300: "#8e572a",
    400: "#bd7438",
    500: "#e2a76f",
    600: "#e8ba8c",
    700: "#eeccaa",
    800: "#f4ddc7",
    900: "#f9eee3",
  },
  ajCheezLvls: {
    100: "#362a13",
    200: "#6c5527",
    300: "#a37f3a",
    400: "#c29c5c",
    500: "#d4af7a",
    600: "#ddc094",
    700: "#e6d1af",
    800: "#eee2ca",
    900: "#f7f0e4",
  },
  ajYellowLvls: {
    100: "#3a3320",
    200: "#736640",
    300: "#ad9960",
    400: "#d1bd8b",
    500: "#f2e2b6",
    600: "#f5e9c7",
    700: "#f8efd8",
    800: "#faf5e9",
    900: "#fdfaf4",
  },
  ajLtGreenLvls: {
    100: "#16211a",
    200: "#2c4334",
    300: "#43644e",
    400: "#598568",
    500: "#8ba888",
    600: "#a3bc9f",
    700: "#bccfb8",
    800: "#d5e2d2",
    900: "#edf1ec",
  },
  ajDkGreenLvls: {
    100: "#0f1d16",
    200: "#1e3a2c",
    300: "#2e5741",
    400: "#3f6b52",
    500: "#5c8c72",
    600: "#7ea892",
    700: "#a0c3b1",
    800: "#c2ded1",
    900: "#e1f0e8",
  },
};

export const brandPalettes: Record<ThemeName, BrandPalette> = {
  default: defaultBrand,
  fairycore: fairycoreBrand,
};

export default brandPalettes;
