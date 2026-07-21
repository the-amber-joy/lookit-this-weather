import { Box, Spinner } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

import { useThemeName } from "../context/ThemeNameContext";

const twinkleSpin = keyframes`
  0%, 100% { opacity: 0.4; transform: scale(0.85) rotate(0deg); }
  50% { opacity: 1; transform: scale(1.15) rotate(180deg); }
`;

const REDUCED_MOTION_OVERRIDE = {
  "@media (prefers-reduced-motion: reduce)": {
    animation: "none",
  },
};

interface ThemedSpinnerProps {
  size?: "md" | "xl";
}

/**
 * Default theme renders the standard Chakra spinner. Fairycore theme
 * renders a twinkling four-point sparkle instead.
 */
const ThemedSpinner = ({ size = "xl" }: ThemedSpinnerProps) => {
  const { themeName } = useThemeName();

  if (themeName !== "fairycore") {
    return <Spinner size={size} thickness="4px" color="brand.ajPurple" />;
  }

  return (
    <Box
      as="svg"
      role="status"
      aria-label="Loading"
      viewBox="0 0 24 24"
      boxSize={size === "xl" ? "3.5rem" : "2rem"}
      color="brand.ajCheez"
      fill="currentColor"
      animation={`${twinkleSpin} 1.4s ease-in-out infinite`}
      sx={REDUCED_MOTION_OVERRIDE}
    >
      <path d="M12 0 L14.5 9.5 L24 12 L14.5 14.5 L12 24 L9.5 14.5 L0 12 L9.5 9.5 Z" />
    </Box>
  );
};

export default ThemedSpinner;
