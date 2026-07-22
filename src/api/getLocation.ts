import { Location } from "./types";

export const HOME_LOCATION: Location = {
  latitude: 45.00982,
  longitude: -93.47993,
  name: "Home",
};

function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported."));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: 8000,
      maximumAge: 300000,
    });
  });
}

interface ReverseGeocodeResponse {
  city?: string;
  locality?: string;
  principalSubdivision?: string;
  principalSubdivisionCode?: string;
}

async function reverseGeocode(
  latitude: number,
  longitude: number,
): Promise<string> {
  const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
  const response = await fetch(url, { signal: AbortSignal.timeout(10000) });
  if (!response.ok) throw new Error("Reverse geocoding failed.");

  const data: ReverseGeocodeResponse = await response.json();
  const city = data.city || data.locality;
  // principalSubdivisionCode looks like "US-MN"; grab the "MN" part.
  const state =
    data.principalSubdivisionCode?.split("-")[1] || data.principalSubdivision;

  if (city && state) return `${city}, ${state}`;
  return city || state || "Current location";
}

export async function getLocation(): Promise<Location> {
  try {
    const position = await getCurrentPosition();
    const { latitude, longitude } = position.coords;

    let name = "Current location";
    try {
      name = await reverseGeocode(latitude, longitude);
    } catch {
      // Keep the fallback name if reverse geocoding fails.
    }

    return { latitude, longitude, name };
  } catch {
    return HOME_LOCATION;
  }
}
