import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

import {
  DEFAULT_MODE_PREFERENCE,
  isModePreference,
  MODE_PREFERENCE_STORAGE_KEY,
  ModePreference,
} from "../theme/modePreference";

interface ModePreferenceContextValue {
  modePreference: ModePreference;
  setModePreference: (preference: ModePreference) => void;
}

const ModePreferenceContext = createContext<
  ModePreferenceContextValue | undefined
>(undefined);

function getInitialModePreference(): ModePreference {
  try {
    const stored = localStorage.getItem(MODE_PREFERENCE_STORAGE_KEY);
    return isModePreference(stored) ? stored : DEFAULT_MODE_PREFERENCE;
  } catch {
    return DEFAULT_MODE_PREFERENCE;
  }
}

export const ModePreferenceProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [modePreference, setModePreferenceState] = useState<ModePreference>(
    getInitialModePreference,
  );

  const setModePreference = useCallback((next: ModePreference) => {
    setModePreferenceState(next);
    try {
      localStorage.setItem(MODE_PREFERENCE_STORAGE_KEY, next);
    } catch {
      // Ignore storage failures (e.g. private browsing).
    }
  }, []);

  return (
    <ModePreferenceContext.Provider
      value={{
        modePreference: modePreference,
        setModePreference: setModePreference,
      }}
    >
      {children}
    </ModePreferenceContext.Provider>
  );
};

export const useModePreference = () => {
  const context = useContext(ModePreferenceContext);
  if (!context) {
    throw new Error(
      "useModePreference must be used within a ModePreferenceProvider",
    );
  }
  return context;
};
