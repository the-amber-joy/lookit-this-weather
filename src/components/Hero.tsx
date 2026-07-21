import {
  Box,
  Center,
  Flex,
  Heading,
  HStack,
  Image,
  Stack,
  Text,
  useTheme,
} from "@chakra-ui/react";
import dayjs from "dayjs";

import {
  dewPointIcon,
  getFallbackBackground,
  getWeatherBackground,
  getWeatherIcon,
} from "../api/weatherIcon";
import { useThemeName } from "../context/ThemeNameContext";
import { useWeatherContext } from "../context/WeatherContext";
import { useFairycoreDayMode } from "../theme/fairycoreDayMode";
import { getOrganicCardStyle } from "../theme/organicCard";

const Hero = () => {
  const { location, weather, error } = useWeatherContext();
  const { colors } = useTheme();
  const { themeName } = useThemeName();
  const dayMode = useFairycoreDayMode();

  const icon = weather
    ? getWeatherIcon(weather.current.weather_code, weather.current.is_day)
    : null;

  const background = weather
    ? getWeatherBackground(
        weather.current.weather_code,
        weather.current.is_day,
        themeName,
      )
    : getFallbackBackground(themeName);

  const cardStyle = getOrganicCardStyle(
    themeName,
    colors.brand,
    background,
    "1rem",
  );

  const temperature = weather
    ? `${Math.round(weather.current.temperature_2m)}${weather.current_units.temperature_2m}`
    : "--";

  const dewPoint = weather
    ? `${Math.round(weather.current.dew_point_2m)}${weather.current_units.dew_point_2m}`
    : null;

  const heading = error
    ? "Weather unavailable"
    : (location?.name ?? "Loading location...");

  const updatedAt = () => {
    if (error) return "Please try again.";
    if (!weather) return "Getting current conditions...";
    return `Updated ${dayjs(weather.current.time).format("h:mm A")} ${weather.timezone_abbreviation}`;
  };

  return (
    <Flex flex={{ md: "1 1 0%" }} minW={0} justifyContent="center">
      <Center
        w={{ md: "100%" }}
        minW={{ base: "auto", md: "12rem" }}
        textAlign="center"
        background={cardStyle.background}
        border={cardStyle.border}
        transition="background 0.6s ease"
        borderRadius={cardStyle.borderRadius}
        shadow="card"
        px={{ base: 6, md: 8 }}
        py={{ base: 4, md: 6 }}
      >
        <Stack spacing={{ base: 1, md: 1 }}>
          {icon && (
            <Image
              src={icon.src}
              alt={icon.label}
              boxSize={{ base: "6rem", md: "8rem" }}
              mx="auto"
              draggable={false}
            />
          )}
          <Heading
            color={dayMode.textColor}
            textShadow={`2px 2px ${dayMode.textShadow}`}
            fontSize={{ base: "xl", md: "2rem" }}
          >
            {heading}
          </Heading>
          <Heading
            color={dayMode.textColor}
            textShadow={`2px 2px ${dayMode.textShadow}`}
            fontSize={{ base: "5xl", md: "6xl" }}
            lineHeight="1.1"
          >
            {temperature}
          </Heading>
          {icon && (
            <Text color={dayMode.textColor} fontSize={{ base: "md", md: "lg" }}>
              {icon.label}
            </Text>
          )}
          {dewPoint && (
            <HStack justify="center" spacing={1} color={dayMode.textColor}>
              <Box
                aria-hidden
                boxSize={{ base: "1.5rem", md: "1.75rem" }}
                sx={{
                  "& svg": { width: "100%", height: "100%", display: "block" },
                }}
                dangerouslySetInnerHTML={{ __html: dewPointIcon }}
              />
              <Text
                fontSize={{ base: "md", md: "xl" }}
                fontWeight="bold"
                textShadow={`1px 1px ${dayMode.textShadow}`}
              >
                Dew point {dewPoint}
              </Text>
            </HStack>
          )}
          <Text
            fontSize={{ base: "sm", md: "md" }}
            color={dayMode.subTextColor}
          >
            {updatedAt()}
          </Text>
        </Stack>
      </Center>
    </Flex>
  );
};

export default Hero;
