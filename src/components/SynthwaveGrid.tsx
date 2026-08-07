import { Box, useTheme } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

// Geometry constants for the tilted plane below - kept in sync with the
// `height`/`rotateX` values used in the JSX so the horizon-line calculation
// below always matches what's actually rendered.
const PLANE_HEIGHT_RATIO = 2; // height="200%"
const ROTATE_DEG = 80;
const PERSPECTIVE_PX = 300;

// Where the tilted plane's far edge actually lands on screen, as a fraction
// of the container's height measured from its top. `perspective` is a fixed
// px value while the container is sized relatively, so this depends on the
// container's real rendered height (not just the plane's height ratio) -
// see the derivation notes in TODO.md/commit history for the math.
function calcHorizonTopPercent(containerHeightPx: number): number {
  const theta = (ROTATE_DEG * Math.PI) / 180;
  const numerator = (1 - PLANE_HEIGHT_RATIO * Math.cos(theta)) * PERSPECTIVE_PX;
  const denominator =
    PERSPECTIVE_PX + PLANE_HEIGHT_RATIO * containerHeightPx * Math.sin(theta);
  return (numerator / denominator) * 100;
}

// CSS-only synthwave horizon grid: a 3D-rotated plane with two repeating
// stripe layers, viewed through `perspective` so the "vertical" stripes
// converge toward a vanishing point at the horizon, like the classic
// retrowave floor grid.
export default function SynthwaveGrid() {
  const { colors } = useTheme();
  const gridColor = colors.brand.ajBlueLvls[500];
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [horizonTop, setHorizonTop] = useState<number | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      setHorizonTop(calcHorizonTopPercent(entry.contentRect.height));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Fall back to the last manually-tuned value until the first measurement
  // comes in, so there's no flash of an unpositioned horizon line.
  const horizonTopStyle = `${horizonTop ?? 21}%`;

  return (
    <Box
      ref={containerRef}
      className="synthwave-grid"
      position="fixed"
      left={0}
      right={0}
      bottom={0}
      height="50%"
      zIndex={-1}
      overflow="hidden"
      pointerEvents="none"
      sx={{ perspective: `${PERSPECTIVE_PX}px`, perspectiveOrigin: "50% 0%" }}
    >
      <Box
        position="absolute"
        left="-250%"
        right="-250%"
        bottom={0}
        // At rotateX(80deg), the plane's far edge reaches the container top
        // once its (pre-transform) height is >= 1/cos(80deg) (~576%) of the
        // container. A previous attempt overshot that (700%) plus a mask to
        // hide the compressed far edge, but the huge painted area (clipped
        // only *after* the filter/mask/3D transform pipeline runs) brought
        // mobile GPUs to a crawl. Staying well under the threshold keeps
        // this cheap; the horizon line/glow below sit at the same height
        // the grid actually reaches, instead of at the container's edge.
        height={`${PLANE_HEIGHT_RATIO * 100}%`}
        sx={{
          transformOrigin: "50% 100%",
          transform: `rotateX(${ROTATE_DEG}deg)`,
          backgroundImage: `repeating-linear-gradient(to top, transparent 0, transparent 62px, ${gridColor} 62px, ${gridColor} 64px), repeating-linear-gradient(to right, transparent 0, transparent 126px, ${gridColor} 126px, ${gridColor} 128px)`,
          filter: `drop-shadow(0 0 2px ${gridColor}) drop-shadow(0 0 6px ${gridColor}99)`,
        }}
      />
      {/* Soft glow bloom, blended additively so it brightens the grid near
          the horizon rather than covering it. */}
      <Box
        position="absolute"
        top={horizonTopStyle}
        left={0}
        right={0}
        height="20%"
        bg={`linear-gradient(to bottom, ${gridColor}55, transparent)`}
        sx={{ mixBlendMode: "screen" }}
      />
      {/* Flat horizon line, full width, sitting above the tilted plane. */}
      <Box
        position="absolute"
        top={horizonTopStyle}
        left={0}
        right={0}
        height="1px"
        bg={gridColor}
        boxShadow={`0 0 2px ${gridColor}, 0 0 6px ${gridColor}99`}
      />
    </Box>
  );
}
