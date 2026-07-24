// User-facing override for whether the app should look like "day" or
// "night", independent of the selected theme. Kept in its own module (no
// dependencies) alongside themeNames.ts.
export type DayModePreference = "dynamic" | "day" | "night";

export const DEFAULT_DAY_MODE_PREFERENCE: DayModePreference = "dynamic";

export const DAY_MODE_PREFERENCE_STORAGE_KEY =
  "lookit-this-weather:day-mode-preference";

export interface DayModePreferenceOption {
  value: DayModePreference;
  label: string;
  description: string;
}

export const DAY_MODE_PREFERENCE_OPTIONS: DayModePreferenceOption[] = [
  {
    value: "dynamic",
    label: "Dynamic",
    description: "Match the current time of day.",
  },
  {
    value: "day",
    label: "Day",
    description: "Always use the daytime look.",
  },
  {
    value: "night",
    label: "Night",
    description: "Always use the nighttime look.",
  },
];

export function isDayModePreference(
  value: string | null,
): value is DayModePreference {
  return value === "dynamic" || value === "day" || value === "night";
}
