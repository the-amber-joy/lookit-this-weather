import {
  CalendarIcon,
  SettingsIcon,
  SunIcon,
  TimeIcon,
  ViewIcon,
} from "@chakra-ui/icons";
import type { ComponentWithAs, IconProps } from "@chakra-ui/react";
import {
  Box,
  Button,
  Flex,
  Icon,
  Stack,
  Text,
  useTheme,
  VStack,
} from "@chakra-ui/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ReactNode, useEffect, useRef, useState } from "react";

import CurrentWeather from "./CurrentWeather";
import DailyForecast from "./DailyForecast";
import HourlyForecast from "./HourlyForecast";
import RadarMap from "./RadarMap";
import Sparkles from "./Sparkles";
import Themes from "./Themes";
import { useFairycoreDayMode } from "../theme/fairycoreDayMode";

interface TabItem {
  label: string;
  icon: ComponentWithAs<"svg", IconProps>;
  panel: ReactNode;
}

const tabs: TabItem[] = [
  {
    label: "Current",
    icon: SunIcon,
    panel: <CurrentWeather />,
  },
  {
    label: "Hourly",
    icon: TimeIcon,
    panel: <HourlyForecast />,
  },
  {
    label: "Daily",
    icon: CalendarIcon,
    panel: <DailyForecast />,
  },
  {
    label: "Radar",
    icon: ViewIcon,
    panel: <RadarMap />,
  },
  {
    label: "Themes",
    icon: SettingsIcon,
    panel: <Themes />,
  },
];

const MotionBox = motion(Box);

const Layout = () => {
  const [active, setActive] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { colors } = useTheme();
  const dayMode = useFairycoreDayMode();

  useEffect(() => {
    contentRef.current?.scrollTo(0, 0);
  }, [active]);

  // Fairycore gets a brighter "garden in bloom" page background during the
  // day. Starting with lilac (bridging the Hero/ComfortCard's purple-gold
  // gradient) before easing into blush and sage keeps the page from
  // clashing with the purple showcase cards up top.
  const dayBackground = dayMode.isFairycoreDay
    ? `linear-gradient(160deg, ${colors.brand.ajPurpleLvls["300"]}, ${colors.brand.ajPinkLvls["300"]}, ${colors.brand.ajLtGreenLvls["300"]})`
    : undefined;

  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      height="100dvh"
      overflow="hidden"
    >
      {dayBackground && (
        <Box
          position="fixed"
          inset={0}
          zIndex={-2}
          pointerEvents="none"
          background={dayBackground}
        />
      )}
      <Sparkles />

      {/* Desktop: left sidebar */}
      <VStack
        as="nav"
        display={{ base: "none", md: "flex" }}
        spacing={2}
        align="stretch"
        position="sticky"
        top={0}
        alignSelf="flex-start"
        height="100dvh"
        minW="12rem"
        p={4}
        borderRightWidth="1px"
        borderColor="whiteAlpha.200"
      >
        {tabs.map(({ label, icon }, index) => (
          <Button
            key={label}
            variant="ghost"
            justifyContent="flex-start"
            leftIcon={<Icon as={icon} />}
            onClick={() => setActive(index)}
            aria-current={active === index ? "page" : undefined}
            bg={active === index ? "whiteAlpha.200" : undefined}
            color={
              active === index
                ? dayMode.accentColor
                : dayMode.isFairycoreDay
                  ? dayMode.textColor
                  : undefined
            }
          >
            {label}
          </Button>
        ))}
      </VStack>

      {/* Content */}
      <Box
        ref={contentRef}
        flex="1"
        minH={0}
        overflowY="auto"
        px={{ base: 4, md: 8 }}
        pb={{ base: "5.5rem", md: 0 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <MotionBox
            key={active}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2, ease: "easeOut" }}
          >
            {tabs[active].panel}
          </MotionBox>
        </AnimatePresence>
      </Box>

      {/* Mobile: pinned bottom bar */}
      <Flex
        as="nav"
        display={{ base: "flex", md: "none" }}
        position="fixed"
        bottom={0}
        left={0}
        right={0}
        zIndex={10}
        justify="space-around"
        bg={dayMode.surfaceBg ?? "brand.ajBlueLvls.200"}
        borderTopWidth="1px"
        borderColor="whiteAlpha.200"
        pt={2}
        pb="calc(env(safe-area-inset-bottom) + 0.5rem)"
      >
        {tabs.map(({ label, icon }, index) => (
          <Box
            key={label}
            as="button"
            flex="1"
            onClick={() => setActive(index)}
            aria-current={active === index ? "page" : undefined}
            color={
              active === index
                ? dayMode.accentColor
                : dayMode.isFairycoreDay
                  ? dayMode.textColor
                  : "whiteAlpha.800"
            }
          >
            <Stack spacing={1} align="center">
              <Icon as={icon} boxSize={5} />
              <Text fontSize="xs">{label}</Text>
            </Stack>
          </Box>
        ))}
      </Flex>
    </Flex>
  );
};

export default Layout;
