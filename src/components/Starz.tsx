import { Box, ResponsiveValue } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useMemo } from "react";

import { useThemeName } from "../context/ThemeNameContext";
import { useMode } from "../theme/themedMode";
import { GRID_HEIGHT_PERCENT, HORIZON_Y } from "./SynthwaveGrid";

// Blink is a hard on/off cut (steps timing function below), not a fade.
const blink = keyframes`
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
`;

const REDUCED_MOTION_OVERRIDE = {
  "@media (prefers-reduced-motion: reduce)": {
    animation: "none",
  },
};

// Fraction of stars that blink on/off instead of staying solid.
const BLINK_CHANCE = 0.15;

interface Star {
  top: string;
  left: string;
  size: string;
  blinking: boolean;
  blinkDuration: string;
  blinkDelay: string;
}

function createStars(count: number): Star[] {
  return Array.from({ length: count }, () => ({
    top: `${Math.round(Math.random() * 100)}%`,
    left: `${Math.round(Math.random() * 100)}%`,
    size: `${1 + Math.random() * 1.5}px`,
    blinking: Math.random() < BLINK_CHANCE,
    blinkDuration: `${(2 + Math.random() * 3).toFixed(2)}s`,
    blinkDelay: `${(Math.random() * 5).toFixed(2)}s`,
  }));
}

// How far down from the viewport top the horizon sits, so the star field's
// height covers only the sky above it (and none of the ground below).
const SKY_HEIGHT_PERCENT =
  100 - ((100 - HORIZON_Y) / 100) * GRID_HEIGHT_PERCENT;

interface StarzProps {
  count?: number;
  // How far the star field's left edge sits from the viewport's left edge,
  // e.g. to account for a desktop sidebar - matches SynthwaveGrid/Sparkles.
  leftOffset?: ResponsiveValue<string | number>;
}

/**
 * A static (unanimated) field of small dots for the Synthwave theme's night
 * sky. Confined to the area above the horizon, and rendered before
 * SynthwaveGrid in the DOM so the sun paints over any stars behind it.
 */
const Starz = ({ count = 200, leftOffset = 0 }: StarzProps) => {
  const { themeName } = useThemeName();
  const { isDay } = useMode();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stars = useMemo(() => createStars(count), [count]);

  if (themeName !== "synthwave" || isDay) return null;

  return (
    <Box
      aria-hidden
      position="fixed"
      top={0}
      left={leftOffset}
      right={0}
      height={`${SKY_HEIGHT_PERCENT}%`}
      zIndex={-1}
      overflow="hidden"
      pointerEvents="none"
    >
      {stars.map((star, index) => (
        <Box
          key={index}
          position="absolute"
          top={star.top}
          left={star.left}
          boxSize={star.size}
          borderRadius="full"
          bg="brand.ajBlueLvls.800"
          animation={
            star.blinking
              ? `${blink} ${star.blinkDuration} steps(2, jump-none) ${star.blinkDelay} infinite`
              : undefined
          }
          sx={star.blinking ? REDUCED_MOTION_OVERRIDE : undefined}
        />
      ))}
    </Box>
  );
};

export default Starz;
