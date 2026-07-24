import { RefObject, useEffect, useRef, useState } from "react";

import { useWeatherContext } from "../context/WeatherContext";

// Distance (in px) the user must drag down before releasing triggers a
// refresh. Exported so the visual indicator can compute rotation/progress.
export const PULL_TRIGGER_DISTANCE = 70;

// Caps how far the indicator can be dragged, and dampens the raw touch
// delta so the gesture doesn't feel unbounded or too twitchy.
const MAX_PULL_DISTANCE = 100;
const PULL_RESISTANCE = 0.5;

/**
 * Adds a touch-driven "pull down to refresh" gesture to a scrollable
 * container, calling the shared weather refresh() once the user drags past
 * PULL_TRIGGER_DISTANCE while already scrolled to the top. The app disables
 * the browser's native pull-to-refresh (overscrollBehavior: "none" in
 * theme.ts) since the real scroll container isn't the document body, so
 * this reimplements the gesture manually.
 */
export function usePullToRefresh(containerRef: RefObject<HTMLElement | null>) {
  const { refresh, isLoading } = useWeatherContext();
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef<number | null>(null);

  // Hide the indicator once the refresh triggered by this gesture completes.
  useEffect(() => {
    if (refreshing && !isLoading) setRefreshing(false);
  }, [refreshing, isLoading]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (event: TouchEvent) => {
      if (container.scrollTop > 0 || refreshing) {
        startY.current = null;
        return;
      }
      startY.current = event.touches[0].clientY;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (startY.current === null) return;
      const deltaY = event.touches[0].clientY - startY.current;
      if (deltaY <= 0 || container.scrollTop > 0) {
        setPullDistance(0);
        return;
      }
      event.preventDefault();
      setPullDistance(Math.min(deltaY * PULL_RESISTANCE, MAX_PULL_DISTANCE));
    };

    const handleTouchEnd = () => {
      if (startY.current === null) return;
      startY.current = null;
      setPullDistance((distance) => {
        if (distance >= PULL_TRIGGER_DISTANCE) {
          setRefreshing(true);
          refresh();
        }
        return 0;
      });
    };

    container.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    container.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    container.addEventListener("touchend", handleTouchEnd);

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [containerRef, refresh, refreshing]);

  return { pullDistance, refreshing };
}
