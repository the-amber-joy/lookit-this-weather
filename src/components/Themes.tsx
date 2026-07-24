import {
  ChevronDownIcon,
  MoonIcon,
  PhoneIcon,
  SunIcon,
  TimeIcon,
} from "@chakra-ui/icons";
import {
  Button,
  Heading,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
} from "@chakra-ui/react";

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
        <Heading size="lg">Theme</Heading>
      </Stack>

      <Menu matchWidth>
        <MenuButton
          as={Button}
          rightIcon={<ChevronDownIcon />}
          borderWidth="2px"
          borderColor="whiteAlpha.200"
          borderRadius="1rem"
          bg="whiteAlpha.100"
          color={dayMode.isDay ? dayMode.textColor : undefined}
          fontWeight="normal"
          textAlign="left"
          maxW="16rem"
        >
          {THEME_OPTIONS.find((option) => option.name === themeName)?.label}
        </MenuButton>
        <MenuList
          minW="16rem"
          borderRadius="1rem"
          overflow="hidden"
          color="white"
        >
          {THEME_OPTIONS.map((option) => (
            <MenuItem
              key={option.name}
              onClick={() => setThemeName(option.name)}
            >
              {option.label}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>

      <Stack spacing={3}>
        <Stack spacing={1}>
          <Heading size="md">Mode</Heading>
        </Stack>

        <Menu matchWidth>
          <MenuButton
            as={Button}
            rightIcon={<ChevronDownIcon />}
            borderWidth="2px"
            borderColor="whiteAlpha.200"
            borderRadius="1rem"
            bg="whiteAlpha.100"
            color={dayMode.isDay ? dayMode.textColor : undefined}
            fontWeight="normal"
            textAlign="left"
            maxW="16rem"
          >
            <Stack direction="row" align="center" spacing={2}>
              <Icon
                as={DAY_MODE_PREFERENCE_ICONS[dayModePreference]}
                boxSize={4}
              />
              <Text>
                {
                  DAY_MODE_PREFERENCE_OPTIONS.find(
                    (option) => option.value === dayModePreference,
                  )?.label
                }
              </Text>
            </Stack>
          </MenuButton>
          <MenuList
            minW="16rem"
            borderRadius="1rem"
            overflow="hidden"
            color="white"
          >
            {DAY_MODE_PREFERENCE_OPTIONS.map((option) => (
              <MenuItem
                key={option.value}
                icon={
                  <Icon
                    as={DAY_MODE_PREFERENCE_ICONS[option.value]}
                    boxSize={4}
                  />
                }
                onClick={() => setDayModePreference(option.value)}
              >
                {option.label}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
        <Text fontSize="xs" opacity={0.85}>
          {
            DAY_MODE_PREFERENCE_OPTIONS.find(
              (option) => option.value === dayModePreference,
            )?.description
          }
        </Text>
      </Stack>
    </Stack>
  );
};

export default Themes;
