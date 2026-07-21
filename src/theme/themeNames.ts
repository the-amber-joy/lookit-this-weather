// Shared theme identifiers, kept in their own module (no dependencies) so
// both the Chakra theme builder and weather-icon gradients can reference
// them without creating circular imports.
export type ThemeName = "default" | "fairycore";

export const DEFAULT_THEME_NAME: ThemeName = "fairycore";

export const THEME_STORAGE_KEY = "lookit-this-weather:theme";

export interface ThemeOption {
  name: ThemeName;
  label: string;
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    name: "default",
    label: "Default",
  },
  {
    name: "fairycore",
    label: "Fairycore",
  },
];

export function isThemeName(value: string | null): value is ThemeName {
  return value === "default" || value === "fairycore";
}
