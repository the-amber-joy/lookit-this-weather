import { Box, Center, Flex, HStack, Stack, Text } from "@chakra-ui/react";
import dayjs from "dayjs";

import { DailyPoint, getDailyForecast } from "../api/getDailyForecast";
import { formatWindUnit, getWindDirection } from "../api/weatherHelpers";
import {
  getStaticPrecipitationIcon,
  getStaticWeatherIcon,
  getStaticWindIcon,
} from "../api/weatherIcon";
import { useWeatherContext } from "../context/WeatherContext";

import ThemedSpinner from "./ThemedSpinner";

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
    <Flex direction="column" gap={1} py={3}>
      {/* Line 1: conditions icon, day, and the high/low temps. */}
      <Flex align="center" gap={3}>
        <Box
          aria-label={icon.label}
          role="img"
          flexShrink={0}
          boxSize="2.75rem"
          sx={{ "& svg": { width: "100%", height: "100%", display: "block" } }}
          dangerouslySetInnerHTML={{ __html: icon.svg }}
        />

        <Box>
          <Text fontWeight="bold" whiteSpace="nowrap">
            {label}
          </Text>
          <Text fontSize="xs" opacity={0.6}>
            {dayjs(point.time).format("MMM D")}
          </Text>
        </Box>

        <HStack ml="auto" spacing={2} whiteSpace="nowrap">
          <Text fontWeight="bold" fontSize="lg">
            {Math.round(point.temperatureMax)}
            {units?.temperature ?? "°"}
          </Text>
          <Text opacity={0.6} fontSize="lg">
            {Math.round(point.temperatureMin)}
            {units?.temperature ?? "°"}
          </Text>
        </HStack>
      </Flex>

      {/* Line 2: precipitation and wind, aligned under the day name. */}
      <HStack spacing={6} pl="3.5rem" opacity={0.9}>
        <HStack spacing={1}>
          <Box
            aria-hidden
            flexShrink={0}
            boxSize="1.5rem"
            sx={{
              "& svg": { width: "100%", height: "100%", display: "block" },
            }}
            dangerouslySetInnerHTML={{ __html: precipIcon }}
          />
          <Text fontSize="sm">
            {Math.round(point.precipitationProbability)}
            {units?.precip ?? "%"}
          </Text>
        </HStack>

        <HStack spacing={1}>
          <Box
            aria-label={windIcon.label}
            role="img"
            flexShrink={0}
            boxSize="1.5rem"
            sx={{
              "& svg": { width: "100%", height: "100%", display: "block" },
            }}
            dangerouslySetInnerHTML={{ __html: windIcon.svg }}
          />
          <Text fontSize="sm" whiteSpace="nowrap">
            {getWindDirection(point.windDirection)}{" "}
            {Math.round(point.windSpeed)} {units?.wind ?? "mph"}
          </Text>
        </HStack>
      </HStack>
    </Flex>
  );
};

const DailyForecast = () => {
  const { weather, isLoading, error } = useWeatherContext();

  if (isLoading) {
    return (
      <Center minH="40vh">
        <ThemedSpinner />
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
    wind: formatWindUnit(weather.daily_units.wind_speed_10m_max),
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
