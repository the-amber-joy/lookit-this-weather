import {
  CalendarIcon,
  RepeatIcon,
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
  Image,
  Spinner,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ReactNode, useEffect, useRef, useState } from "react";

import butterfly from "../assets/butterfly.png";
import firefly from "../assets/firefly.png";
import { useThemeName } from "../context/ThemeNameContext";
import {
  PULL_TRIGGER_DISTANCE,
  usePullToRefresh,
} from "../hooks/usePullToRefresh";
import { useMode } from "../theme/themedMode";
import CurrentWeather from "./CurrentWeather";
import DailyForecast from "./DailyForecast";
import HourlyForecast from "./HourlyForecast";
import RadarMap from "./RadarMap";
import Themes from "./Settings";
import Sparkles from "./Sparkles";
import Starz from "./Starz";
import SynthwaveGrid from "./SynthwaveGrid";
import UpdateBanner from "./UpdateBanner";

interface TabItem {
  label: string;
  icon: ComponentWithAs<"svg", IconProps>;
  panel: ReactNode;
  // Whether the tab's panel needs to fill the available height (e.g. the
  // radar map, which needs concrete pixel dimensions). Other tabs size to
  // their natural content height so the surrounding scroll area/padding
  // calculations behave correctly.
  fillHeight?: boolean;
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
    fillHeight: true,
  },
  {
    label: "Settings",
    icon: SettingsIcon,
    panel: <Themes />,
  },
];

// Shared with SynthwaveGrid so its horizon/vanishing point centers on the
// content column, not the full viewport, once the desktop sidebar appears.
const DESKTOP_SIDEBAR_WIDTH = "12rem";

const MotionBox = motion(Box);
const MotionImage = motion(Image);

const Layout = () => {
  const [active, setActive] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const mode = useMode();
  const { pullDistance, refreshing } = usePullToRefresh(contentRef);
  const { themeName } = useThemeName();
  const isFairycoreNight = themeName === "fairycore" && !mode.isDay;
  const isFairycoreDayActive = themeName === "fairycore" && mode.isDay;

  useEffect(() => {
    contentRef.current?.scrollTo(0, 0);
  }, [active]);

  const pageBackground = mode.pageBackground;

  return (
    <Flex direction="column" height="100dvh">
      <UpdateBanner />
      <Flex
        flex="1"
        minH={0}
        direction={{ base: "column", md: "row" }}
        overflowY="hidden"
        overflowX="visible"
      >
        {pageBackground && (
          <Box
            position="fixed"
            inset={0}
            zIndex={-2}
            pointerEvents="none"
            background={pageBackground}
          />
        )}
        {themeName === "synthwave" && (
          <Starz leftOffset={{ base: 0, md: DESKTOP_SIDEBAR_WIDTH }} />
        )}
        {themeName === "synthwave" && (
          <SynthwaveGrid leftOffset={{ base: 0, md: DESKTOP_SIDEBAR_WIDTH }} />
        )}
        {themeName === "fairycore" && (
          <Sparkles leftOffset={{ base: 0, md: DESKTOP_SIDEBAR_WIDTH }} />
        )}

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
          minW={DESKTOP_SIDEBAR_WIDTH}
          p={4}
          bg={mode.surfaceBg ?? "brand.ajBlueLvls.200"}
          borderRightWidth="1px"
          borderColor="whiteAlpha.200"
          boxShadow="4px 0 12px rgba(0, 0, 0, 0.15)"
        >
          {tabs.map(({ label, icon }, index) => (
            <Button
              key={label}
              position="relative"
              variant="ghost"
              justifyContent="flex-start"
              leftIcon={<Icon as={icon} />}
              onClick={() => setActive(index)}
              aria-current={active === index ? "page" : undefined}
              bg={active === index ? mode.tabBgColor ?? "whiteAlpha.200" : undefined}
              _hover={{
                bg:mode.tabBgColor ?? "whiteAlpha.200"
              }}
              color={
                active === index
                  ? mode.accentColor
                  : mode.isDay
                    ? mode.textColor
                    : undefined
              }
            >
              {isFairycoreNight && active === index && (
                <MotionImage
                  layoutId="firefly-desktop"
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 300, damping: 24 }
                  }
                  src={firefly}
                  alt=""
                  aria-hidden
                  boxSize="3.5rem"
                  position="absolute"
                  top="-1.5rem"
                  left="-1.5rem"
                  pointerEvents="none"
                />
              )}
              {isFairycoreDayActive && active === index && (
                <MotionImage
                  layoutId="butterfly-desktop"
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 300, damping: 24 }
                  }
                  src={butterfly}
                  alt=""
                  aria-hidden
                  boxSize="3.5rem"
                  position="absolute"
                  top="-1.5rem"
                  right="-1.5rem"
                  pointerEvents="none"
                />
              )}
              {label}
            </Button>
          ))}
        </VStack>

        {/* Content */}
        <Box
          ref={contentRef}
          position="relative"
          flex="1"
          minH={0}
          overflowY="auto"
          px={{ base: 4, md: 8 }}
          pb={{ base: "calc(6rem + env(safe-area-inset-bottom))", md: 0 }}
        >
          <Flex
            position="absolute"
            top="-2.5rem"
            left={0}
            right={0}
            height="2.5rem"
            justify="center"
            align="center"
            pointerEvents="none"
            opacity={refreshing || pullDistance > 0 ? 1 : 0}
            color={mode.isDay ? mode.textColor : "whiteAlpha.900"}
            transform={`translateY(${refreshing ? 40 : pullDistance}px)`}
            transition={
              pullDistance === 0 && !refreshing
                ? "transform 0.2s ease"
                : undefined
            }
          >
            {refreshing ? (
              <Spinner size="sm" />
            ) : (
              <Icon
                as={RepeatIcon}
                boxSize={5}
                transform={`rotate(${Math.min(
                  (pullDistance / PULL_TRIGGER_DISTANCE) * 180,
                  180,
                )}deg)`}
              />
            )}
          </Flex>
          <AnimatePresence mode="wait" initial={false}>
            <MotionBox
              key={active}
              height={tabs[active].fillHeight ? "100%" : "auto"}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, y: -8 }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.2,
                ease: "easeOut",
              }}
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
          bg={mode.surfaceBg ?? "brand.ajBlueLvls.200"}
          borderTopWidth="1px"
          borderColor="whiteAlpha.200"
          boxShadow="0 -4px 12px rgba(0, 0, 0, 0.15)"
          pt={2}
          pb="calc(env(safe-area-inset-bottom) + 0.5rem)"
        >
          {tabs.map(({ label, icon }, index) => (
            <Box
              key={label}
              as="button"
              position="relative"
              flex="1"
              onClick={() => setActive(index)}
              aria-current={active === index ? "page" : undefined}
              color={
                active === index
                  ? mode.accentColor
                  : mode.isDay
                    ? mode.textColor
                    : "whiteAlpha.800"
              }
            >
              {isFairycoreNight && active === index && (
                <MotionImage
                  layoutId="firefly-mobile"
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 300, damping: 24 }
                  }
                  src={firefly}
                  alt=""
                  aria-hidden
                  boxSize="3.5rem"
                  position="absolute"
                  top="-1.25rem"
                  left="-0.25rem"
                  pointerEvents="none"
                />
              )}
              {isFairycoreDayActive && active === index && (
                <MotionImage
                  layoutId="butterfly-mobile"
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 300, damping: 24 }
                  }
                  src={butterfly}
                  alt=""
                  aria-hidden
                  boxSize="2rem"
                  position="absolute"
                  top="-0.75rem"
                  right="0.25rem"
                  pointerEvents="none"
                />
              )}
              <Stack spacing={1} align="center">
                <Icon as={icon} boxSize={5} />
                <Text fontSize="xs">{label}</Text>
              </Stack>
            </Box>
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Layout;
