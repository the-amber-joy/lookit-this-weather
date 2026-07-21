import { Heading, Stack, Text, useTheme } from "@chakra-ui/react";

import { getComfort } from "../api/comfort";
import { getWeatherBackground, getWeatherTextTone } from "../api/weatherIcon";
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

  const isDarkText =
    getWeatherTextTone(weather.current.weather_code, weather.current.is_day) ===
    "dark";
  const textColor = isDarkText ? colors.brand.ajBlueLvls["200"] : colors.white;
  const textShadowColor = isDarkText
    ? colors.whiteAlpha["800"]
    : colors.brand.ajBlueLvls["200"];
  const mutedTextColor = isDarkText
    ? colors.brand.ajBlueLvls["300"]
    : colors.whiteAlpha["800"];
  const blurbTextColor = isDarkText
    ? colors.brand.ajBlueLvls["300"]
    : colors.whiteAlpha["900"];

  return (
    <Stack
      spacing={{ base: 0, md: 1 }}
      textAlign="center"
      background={background}
      transition="background 0.6s ease"
      borderRadius="1.5rem"
      shadow="xl"
      px={{ base: 6, md: 16 }}
      py={{ base: 4, md: 8 }}
      w="100%"
    >
      <Text
        color={mutedTextColor}
        textTransform="uppercase"
        letterSpacing="widest"
        fontSize={{ base: "sm", md: "sm" }}
      >
        Comfort level
      </Text>
      <Heading
        color={textColor}
        textShadow={`2px 2px ${textShadowColor}`}
        fontSize={{ base: "4xl", md: "6xl" }}
        lineHeight="1.1"
      >
        {comfort.label}
      </Heading>
      <Text color={blurbTextColor} fontSize={{ base: "md", md: "xl" }}>
        {comfort.blurb}
      </Text>
    </Stack>
  );
};

export default ComfortCard;
