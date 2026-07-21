import { CheckCircleIcon } from "@chakra-ui/icons";
import { Box, Heading, SimpleGrid, Stack, Text } from "@chakra-ui/react";

import { useThemeName } from "../context/ThemeNameContext";
import { THEME_OPTIONS } from "../theme/themeNames";

const Themes = () => {
  const { themeName, setThemeName } = useThemeName();

  return (
    <Stack spacing={6} paddingY={{ base: 8, md: 12 }} maxW="40rem">
      <Stack spacing={1}>
        <Heading size="lg">Themes</Heading>
        <Text opacity={0.7}>Choose how the app looks.</Text>
      </Stack>

      <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
        {THEME_OPTIONS.map((option) => {
          const isActive = option.name === themeName;

          return (
            <Box
              key={option.name}
              as="button"
              onClick={() => setThemeName(option.name)}
              textAlign="left"
              borderWidth="2px"
              borderColor={isActive ? "brand.ajCheez" : "whiteAlpha.200"}
              borderRadius="1rem"
              bg="whiteAlpha.100"
              px={5}
              py={4}
              transition="border-color 0.2s ease"
              aria-pressed={isActive}
            >
              <Stack spacing={1}>
                <Stack direction="row" align="center" justify="space-between">
                  <Heading size="md">{option.label}</Heading>
                  {isActive && (
                    <CheckCircleIcon color="brand.ajCheez" boxSize={5} />
                  )}
                </Stack>
              </Stack>
            </Box>
          );
        })}
      </SimpleGrid>
    </Stack>
  );
};

export default Themes;
