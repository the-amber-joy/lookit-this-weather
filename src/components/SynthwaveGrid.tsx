import { Box, useTheme } from "@chakra-ui/react";

// How far down the container (out of 100 viewBox units) the horizon sits.
// Exported so a future sun/moon element can anchor to the same line - the
// vanishing point is (50, HORIZON_Y).
export const HORIZON_Y = 15;

const COLUMN_COUNT = 16;

const ROW_COUNT = 14;
// Higher = rows bunch up more tightly near the horizon, mimicking
// perspective foreshortening.
const ROW_CURVE = 2.2;

// Column targets are spaced evenly along the visible frame's perimeter
// (left edge, down to the bottom edge, up the right edge) rather than
// along a fixed line at y=100. Anchoring wide-angle columns to a fixed
// y left them exiting through the left/right edges partway up the
// screen, clipped before reaching the bottom - leaving empty triangular
// gaps in the bottom corners. Targeting the perimeter directly means
// every column always reaches the edge of the visible area.
function getColumnTargets(): { x: number; y: number }[] {
  const edgeLength = 100 - HORIZON_Y;
  const perimeter = edgeLength * 2 + 100;
  return Array.from({ length: COLUMN_COUNT + 1 }, (_, i) => {
    const s = (i / COLUMN_COUNT) * perimeter;
    if (s <= edgeLength) return { x: 0, y: HORIZON_Y + s };
    if (s <= edgeLength + 100) return { x: s - edgeLength, y: 100 };
    return { x: 100, y: 100 - (s - edgeLength - 100) };
  });
}

function getRowYPositions(): number[] {
  return Array.from({ length: ROW_COUNT }, (_, i) => {
    const t = (i + 1) / ROW_COUNT;
    return HORIZON_Y + (100 - HORIZON_Y) * Math.pow(t, ROW_CURVE);
  });
}

// SVG synthwave horizon grid: a real 2-point perspective grid (converging
// verticals + power-curve-spaced horizontals) drawn in a fixed 0-100 viewBox,
// so the horizon always lines up exactly with where the grid starts - no
// CSS 3D transform/perspective math or per-device measuring required.
export default function SynthwaveGrid() {
  const { colors } = useTheme();
  const gridColor = colors.brand.ajBlueLvls[500];
  const columnTargets = getColumnTargets();
  const rowYPositions = getRowYPositions();

  return (
    <Box
      className="synthwave-grid"
      position="fixed"
      left={0}
      right={0}
      bottom={0}
      height="50%"
      zIndex={-1}
      overflow="hidden"
      pointerEvents="none"
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <filter
            id="synthwave-grid-glow"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g
          stroke={gridColor}
          strokeWidth={0.25}
          vectorEffect="non-scaling-stroke"
          filter="url(#synthwave-grid-glow)"
        >
          {columnTargets.map(({ x, y }) => (
            <line key={`${x}-${y}`} x1={50} y1={HORIZON_Y} x2={x} y2={y} />
          ))}
          {rowYPositions.map((y) => (
            <line key={y} x1={0} y1={y} x2={100} y2={y} />
          ))}
          {/* Horizon line - a future sun/moon element would sit right on
              top of this, at the same HORIZON_Y. */}
          <line
            x1={0}
            y1={HORIZON_Y}
            x2={100}
            y2={HORIZON_Y}
            strokeWidth={0.5}
          />
        </g>
      </svg>
    </Box>
  );
}
