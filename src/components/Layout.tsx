import { ReactNode, useState } from "react";
import { CalendarIcon, SunIcon, TimeIcon, ViewIcon } from "@chakra-ui/icons";
import type { ComponentWithAs, IconProps } from "@chakra-ui/react";
import {
  Box,
  Button,
  Flex,
  Icon,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";

import ComingSoon from "./ComingSoon";
import CurrentWeather from "./CurrentWeather";

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
    panel: (
      <ComingSoon
        title="Hourly forecast"
        description="Hour-by-hour conditions are coming soon."
      />
    ),
  },
  {
    label: "Daily",
    icon: CalendarIcon,
    panel: (
      <ComingSoon
        title="Daily forecast"
        description="The multi-day outlook is coming soon."
      />
    ),
  },
  {
    label: "Radar",
    icon: ViewIcon,
    panel: (
      <ComingSoon
        title="Radar map"
        description="An interactive radar map is coming soon."
      />
    ),
  },
];

const Layout = () => {
  const [active, setActive] = useState(0);

  return (
    <Flex direction={{ base: "column", md: "row" }} minH="100dvh">
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
            color={active === index ? "brand.ajCheez" : undefined}
          >
            {label}
          </Button>
        ))}
      </VStack>

      {/* Content */}
      <Box
        flex="1"
        overflowY="auto"
        height="100dvh"
        px={{ base: 4, md: 8 }}
        pb={{ base: "5.5rem", md: 0 }}
      >
        {tabs[active].panel}
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
        bg="brand.ajBlueLvls.200"
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
            color={active === index ? "brand.ajCheez" : "whiteAlpha.800"}
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
