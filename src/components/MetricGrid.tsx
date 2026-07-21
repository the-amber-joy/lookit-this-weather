import { Alert, AlertIcon, Box, Center, Flex, Spinner } from "@chakra-ui/react";

import { getDailyForecast } from "../api/getDailyForecast";
import { getPrecipitationTiming } from "../api/getHourlyForecast";
import {
  formatWindUnit,
  getHighestAirQuality,
  getWindDirection,
} from "../api/weatherHelpers";
import {
  airQualityIcon,
  getPrecipitationIcon,
  getWindSpeedIcon,
} from "../api/weatherIcon";
import { useWeatherContext } from "../context/WeatherContext";
import MetricCard from "./MetricCard";

const MetricGrid = () => {
  const { weather, airQuality, isLoading, error } = useWeatherContext();

  if (isLoading) {
    return (
      <Center
        minH={{ base: "5rem", md: "16rem" }}
        w={{ base: "100%", md: "22rem" }}
      >
        <Spinner size="xl" thickness="4px" color="brand.ajPurple" />
      </Center>
    );
  }

  const today = weather ? getDailyForecast(weather)[0]?.point : undefined;

  const PRECIP_TIMING_THRESHOLD = 25;
  const precipTiming = today
    ? getPrecipitationTiming(weather ?? null, PRECIP_TIMING_THRESHOLD)
    : null;
  const precipVerb = !precipTiming
    ? ""
    : precipTiming.probability >= 60
      ? "starting"
      : precipTiming.probability >= 45
        ? "likely"
        : "possible";
  const precipTimingSuffix = !precipTiming
    ? ""
    : precipTiming.time === "now"
      ? `, ${precipVerb} now`
      : `, ${precipVerb} at ${precipTiming.time}`;

  const highestAirQuality = airQuality
    ? getHighestAirQuality(airQuality)
    : null;

  const metrics = weather
    ? [
        {
          label: "Wind",
          value: `${getWindDirection(weather.current.wind_direction_10m)} ${Math.round(weather.current.wind_speed_10m)} ${formatWindUnit(weather.current_units.wind_speed_10m)}`,
          detail: `Gust ${Math.round(weather.current.wind_gusts_10m)} ${formatWindUnit(weather.current_units.wind_gusts_10m)}`,
          icon: getWindSpeedIcon(weather.current.wind_speed_10m),
          windDirectionDegrees: weather.current.wind_direction_10m,
        },
        ...(highestAirQuality
          ? [
              {
                label: "Air Quality",
                value: `AQI ${Math.round(highestAirQuality.aqi)}`,
                detail: `${highestAirQuality.category.label} (${highestAirQuality.pollutant})`,
                icon: airQualityIcon,
                accentColor: highestAirQuality.category.color,
              },
            ]
          : []),
        ...(today && weather.daily_units
          ? [
              {
                label: "Today",
                value: `${Math.round(today.temperatureMax)}${weather.daily_units.temperature_2m_max} / ${Math.round(today.temperatureMin)}${weather.daily_units.temperature_2m_min}`,
                detail: `${Math.round(today.precipitationProbability)}${weather.daily_units.precipitation_probability_max} chance of rain${precipTimingSuffix}`,
                icon: getPrecipitationIcon(
                  today.precipitationProbability,
                  today.weatherCode,
                ),
              },
            ]
          : []),
      ]
    : [];

  return (
    <Flex
      direction={{ base: "column", sm: "row", md: "column" }}
      wrap="wrap"
      gap={{ base: 2, md: 4 }}
      justify="center"
      flex={{ md: "0 1 22rem" }}
      w={{ base: "100%", md: "22rem" }}
    >
      {error && (
        <Alert status="error" borderRadius="1rem" w="100%">
          <AlertIcon />
          {error}
        </Alert>
      )}

      {metrics.map((metric) => (
        <Box
          key={metric.label}
          flex={{ base: "1 1 auto", sm: "1 1 9rem", md: "1 1 auto" }}
          minW={0}
        >
          <MetricCard
            label={metric.label}
            value={metric.value}
            detail={metric.detail}
            icon={metric.icon}
            windDirectionDegrees={metric.windDirectionDegrees}
            accentColor={metric.accentColor}
          />
        </Box>
      ))}
    </Flex>
  );
};

export default MetricGrid;
