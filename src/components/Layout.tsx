import { CalendarIcon, SunIcon, TimeIcon } from "@chakra-ui/icons";
// import { ViewIcon } from "@chakra-ui/icons"; // Re-enable with the Radar tab
import type { ComponentWithAs, IconProps } from "@chakra-ui/react";
import { Box, Button, Flex, Icon, Stack, Text, VStack } from "@chakra-ui/react";
import { ReactNode, useState } from "react";

// import ComingSoon from "./ComingSoon"; // Re-enable with the Radar tab
import CurrentWeather from "./CurrentWeather";
import DailyForecast from "./DailyForecast";
import HourlyForecast from "./HourlyForecast";

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
  // Radar tab hidden until the interactive map is ready.
  // {
  //   label: "Radar",
  //   icon: ViewIcon,
  //   panel: (
  //     <ComingSoon
  //       title="Radar map"
  //       description="An interactive radar map is coming soon."
  //     />
  //   ),
  // },
];

const Layout = () => {
  const [active, setActive] = useState(0);

  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      height="100dvh"
      overflow="hidden"
    >
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
        minH={0}
        overflowY="auto"
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
