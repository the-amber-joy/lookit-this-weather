import { Box } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useMemo } from "react";

import { useThemeName } from "../context/ThemeNameContext";

const twinkle = keyframes`
  0%, 100% { opacity: 0; transform: scale(0.4); }
  50% { opacity: 1; transform: scale(1); }
`;

const REDUCED_MOTION_OVERRIDE = {
  "@media (prefers-reduced-motion: reduce)": {
    animation: "none",
    opacity: 0.6,
  },
};

interface Sparkle {
  top: string;
  left: string;
  size: string;
  delay: string;
  duration: string;
}

function createSparkles(count: number): Sparkle[] {
  return Array.from({ length: count }, () => ({
    top: `${Math.round(Math.random() * 100)}%`,
    left: `${Math.round(Math.random() * 100)}%`,
    size: `${2 + Math.random() * 3}px`,
    delay: `${(Math.random() * 4).toFixed(2)}s`,
    duration: `${(2 + Math.random() * 2).toFixed(2)}s`,
  }));
}

interface SparklesProps {
  count?: number;
}

/**
 * A field of small twinkling dots, only rendered for the Fairycore theme.
 * Fixed behind the app's content (negative z-index) so it only peeks
 * through the gaps between opaque cards/panels rather than on top of them.
 */
const Sparkles = ({ count = 24 }: SparklesProps) => {
  const { themeName } = useThemeName();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const sparkles = useMemo(() => createSparkles(count), [count]);

  if (themeName !== "fairycore") return null;

  return (
    <Box
      aria-hidden
      position="fixed"
      inset={0}
      zIndex={-1}
      pointerEvents="none"
    >
      {sparkles.map((sparkle, index) => (
        <Box
          key={index}
          position="absolute"
          top={sparkle.top}
          left={sparkle.left}
          boxSize={sparkle.size}
          borderRadius="full"
          bg="brand.ajCheez"
          color="brand.ajCheez"
          boxShadow="0 0 6px 1px currentColor"
          animation={`${twinkle} ${sparkle.duration} ease-in-out ${sparkle.delay} infinite`}
          sx={REDUCED_MOTION_OVERRIDE}
        />
      ))}
    </Box>
  );
};

export default Sparkles;
