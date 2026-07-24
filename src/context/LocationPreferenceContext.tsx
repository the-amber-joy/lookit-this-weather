import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

import {
  DEFAULT_LOCATION_MODE,
  isLocation,
  isLocationArray,
  isLocationMode,
  isSameLocation,
  LAST_RESOLVED_LOCATION_STORAGE_KEY,
  LOCATION_MODE_STORAGE_KEY,
  LocationMode,
  MANUAL_LOCATION_STORAGE_KEY,
  MAX_RECENT_LOCATIONS,
  RECENT_LOCATIONS_STORAGE_KEY,
} from "../api/locationPreference";
import { Location } from "../api/types";

interface LocationPreferenceContextValue {
  mode: LocationMode;
  manualLocation: Location | null;
  lastResolvedLocation: Location | null;
  recentLocations: Location[];
  selectLocation: (location: Location) => void;
  selectCurrentLocation: () => void;
  removeRecentLocation: (location: Location) => void;
  setLastResolvedLocation: (location: Location) => void;
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
}

const LocationPreferenceContext = createContext<
  LocationPreferenceContextValue | undefined
>(undefined);

function getInitialMode(): LocationMode {
  try {
    const stored = localStorage.getItem(LOCATION_MODE_STORAGE_KEY);
    return isLocationMode(stored) ? stored : DEFAULT_LOCATION_MODE;
  } catch {
    return DEFAULT_LOCATION_MODE;
  }
}

function getInitialManualLocation(): Location | null {
  try {
    const stored = localStorage.getItem(MANUAL_LOCATION_STORAGE_KEY);
    if (!stored) return null;
    const parsed: unknown = JSON.parse(stored);
    return isLocation(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function getInitialRecentLocations(): Location[] {
  try {
    const stored = localStorage.getItem(RECENT_LOCATIONS_STORAGE_KEY);
    if (!stored) return [];
    const parsed: unknown = JSON.parse(stored);
    return isLocationArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function getInitialLastResolvedLocation(): Location | null {
  try {
    const stored = localStorage.getItem(LAST_RESOLVED_LOCATION_STORAGE_KEY);
    if (!stored) return null;
    const parsed: unknown = JSON.parse(stored);
    return isLocation(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export const LocationPreferenceProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [mode, setMode] = useState<LocationMode>(getInitialMode);
  const [manualLocation, setManualLocation] = useState<Location | null>(
    getInitialManualLocation,
  );
  const [recentLocations, setRecentLocations] = useState<Location[]>(
    getInitialRecentLocations,
  );
  const [lastResolvedLocation, setLastResolvedLocationState] =
    useState<Location | null>(getInitialLastResolvedLocation);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const selectLocation = useCallback((location: Location) => {
    setMode("manual");
    setManualLocation(location);
    setRecentLocations((prev) => {
      const next = [
        location,
        ...prev.filter((existing) => !isSameLocation(existing, location)),
      ].slice(0, MAX_RECENT_LOCATIONS);
      try {
        localStorage.setItem(
          RECENT_LOCATIONS_STORAGE_KEY,
          JSON.stringify(next),
        );
      } catch {
        // Ignore storage failures (e.g. private browsing).
      }
      return next;
    });

    try {
      localStorage.setItem(LOCATION_MODE_STORAGE_KEY, "manual");
      localStorage.setItem(
        MANUAL_LOCATION_STORAGE_KEY,
        JSON.stringify(location),
      );
    } catch {
      // Ignore storage failures (e.g. private browsing).
    }
  }, []);

  const selectCurrentLocation = useCallback(() => {
    setMode("current");
    try {
      localStorage.setItem(LOCATION_MODE_STORAGE_KEY, "current");
    } catch {
      // Ignore storage failures (e.g. private browsing).
    }
  }, []);

  const removeRecentLocation = useCallback((location: Location) => {
    setRecentLocations((prev) => {
      const next = prev.filter(
        (existing) => !isSameLocation(existing, location),
      );
      try {
        localStorage.setItem(
          RECENT_LOCATIONS_STORAGE_KEY,
          JSON.stringify(next),
        );
      } catch {
        // Ignore storage failures (e.g. private browsing).
      }
      return next;
    });
  }, []);

  const setLastResolvedLocation = useCallback((location: Location) => {
    setLastResolvedLocationState((prev) => {
      // getLocation() returns a new object on every call even when the
      // coordinates haven't changed. Bail out on an equivalent location so
      // this doesn't produce a new reference each refresh -- WeatherContext's
      // refresh() depends on lastResolvedLocation, and a new reference there
      // re-triggers its refresh-scheduling effect, causing an infinite
      // refetch loop (seen as rapid flickering between the loading state
      // and content).
      if (prev && isSameLocation(prev, location)) return prev;

      try {
        localStorage.setItem(
          LAST_RESOLVED_LOCATION_STORAGE_KEY,
          JSON.stringify(location),
        );
      } catch {
        // Ignore storage failures (e.g. private browsing).
      }
      return location;
    });
  }, []);

  const openSearch = useCallback(() => setIsSearchOpen(true), []);
  const closeSearch = useCallback(() => setIsSearchOpen(false), []);

  return (
    <LocationPreferenceContext.Provider
      value={{
        mode,
        manualLocation,
        lastResolvedLocation,
        recentLocations,
        selectLocation,
        selectCurrentLocation,
        removeRecentLocation,
        setLastResolvedLocation,
        isSearchOpen,
        openSearch,
        closeSearch,
      }}
    >
      {children}
    </LocationPreferenceContext.Provider>
  );
};

export const useLocationPreference = () => {
  const context = useContext(LocationPreferenceContext);
  if (!context) {
    throw new Error(
      "useLocationPreference must be used within a LocationPreferenceProvider",
    );
  }
  return context;
};
