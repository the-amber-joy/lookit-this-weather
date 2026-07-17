import {
  Box,
  Center,
  Flex,
  Heading,
  HStack,
  Image,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import dayjs from "dayjs";

import { getHourlyForecast, HourlyPoint } from "../api/getHourlyForecast";
import {
  dewPointIcon,
  getPrecipitationIcon,
  getWeatherIcon,
} from "../api/weatherIcon";
import { useWeatherContext } from "../context/WeatherContext";

const HourRow = ({
  point,
  isFirst,
  units,
}: {
  point: HourlyPoint;
  isFirst: boolean;
  units?: {
    temperature: string;
    dewPoint: string;
    precip: string;
    wind: string;
  };
}) => {
  const icon = getWeatherIcon(point.weatherCode, point.isDay);
  const precipIcon = getPrecipitationIcon(
    point.precipitationProbability,
    point.weatherCode,
  );

  return (
    <Flex align="center" gap={{ base: 3, md: 4 }} py={2}>
      <Text
        minW={{ base: "3.5rem", md: "4rem" }}
        fontWeight="bold"
        fontSize="sm"
      >
        {isFirst ? "Now" : dayjs(point.time).format("h A")}
      </Text>

      <Image
        src={icon.src}
        alt={icon.label}
        boxSize="2.5rem"
        flexShrink={0}
        draggable={false}
      />

      <Box minW={{ base: "4.5rem", md: "6rem" }}>
        <Text fontWeight="bold">
          {Math.round(point.temperature)}
          {units?.temperature ?? "°"}
        </Text>
        <HStack spacing={1} opacity={0.7}>
          <Box
            aria-hidden
            flexShrink={0}
            boxSize="1rem"
            sx={{
              "& svg": { width: "100%", height: "100%", display: "block" },
            }}
            dangerouslySetInnerHTML={{ __html: dewPointIcon }}
          />
          <Text fontSize="xs">
            {Math.round(point.dewPoint)}
            {units?.dewPoint ?? "°"}
          </Text>
        </HStack>
      </Box>

      <HStack minW={{ base: "4rem", md: "5rem" }} spacing={2}>
        <Box
          aria-hidden
          flexShrink={0}
          boxSize="1.5rem"
          sx={{ "& svg": { width: "100%", height: "100%", display: "block" } }}
          dangerouslySetInnerHTML={{ __html: precipIcon }}
        />
        <Text fontSize="sm">
          {Math.round(point.precipitationProbability)}
          {units?.precip ?? "%"}
        </Text>
      </HStack>

      <Text fontSize="sm" opacity={0.8} ml="auto" whiteSpace="nowrap">
        {Math.round(point.windSpeed)} {units?.wind ?? "mph"}
      </Text>
    </Flex>
  );
};

const HourlyForecast = () => {
  const { weather, isLoading, error } = useWeatherContext();

  if (isLoading) {
    return (
      <Center minH="40vh">
        <Spinner size="xl" thickness="4px" color="brand.ajPurple" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center minH="40vh">
        <Text opacity={0.7}>{error}</Text>
      </Center>
    );
  }

  const days = getHourlyForecast(weather);
  const units = weather?.hourly_units && {
    temperature: weather.hourly_units.temperature_2m,
    dewPoint: weather.hourly_units.dew_point_2m,
    precip: weather.hourly_units.precipitation_probability,
    wind: weather.hourly_units.wind_speed_10m,
  };

  return (
    <Stack spacing={6} maxW="40rem" mx="auto" py={{ base: 4, md: 8 }}>
      {days.map((day) => (
        <Stack key={day.label} spacing={0}>
          <Heading
            size="sm"
            position="sticky"
            top={0}
            zIndex={1}
            bg="brand.ajBlueLvls.100"
            py={2}
            color="brand.ajCheez"
          >
            {day.label}
          </Heading>
          <Stack
            spacing={0}
            divider={
              <Box borderBottomWidth="1px" borderColor="whiteAlpha.100" />
            }
          >
            {day.hours.map((point, index) => (
              <HourRow
                key={point.time}
                point={point}
                isFirst={day.label === "Today" && index === 0}
                units={units || undefined}
              />
            ))}
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
};

export default HourlyForecast;
