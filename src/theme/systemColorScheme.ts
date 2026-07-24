import { useEffect, useState } from "react";

const DARK_SCHEME_QUERY = "(prefers-color-scheme: dark)";

function getSystemPrefersDark(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia(DARK_SCHEME_QUERY).matches;
}

/** Tracks the device/browser's light-vs-dark appearance setting, live. */
export function useSystemPrefersDark(): boolean {
  const [prefersDark, setPrefersDark] = useState(getSystemPrefersDark);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mediaQueryList = window.matchMedia(DARK_SCHEME_QUERY);
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersDark(event.matches);
    };

    mediaQueryList.addEventListener("change", handleChange);
    return () => mediaQueryList.removeEventListener("change", handleChange);
  }, []);

  return prefersDark;
}
