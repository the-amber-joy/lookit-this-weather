// Storage keys and pure helpers for the location search feature, kept in
// their own module (no dependencies) alongside the other preference
// modules so the context provider stays focused on state management.
import { Location } from "./types";

export type LocationMode = "current" | "manual";

export const DEFAULT_LOCATION_MODE: LocationMode = "current";

export const LOCATION_MODE_STORAGE_KEY = "lookit-this-weather:location-mode";
export const MANUAL_LOCATION_STORAGE_KEY =
  "lookit-this-weather:manual-location";
export const RECENT_LOCATIONS_STORAGE_KEY =
  "lookit-this-weather:recent-locations";
export const LAST_RESOLVED_LOCATION_STORAGE_KEY =
  "lookit-this-weather:last-resolved-location";

export const MAX_RECENT_LOCATIONS = 5;

export function isLocationMode(value: string | null): value is LocationMode {
  return value === "current" || value === "manual";
}

export function isLocation(value: unknown): value is Location {
  return (
    !!value &&
    typeof value === "object" &&
    typeof (value as Location).latitude === "number" &&
    typeof (value as Location).longitude === "number" &&
    typeof (value as Location).name === "string"
  );
}

export function isLocationArray(value: unknown): value is Location[] {
  return Array.isArray(value) && value.every(isLocation);
}

export function isSameLocation(a: Location, b: Location): boolean {
  return a.latitude === b.latitude && a.longitude === b.longitude;
}
