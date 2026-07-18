import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { setWeatherFavicon } from "../api/favicon";
import { getAirQuality } from "../api/getAirQuality";
import { getLocation, HOME_LOCATION } from "../api/getLocation";
import { getWeather } from "../api/getWeather";
import { AirQualityResponse, Location, WeatherResponse } from "../api/types";

interface WeatherContextValue {
  location: Location | null;
  weather: WeatherResponse | null;
  airQuality: AirQualityResponse | null;
  isLoading: boolean;
  error: string | null;
  status: string;
  refresh: () => void;
}

const WeatherContext = createContext<WeatherContextValue | undefined>(
  undefined,
);

export const WeatherProvider = ({ children }: { children: ReactNode }) => {
  const [location, setLocation] = useState<Location | null>(null);
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [airQuality, setAirQuality] = useState<AirQualityResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("");

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setStatus("Loading current conditions...");

    try {
      const nextLocation = await getLocation();
      const [nextWeather, nextAirQuality] = await Promise.all([
        getWeather(nextLocation),
        getAirQuality(nextLocation).catch(() => null),
      ]);
      setLocation(nextLocation);
      setWeather(nextWeather);
      setAirQuality(nextAirQuality);
      setStatus(
        nextLocation === HOME_LOCATION
          ? "Using Home because location is unavailable."
          : "",
      );
    } catch (err) {
      setWeather(null);
      setAirQuality(null);
      setStatus("");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();

    const REFRESH_INTERVAL = 15 * 60 * 1000; // 15 minutes
    const intervalId = setInterval(refresh, REFRESH_INTERVAL);
    return () => clearInterval(intervalId);
  }, [refresh]);

  useEffect(() => {
    if (weather) {
      setWeatherFavicon(weather.current.weather_code, weather.current.is_day);
    }
  }, [weather]);

  const value = useMemo(
    () => ({
      location,
      weather,
      airQuality,
      isLoading,
      error,
      status,
      refresh,
    }),
    [location, weather, airQuality, isLoading, error, status, refresh],
  );

  return (
    <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>
  );
};

export const useWeatherContext = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error("useWeatherContext must be used within a WeatherProvider");
  }
  return context;
};
