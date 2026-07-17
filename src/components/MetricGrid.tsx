import { Alert, AlertIcon, Center, Spinner, Stack } from "@chakra-ui/react";

import { getPrecipitationType, getWindDirection } from "../api/weatherHelpers";
import { getPrecipitationIcon, getWindSpeedIcon } from "../api/weatherIcon";
import { useWeatherContext } from "../context/WeatherContext";
import MetricCard from "./MetricCard";

const MetricGrid = () => {
  const { weather, isLoading, error } = useWeatherContext();

  if (isLoading) {
    return (
      <Center
        minH={{ base: "8rem", md: "16rem" }}
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
          value: `${getWindDirection(weather.current.wind_direction_10m)} ${Math.round(weather.current.wind_speed_10m)} ${weather.current_units.wind_speed_10m}`,
          detail: `Gusts ${Math.round(weather.current.wind_gusts_10m)} ${weather.current_units.wind_gusts_10m}`,
          icon: getWindSpeedIcon(weather.current.wind_speed_10m),
        },
      ]
    : [];

  return (
    <Stack spacing={4} justify="center" w={{ base: "100%", md: "22rem" }}>
      {error && (
        <Alert status="error" borderRadius="1rem">
          <AlertIcon />
          {error}
        </Alert>
      )}

      {metrics.map((metric) => (
        <MetricCard
          key={metric.label}
          label={metric.label}
          value={metric.value}
          detail={metric.detail}
          icon={metric.icon}
        />
      ))}
    </Stack>
  );
};

export default MetricGrid;
