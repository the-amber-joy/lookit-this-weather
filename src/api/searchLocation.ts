import { Location } from "./types";

interface OpenMeteoGeocodingResult {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  country_code?: string;
  admin1?: string;
}

interface OpenMeteoGeocodingResponse {
  results?: OpenMeteoGeocodingResult[];
}

function formatGeocodingName(result: OpenMeteoGeocodingResult): string {
  const region =
    result.country_code === "US" ? result.admin1 : result.country;
  return region ? `${result.name}, ${region}` : result.name;
}

async function searchByName(query: string): Promise<Location[]> {
  const params = new URLSearchParams({
    name: query,
    count: "8",
    language: "en",
    format: "json",
  });

  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?${params}`,
    { signal: AbortSignal.timeout(8000) },
  );
  if (!response.ok) throw new Error("Location search failed.");

  const data: OpenMeteoGeocodingResponse = await response.json();
  return (data.results ?? []).map((result) => ({
    latitude: result.latitude,
    longitude: result.longitude,
    name: formatGeocodingName(result),
  }));
}

interface ZippopotamPlace {
  "place name": string;
  "state abbreviation": string;
  latitude: string;
  longitude: string;
}

interface ZippopotamResponse {
  places: ZippopotamPlace[];
}

async function searchByZip(zip: string): Promise<Location[]> {
  const response = await fetch(`https://api.zippopotam.us/us/${zip}`, {
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) return [];

  const data: ZippopotamResponse = await response.json();
  return data.places.map((place) => ({
    latitude: Number(place.latitude),
    longitude: Number(place.longitude),
    name: `${place["place name"]}, ${place["state abbreviation"]}`,
  }));
}

const US_ZIP_PATTERN = /^\d{5}$/;

/**
 * Searches for a location by US zip code or, failing that, by city/place
 * name. Zippopotam.us handles exact zip lookups; Open-Meteo's geocoding API
 * (the same provider used for forecasts) handles free-text place search.
 */
export async function searchLocations(query: string): Promise<Location[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  if (US_ZIP_PATTERN.test(trimmed)) {
    const zipResults = await searchByZip(trimmed);
    if (zipResults.length > 0) return zipResults;
  }

  return searchByName(trimmed);
}
