import { Heading, Stack, Text, useTheme } from "@chakra-ui/react";

import { getComfort } from "../api/comfort";
import { getWeatherBackground, getWeatherTextTone } from "../api/weatherIcon";
import { useThemeName } from "../context/ThemeNameContext";
import { useWeatherContext } from "../context/WeatherContext";
import { useFairycoreDayMode } from "../theme/fairycoreDayMode";
import { getOrganicCardStyle } from "../theme/organicCard";

const ComfortCard = () => {
  const { weather } = useWeatherContext();
  const { colors } = useTheme();
  const { themeName } = useThemeName();
  const dayMode = useFairycoreDayMode();

  if (!weather) return null;

  const comfort = getComfort(
    weather.current.temperature_2m,
    weather.current.dew_point_2m,
    new Date(weather.current.time).getMinutes(),
  );

  const background = getWeatherBackground(
    weather.current.weather_code,
    weather.current.is_day,
    themeName,
  );

  const cardStyle = getOrganicCardStyle(
    themeName,
    colors.brand,
    background,
    "1.5rem",
  );

  const isDarkText =
    !dayMode.isFairycoreDay &&
    getWeatherTextTone(weather.current.weather_code, weather.current.is_day) ===
      "dark";
  const textColor = dayMode.isFairycoreDay
    ? dayMode.textColor
    : isDarkText
      ? colors.brand.ajBlueLvls["200"]
      : colors.white;
  const textShadowColor = dayMode.isFairycoreDay
    ? dayMode.textShadow
    : isDarkText
      ? colors.whiteAlpha["800"]
      : colors.brand.ajBlueLvls["200"];
  const mutedTextColor = dayMode.isFairycoreDay
    ? dayMode.subTextColor
    : isDarkText
      ? colors.brand.ajBlueLvls["300"]
      : colors.whiteAlpha["800"];
  const blurbTextColor = dayMode.isFairycoreDay
    ? dayMode.subTextColor
    : isDarkText
      ? colors.brand.ajBlueLvls["300"]
      : colors.whiteAlpha["900"];

  return (
    <Stack
      spacing={{ base: 0, md: 1 }}
      textAlign="center"
      background={cardStyle.background}
      border={cardStyle.border}
      transition="background 0.6s ease"
      borderRadius={cardStyle.borderRadius}
      shadow="card"
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
