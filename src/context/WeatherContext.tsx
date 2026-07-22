import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
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
  const isRefreshing = useRef(false);

  const refresh = useCallback(async () => {
    if (isRefreshing.current) return;
    isRefreshing.current = true;

    setIsLoading(true);
    setError(null);
    setStatus("Loading current conditions...");

    try {
      const nextLocation = await getLocation();
      const [nextWeather, nextAirQuality] = await Promise.all([
        getWeather(nextLocation),
        getAirQuality(nextLocation).catch(() => null),
      ]);
      // TEMP MOCK (design preview): uncomment to force specific conditions
      // instead of using the real forecast. Set weather_code to any WMO code
      // (e.g. 0/1 clear, 2/3 cloudy, 45/48 fog, 61+ rain, 71+ snow, 95+ thunder)
      // and is_day to 1 (day) or 0 (night).
      // nextWeather.current.weather_code = 45;
      // nextWeather.current.is_day = 1;
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
      isRefreshing.current = false;
    }
  }, []);

  useEffect(() => {
    const REFRESH_INTERVAL = 10 * 60 * 1000; // 10 minutes
    let lastRefresh = Date.now();

    const doRefresh = () => {
      lastRefresh = Date.now();
      refresh();
    };

    doRefresh();

    const intervalId = setInterval(doRefresh, REFRESH_INTERVAL);

    // Android (and other mobile) browsers throttle or fully suspend
    // setInterval timers while a PWA is backgrounded/screen-locked, so the
    // interval alone can't be trusted to fire every 10 minutes. Catch up as
    // soon as the app becomes visible again.
    const handleVisibilityChange = () => {
      if (
        document.visibilityState === "visible" &&
        Date.now() - lastRefresh >= REFRESH_INTERVAL
      ) {
        doRefresh();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
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
