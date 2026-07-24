// User-facing override for whether the app should look like "day" or
// "night", independent of the selected theme. Kept in its own module (no
// dependencies) alongside themeNames.ts.
export type DayModePreference = "time" | "system" | "day" | "night";

export const DEFAULT_DAY_MODE_PREFERENCE: DayModePreference = "time";

export const DAY_MODE_PREFERENCE_STORAGE_KEY =
  "lookit-this-weather:day-mode-preference";

export interface DayModePreferenceOption {
  value: DayModePreference;
  label: string;
  description: string;
}

export const DAY_MODE_PREFERENCE_OPTIONS: DayModePreferenceOption[] = [
  {
    value: "time",
    label: "Time of Day",
    description: "Match the current time of day.",
  },
  {
    value: "system",
    label: "Device",
    description: "Match your device's light/dark setting.",
  },
  {
    value: "day",
    label: "Day",
    description: "Always use the light mode.",
  },
  {
    value: "night",
    label: "Night",
    description: "Always use the dark mode.",
  },
];

export function isDayModePreference(
  value: string | null,
): value is DayModePreference {
  return (
    value === "time" ||
    value === "system" ||
    value === "day" ||
    value === "night"
  );
}
