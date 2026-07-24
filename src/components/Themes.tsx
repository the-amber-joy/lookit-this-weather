import {
  CheckCircleIcon,
  MoonIcon,
  PhoneIcon,
  SunIcon,
  TimeIcon,
} from "@chakra-ui/icons";
import { Box, Heading, Icon, SimpleGrid, Stack, Text } from "@chakra-ui/react";

import { useDayModePreference } from "../context/DayModePreferenceContext";
import { useThemeName } from "../context/ThemeNameContext";
import { DAY_MODE_PREFERENCE_OPTIONS } from "../theme/dayModePreference";
import { useDayMode } from "../theme/fairycoreDayMode";
import { THEME_OPTIONS } from "../theme/themeNames";

const DAY_MODE_PREFERENCE_ICONS = {
  time: TimeIcon,
  system: PhoneIcon,
  day: SunIcon,
  night: MoonIcon,
};

const Themes = () => {
  const { themeName, setThemeName } = useThemeName();
  const { dayModePreference, setDayModePreference } = useDayModePreference();
  const dayMode = useDayMode();

  return (
    <Stack
      spacing={6}
      paddingY={{ base: 8, md: 12 }}
      maxW="40rem"
      color={dayMode.isDay ? dayMode.textColor : undefined}
    >
      <Stack spacing={1}>
        <Heading size="lg">Themes</Heading>
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

      <Stack spacing={3}>
        <Stack spacing={1}>
          <Heading size="md">Mode</Heading>
        </Stack>

        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={4}>
          {DAY_MODE_PREFERENCE_OPTIONS.map((option) => {
            const isActive = option.value === dayModePreference;

            return (
              <Box
                key={option.value}
                as="button"
                onClick={() => setDayModePreference(option.value)}
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
                    <Stack direction="row" align="center" spacing={2}>
                      <Icon
                        as={DAY_MODE_PREFERENCE_ICONS[option.value]}
                        boxSize={4}
                      />
                      <Heading size="sm">{option.label}</Heading>
                    </Stack>
                    {isActive && (
                      <CheckCircleIcon color="brand.ajCheez" boxSize={4} />
                    )}
                  </Stack>
                  <Text fontSize="xs" opacity={0.85}>
                    {option.description}
                  </Text>
                </Stack>
              </Box>
            );
          })}
        </SimpleGrid>
      </Stack>
    </Stack>
  );
};

export default Themes;
