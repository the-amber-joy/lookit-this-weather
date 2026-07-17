import {
  Box,
  Center,
  Flex,
  HStack,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import dayjs from "dayjs";

import { DailyPoint, getDailyForecast } from "../api/getDailyForecast";
import { getWindDirection } from "../api/weatherHelpers";
import {
  getStaticPrecipitationIcon,
  getStaticWeatherIcon,
  getStaticWindIcon,
} from "../api/weatherIcon";
import { useWeatherContext } from "../context/WeatherContext";

const DayRow = ({
  point,
  label,
  units,
}: {
  point: DailyPoint;
  label: string;
  units?: {
    temperature: string;
    precip: string;
    wind: string;
  };
}) => {
  // Daily summaries always use the daytime icon variant.
  const icon = getStaticWeatherIcon(point.weatherCode, 1);
  const precipIcon = getStaticPrecipitationIcon(
    point.precipitationProbability,
    point.weatherCode,
  );
  const windIcon = getStaticWindIcon(point.windSpeed);

  return (
    <Flex align="center" gap={{ base: 3, md: 4 }} py={2}>
      <Box minW={{ base: "4rem", md: "5.5rem" }}>
        <Text fontWeight="bold" fontSize="sm">
          {label}
        </Text>
        <Text fontSize="xs" opacity={0.6}>
          {dayjs(point.time).format("MMM D")}
        </Text>
      </Box>

      <Box
        aria-label={icon.label}
        role="img"
        flexShrink={0}
        boxSize="2.75rem"
        sx={{ "& svg": { width: "100%", height: "100%", display: "block" } }}
        dangerouslySetInnerHTML={{ __html: icon.svg }}
      />

      <HStack minW={{ base: "3.5rem", md: "4.5rem" }} spacing={1}>
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

      <HStack minW={{ base: "5rem", md: "6.5rem" }} spacing={1}>
        <Box
          aria-label={windIcon.label}
          role="img"
          flexShrink={0}
          boxSize="1.5rem"
          sx={{ "& svg": { width: "100%", height: "100%", display: "block" } }}
          dangerouslySetInnerHTML={{ __html: windIcon.svg }}
        />
        <Text fontSize="sm" opacity={0.8}>
          {getWindDirection(point.windDirection)} {Math.round(point.windSpeed)}{" "}
          {units?.wind ?? "mph"}
        </Text>
      </HStack>

      <HStack ml="auto" spacing={2} whiteSpace="nowrap">
        <Text fontWeight="bold">
          {Math.round(point.temperatureMax)}
          {units?.temperature ?? "°"}
        </Text>
        <Text opacity={0.6}>
          {Math.round(point.temperatureMin)}
          {units?.temperature ?? "°"}
        </Text>
      </HStack>
    </Flex>
  );
};

const DailyForecast = () => {
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

  const days = getDailyForecast(weather);
  const units = weather?.daily_units && {
    temperature: weather.daily_units.temperature_2m_max,
    precip: weather.daily_units.precipitation_probability_max,
    wind: weather.daily_units.wind_speed_10m_max,
  };

  return (
    <Stack
      spacing={0}
      maxW="40rem"
      mx="auto"
      py={{ base: 4, md: 8 }}
      divider={<Box borderBottomWidth="1px" borderColor="whiteAlpha.100" />}
    >
      {days.map(({ point, label }) => (
        <DayRow
          key={point.time}
          point={point}
          label={label}
          units={units || undefined}
        />
      ))}
    </Stack>
  );
};

export default DailyForecast;
