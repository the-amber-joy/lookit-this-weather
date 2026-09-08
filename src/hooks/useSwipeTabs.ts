import { RefObject, useEffect, useRef } from "react";

// Minimum horizontal drag distance (in px) before a touch gesture counts as
// a deliberate swipe rather than an incidental finger movement.
const SWIPE_TRIGGER_DISTANCE = 50;

// How much further horizontal than vertical movement must be before a
// gesture commits to being a swipe (and starts blocking vertical scroll).
const DIRECTION_LOCK_DISTANCE = 10;

// Minimum speed (px/ms) required for a swipe to trigger a tab change, so
// slow drags (e.g. panning the radar map) don't get mistaken for a swipe.
const MIN_SWIPE_VELOCITY = 0.3;

/**
 * Adds a touch-driven horizontal swipe gesture to a container, calling
 * onSwipeLeft/onSwipeRight once the user drags past SWIPE_TRIGGER_DISTANCE
 * in a predominantly horizontal direction. Used to switch tabs by swiping
 * the content area on touch devices.
 */
export function useSwipeTabs(
  containerRef: RefObject<HTMLElement | null>,
  onSwipeLeft: () => void,
  onSwipeRight: () => void,
) {
  const start = useRef<{ x: number; y: number; time: number } | null>(null);
  const isHorizontal = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1) {
        start.current = null;
        return;
      }
      const touch = event.touches[0];
      start.current = { x: touch.clientX, y: touch.clientY, time: event.timeStamp };
      isHorizontal.current = false;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (!start.current) return;
      const deltaX = event.touches[0].clientX - start.current.x;
      const deltaY = event.touches[0].clientY - start.current.y;

      if (
        !isHorizontal.current &&
        Math.abs(deltaX) > DIRECTION_LOCK_DISTANCE &&
        Math.abs(deltaX) > Math.abs(deltaY)
      ) {
        isHorizontal.current = true;
      }
      // Once locked horizontal, block scroll so the page doesn't drag with it.
      if (isHorizontal.current) event.preventDefault();
    };

    const handleTouchEnd = (event: TouchEvent) => {
      const startPoint = start.current;
      const wasHorizontal = isHorizontal.current;
      start.current = null;
      isHorizontal.current = false;
      if (!startPoint || !wasHorizontal) return;

      const deltaX = event.changedTouches[0].clientX - startPoint.x;
      if (Math.abs(deltaX) < SWIPE_TRIGGER_DISTANCE) return;

      const elapsed = event.timeStamp - startPoint.time || 1;
      if (Math.abs(deltaX) / elapsed < MIN_SWIPE_VELOCITY) return;

      if (deltaX < 0) onSwipeLeft();
      else onSwipeRight();
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
  }, [containerRef, onSwipeLeft, onSwipeRight]);
}
