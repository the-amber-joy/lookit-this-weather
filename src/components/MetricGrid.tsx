import { Alert, AlertIcon, Box, Center, Flex, Spinner } from "@chakra-ui/react";

import {
  formatWindUnit,
  getPrecipitationType,
  getWindDirection,
} from "../api/weatherHelpers";
import { getPrecipitationIcon, getWindSpeedIcon } from "../api/weatherIcon";
import { useWeatherContext } from "../context/WeatherContext";
import MetricCard from "./MetricCard";

const MetricGrid = () => {
  const { weather, isLoading, error } = useWeatherContext();

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

  const metrics = weather
    ? [
        {
          label: "Precipitation",
          value: getPrecipitationType(
            weather.current.precipitation_probability,
            weather.current.weather_code,
          ),
          detail: `${Math.round(weather.current.precipitation_probability)}${weather.current_units.precipitation_probability} chance`,
          icon: getPrecipitationIcon(
            weather.current.precipitation_probability,
            weather.current.weather_code,
          ),
        },
        {
          label: "Wind",
          value: `${getWindDirection(weather.current.wind_direction_10m)} ${Math.round(weather.current.wind_speed_10m)} ${formatWindUnit(weather.current_units.wind_speed_10m)}`,
          detail: `Gusting ${Math.round(weather.current.wind_gusts_10m)} ${formatWindUnit(weather.current_units.wind_gusts_10m)}`,
          icon: getWindSpeedIcon(weather.current.wind_speed_10m),
          windDirectionDegrees: weather.current.wind_direction_10m,
        },
      ]
    : [];

  return (
    <Flex
      direction={{ base: "row", md: "column" }}
      wrap="wrap"
      gap={{ base: 2, md: 4 }}
      justify="center"
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
          flex={{ base: "1 1 12rem", md: "1 1 auto" }}
          minW={0}
        >
          <MetricCard
            label={metric.label}
            value={metric.value}
            detail={metric.detail}
            icon={metric.icon}
            windDirectionDegrees={metric.windDirectionDegrees}
          />
        </Box>
      ))}
    </Flex>
  );
};

export default MetricGrid;
