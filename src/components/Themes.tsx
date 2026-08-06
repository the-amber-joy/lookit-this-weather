import {
  ChevronDownIcon,
  MoonIcon,
  PhoneIcon,
  SunIcon,
  TimeIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Button,
  Heading,
  Icon,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Stack,
  Text,
} from "@chakra-ui/react";

import { useModePreference } from "../context/ModePreferenceContext";
import { useThemeName } from "../context/ThemeNameContext";
import {
  MODE_PREFERENCE_OPTIONS,
  type ModePreference,
} from "../theme/modePreference";
import { useMode } from "../theme/themedMode";
import { THEME_OPTIONS, type ThemeName } from "../theme/themeNames";

const MODE_PREFERENCE_ICONS = {
  time: TimeIcon,
  system: PhoneIcon,
  day: SunIcon,
  night: MoonIcon,
};

const Themes = () => {
  const { themeName, setThemeName } = useThemeName();
  const {
    modePreference: modePreference,
    setModePreference: setModePreference,
  } = useModePreference();
  const mode = useMode();

  return (
    <Stack
      spacing={6}
      paddingY={{ base: 8, md: 12 }}
      maxW="40rem"
      color={mode.isDay ? mode.textColor : undefined}
    >
      <Stack spacing={1}>
        <Heading size="lg">Theme</Heading>
      </Stack>

      <Box>
        <Menu matchWidth autoSelect={false}>
          <MenuButton
            as={Button}
            rightIcon={<ChevronDownIcon />}
            borderWidth="2px"
            borderColor="whiteAlpha.200"
            borderRadius="1rem"
            bg="whiteAlpha.100"
            color={mode.isDay ? mode.textColor : undefined}
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
            <MenuOptionGroup
              type="radio"
              value={themeName}
              onChange={(value) => setThemeName(value as ThemeName)}
            >
              {THEME_OPTIONS.map((option) => {
                const isActive = option.name === themeName;

                return (
                  <MenuItemOption
                    key={option.name}
                    value={option.name}
                    bg={isActive ? "whiteAlpha.200" : undefined}
                    fontWeight={isActive ? "bold" : undefined}
                  >
                    {option.label}
                  </MenuItemOption>
                );
              })}
            </MenuOptionGroup>
          </MenuList>
        </Menu>
      </Box>

      <Stack spacing={3}>
        <Stack spacing={1}>
          <Heading size="md">Mode</Heading>
        </Stack>

        <Box>
          <Menu matchWidth autoSelect={false}>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              borderWidth="2px"
              borderColor="whiteAlpha.200"
              borderRadius="1rem"
              bg="whiteAlpha.100"
              color={mode.isDay ? mode.textColor : undefined}
              fontWeight="normal"
              textAlign="left"
              maxW="16rem"
            >
              <Stack direction="row" align="center" spacing={2}>
                <Icon
                  as={MODE_PREFERENCE_ICONS[modePreference]}
                  boxSize={4}
                />
                <Text>
                  {
                    MODE_PREFERENCE_OPTIONS.find(
                      (option) => option.value === modePreference,
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
              <MenuOptionGroup
                type="radio"
                value={modePreference}
                onChange={(value) =>
                  setModePreference(value as ModePreference)
                }
              >
                {MODE_PREFERENCE_OPTIONS.map((option) => {
                  const isActive = option.value === modePreference;

                  return (
                    <MenuItemOption
                      key={option.value}
                      value={option.value}
                      bg={isActive ? "whiteAlpha.200" : undefined}
                      fontWeight={isActive ? "bold" : undefined}
                    >
                      <Stack direction="row" align="center" spacing={2}>
                        <Icon
                          as={MODE_PREFERENCE_ICONS[option.value]}
                          boxSize={4}
                        />
                        <Text>{option.label}</Text>
                      </Stack>
                    </MenuItemOption>
                  );
                })}
              </MenuOptionGroup>
            </MenuList>
          </Menu>
        </Box>
        <Text fontSize="xs" opacity={0.85}>
          {
            MODE_PREFERENCE_OPTIONS.find(
              (option) => option.value === modePreference,
            )?.description
          }
        </Text>
      </Stack>
    </Stack>
  );
};

export default Themes;
