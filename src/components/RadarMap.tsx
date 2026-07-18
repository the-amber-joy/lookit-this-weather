import { Box, Center, Spinner, Text } from "@chakra-ui/react";
import { useMemo } from "react";

import { useWeatherContext } from "../context/WeatherContext";

const buildRadarUrl = (latitude: number, longitude: number) => {
  const settings = {
    agenda: {
      id: "weather",
      center: [longitude, latitude],
      location: [longitude, latitude],
      zoom: 8,
      layer: "bref_qcd",
    },
    animating: true,
    base: "standard",
    artcc: false,
    county: false,
    cwa: false,
    rfc: false,
    state: false,
    menu: true,
    shortFusedOnly: false,
    opacity: {
      alerts: 0.8,
      local: 0.6,
      localStations: 0.8,
      national: 0.6,
    },
  };

  const encoded = encodeURIComponent(btoa(JSON.stringify(settings)));
  return `https://radar.weather.gov/?settings=v1_${encoded}`;
};

const RadarMap = () => {
  const { location, isLoading, error } = useWeatherContext();

  const src = useMemo(
    () =>
      location ? buildRadarUrl(location.latitude, location.longitude) : null,
    [location],
  );

  if (isLoading) {
    return (
      <Center minH="40vh">
        <Spinner size="xl" thickness="4px" color="brand.ajPurple" />
      </Center>
    );
  }

  if (error || !src) {
    return (
      <Center minH="40vh">
        <Text opacity={0.7}>{error || "Location unavailable."}</Text>
      </Center>
    );
  }

  // The NWS radar page renders a ~56px header/toolbar at the top that we
  // don't want to show embedded. Since it's a cross-origin iframe we can't
  // reach in and hide it directly, so instead we overscan the iframe height
  // by that amount, shift it up, and clip the overflow on the wrapper.
  const headerOffset = "56px";

  return (
    <Box
      h={{ base: "100%", md: "auto" }}
      maxW={{ base: "none", md: "50rem" }}
      mx="auto"
      py={{ base: 0, md: 8 }}
    >
      <Box
        position="relative"
        overflow="hidden"
        borderRadius="md"
        h={{ base: "100%", md: "auto" }}
        sx={{ aspectRatio: { md: "4 / 3" } }}
      >
        <Box
          as="iframe"
          src={src}
          title="NWS radar map"
          border="0"
          position="absolute"
          top={`-${headerOffset}`}
          left={0}
          width="100%"
          height={`calc(100% + ${headerOffset})`}
        />
      </Box>
    </Box>
  );
};

export default RadarMap;
