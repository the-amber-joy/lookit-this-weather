import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

import {
  DAY_MODE_PREFERENCE_STORAGE_KEY,
  DayModePreference,
  DEFAULT_DAY_MODE_PREFERENCE,
  isDayModePreference,
} from "../theme/dayModePreference";

interface DayModePreferenceContextValue {
  dayModePreference: DayModePreference;
  setDayModePreference: (preference: DayModePreference) => void;
}

const DayModePreferenceContext = createContext<
  DayModePreferenceContextValue | undefined
>(undefined);

function getInitialDayModePreference(): DayModePreference {
  try {
    const stored = localStorage.getItem(DAY_MODE_PREFERENCE_STORAGE_KEY);
    return isDayModePreference(stored) ? stored : DEFAULT_DAY_MODE_PREFERENCE;
  } catch {
    return DEFAULT_DAY_MODE_PREFERENCE;
  }
}

export const DayModePreferenceProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [dayModePreference, setDayModePreferenceState] =
    useState<DayModePreference>(getInitialDayModePreference);

  const setDayModePreference = useCallback((next: DayModePreference) => {
    setDayModePreferenceState(next);
    try {
      localStorage.setItem(DAY_MODE_PREFERENCE_STORAGE_KEY, next);
    } catch {
      // Ignore storage failures (e.g. private browsing).
    }
  }, []);

  return (
    <DayModePreferenceContext.Provider
      value={{ dayModePreference, setDayModePreference }}
    >
      {children}
    </DayModePreferenceContext.Provider>
  );
};

export const useDayModePreference = () => {
  const context = useContext(DayModePreferenceContext);
  if (!context) {
    throw new Error(
      "useDayModePreference must be used within a DayModePreferenceProvider",
    );
  }
  return context;
};
