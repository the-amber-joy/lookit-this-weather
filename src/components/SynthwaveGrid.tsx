import {
  Box,
  ResponsiveValue,
  useBreakpointValue,
  useTheme,
} from "@chakra-ui/react";

import { useMode } from "../theme/themedMode";

// How far down the container (out of 100 viewBox units) the horizon sits.
// Exported so a future sun/moon element can anchor to the same line.
export const HORIZON_Y = 5;

const COLUMN_COUNT = 16;
// Columns fan out past the 0-100 viewBox width so the spread still covers
// the full container on very wide or very narrow viewports.
const COLUMN_MIN_X = -100;
const COLUMN_MAX_X = 200;
// The near (top) end of each column also spreads out a little instead of
// meeting at a single vanishing point - a softer, less fisheye-like fan.
const COLUMN_ORIGIN_MIN_X = 5;
const COLUMN_ORIGIN_MAX_X = 95;

const ROW_COUNT = 14;
// Higher = rows bunch up more tightly near the horizon, mimicking
// perspective foreshortening.
const ROW_CURVE = 2;

const SUN_RADIUS_MOBILE = HORIZON_Y * 6.6;
const SUN_RADIUS_DESKTOP = HORIZON_Y * 3.3;

function getColumnEndpoints(): { x1: number; x2: number }[] {
  return Array.from({ length: COLUMN_COUNT + 1 }, (_, i) => {
    const t = i / COLUMN_COUNT;
    return {
      x1: COLUMN_ORIGIN_MIN_X + t * (COLUMN_ORIGIN_MAX_X - COLUMN_ORIGIN_MIN_X),
      x2: COLUMN_MIN_X + t * (COLUMN_MAX_X - COLUMN_MIN_X),
    };
  });
}

function getRowYPositions(): number[] {
  return Array.from({ length: ROW_COUNT }, (_, i) => {
    const t = (i + 1) / ROW_COUNT;
    return HORIZON_Y + (100 - HORIZON_Y) * Math.pow(t, ROW_CURVE);
  });
}

interface SynthwaveGridProps {
  // How far the grid's left edge sits from the viewport's left edge, e.g. to
  // account for a desktop sidebar - so the vanishing point/sun center on the
  // content column rather than the full window.
  leftOffset?: ResponsiveValue<string | number>;
}

// SVG synthwave horizon grid: a real 2-point perspective grid (converging
// verticals + power-curve-spaced horizontals) drawn in a fixed 0-100 viewBox,
// so the horizon always lines up exactly with where the grid starts - no
// CSS 3D transform/perspective math or per-device measuring required.
export default function SynthwaveGrid({ leftOffset = 0 }: SynthwaveGridProps) {
  const { colors } = useTheme();
  const { isDay } = useMode();
  const gridColor = colors.brand.ajBlueLvls[500];
  const sunColor = isDay
    ? colors.brand.ajOrangeLvls[500]
    : colors.brand.ajBlueLvls[400];
  const SUN_RADIUS =
    useBreakpointValue({ base: SUN_RADIUS_MOBILE, md: SUN_RADIUS_DESKTOP }) ??
    SUN_RADIUS_MOBILE;
  const columnEndpoints = getColumnEndpoints();
  const rowYPositions = getRowYPositions();

  return (
    <Box
      className="synthwave-grid"
      position="fixed"
      left={leftOffset}
      right={0}
      bottom={0}
      height="35%"
      zIndex={-1}
      overflow="visible"
      pointerEvents="none"
    >
      <Box
        position="absolute"
        left="50%"
        bottom={`${100 - HORIZON_Y}%`}
        width={`${SUN_RADIUS * 2}vw`}
        height={`${SUN_RADIUS}vw`}
        transform="translateX(-50%)"
      >
        {/* Its own square-scaled SVG (width/height both in vw) so the sun
            renders as a true circle, unaffected by the grid's
            preserveAspectRatio="none" stretch. */}
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${SUN_RADIUS * 2} ${SUN_RADIUS}`}
        >
          <path
            d={`M 0 ${SUN_RADIUS} A ${SUN_RADIUS} ${SUN_RADIUS} 0 0 1 ${SUN_RADIUS * 2} ${SUN_RADIUS} Z`}
            fill={sunColor}
          />
        </svg>
      </Box>

      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ position: "absolute", inset: 0, overflow: "visible" }}
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
          {columnEndpoints.map(({ x1, x2 }) => (
            <line key={`${x1}-${x2}`} x1={x1} y1={HORIZON_Y} x2={x2} y2={100} />
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
