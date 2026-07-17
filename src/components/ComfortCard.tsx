import { Heading, Stack, Text, useTheme } from "@chakra-ui/react";

import { getComfort } from "../api/comfort";
import { getWeatherBackground } from "../api/weatherIcon";
import { useWeatherContext } from "../context/WeatherContext";

const ComfortCard = () => {
  const { weather } = useWeatherContext();
  const { colors } = useTheme();

  if (!weather) return null;

  const comfort = getComfort(
    weather.current.temperature_2m,
    weather.current.dew_point_2m,
    new Date(weather.current.time).getMinutes(),
  );

  const background = getWeatherBackground(
    weather.current.weather_code,
    weather.current.is_day,
  );

  return (
    <Stack
      spacing={{ base: 0, md: 1 }}
      textAlign="center"
      background={background}
      transition="background 0.6s ease"
      borderRadius="1.5rem"
      shadow="xl"
      px={{ base: 5, md: 16 }}
      py={{ base: 2, md: 8 }}
      w="100%"
      maxW="42rem"
    >
      <Text
        color={colors.whiteAlpha["800"]}
        textTransform="uppercase"
        letterSpacing="widest"
        fontSize={{ base: "xs", md: "sm" }}
      >
        Comfort level
      </Text>
      <Heading
        color={colors.white}
        textShadow={`2px 2px ${colors.brand.ajBlueLvls["200"]}`}
        fontSize={{ base: "2xl", md: "6xl" }}
        lineHeight="1.1"
      >
        {comfort.label}
      </Heading>
      <Text
        color={colors.whiteAlpha["900"]}
        fontSize={{ base: "xs", md: "xl" }}
      >
        {comfort.blurb}
      </Text>
    </Stack>
  );
};

export default ComfortCard;
