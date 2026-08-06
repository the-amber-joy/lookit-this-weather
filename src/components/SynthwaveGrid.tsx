import { Box, useTheme } from "@chakra-ui/react";

// CSS-only synthwave horizon grid: a 3D-rotated plane with two repeating
// stripe layers, viewed through `perspective` so the "vertical" stripes
// converge toward a vanishing point at the horizon, like the classic
// retrowave floor grid.
export default function SynthwaveGrid() {
  const { colors } = useTheme();
  const gridColor = colors.brand.ajBlueLvls[500];

  return (
    <Box
      position="fixed"
      left={0}
      right={0}
      bottom={0}
      height="50%"
      zIndex={-1}
      overflow="hidden"
      pointerEvents="none"
      sx={{ perspective: "300px", perspectiveOrigin: "50% 0%" }}
    >
      <Box
        position="absolute"
        left="-250%"
        right="-250%"
        bottom={0}
        // At rotateX(80deg), the plane's far edge reaches the container top
        // once its (pre-transform) height is >= 1/cos(80deg) (~576%) of the
        // container. Going that far compresses the pattern so much near the
        // vanishing point that it renders as doubled/aliased lines, so this
        // deliberately stays short of full reach and leaves the small
        // residual gap to the glow/horizon line below.
        height="400%"
        sx={{
          transformOrigin: "50% 100%",
          transform: "rotateX(80deg)",
          backgroundImage: `repeating-linear-gradient(to top, transparent 0, transparent 62px, ${gridColor} 62px, ${gridColor} 64px), repeating-linear-gradient(to right, transparent 0, transparent 126px, ${gridColor} 126px, ${gridColor} 128px)`,
          filter: `drop-shadow(0 0 2px ${gridColor}) drop-shadow(0 0 6px ${gridColor}99)`,
        }}
      />
      {/* Soft glow bloom, blended additively so it brightens the grid near
          the horizon rather than covering it. */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        height="20%"
        bg={`linear-gradient(to bottom, ${gridColor}55, transparent)`}
        sx={{ mixBlendMode: "screen" }}
      />
      {/* Flat horizon line, full width, sitting above the tilted plane. */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        height="2px"
        bg={gridColor}
        boxShadow={`0 0 2px ${gridColor}, 0 0 6px ${gridColor}99`}
      />
    </Box>
  );
}
