import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

import {
  DEFAULT_THEME_NAME,
  isThemeName,
  THEME_STORAGE_KEY,
  ThemeName,
} from "../theme/themeNames";

interface ThemeNameContextValue {
  themeName: ThemeName;
  setThemeName: (themeName: ThemeName) => void;
}

const ThemeNameContext = createContext<ThemeNameContextValue | undefined>(
  undefined,
);

function getInitialThemeName(): ThemeName {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return isThemeName(stored) ? stored : DEFAULT_THEME_NAME;
  } catch {
    return DEFAULT_THEME_NAME;
  }
}

export const ThemeNameProvider = ({ children }: { children: ReactNode }) => {
  const [themeName, setThemeNameState] = useState<ThemeName>(
    getInitialThemeName,
  );

  const setThemeName = useCallback((next: ThemeName) => {
    setThemeNameState(next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Ignore storage failures (e.g. private browsing).
    }
  }, []);

  return (
    <ThemeNameContext.Provider value={{ themeName, setThemeName }}>
      {children}
    </ThemeNameContext.Provider>
  );
};

export const useThemeName = () => {
  const context = useContext(ThemeNameContext);
  if (!context) {
    throw new Error("useThemeName must be used within a ThemeNameProvider");
  }
  return context;
};
