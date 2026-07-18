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
  getWeatherBackground,
  getWeatherIcon,
} from "../api/weatherIcon";
import { useWeatherContext } from "../context/WeatherContext";

const Hero = () => {
  const { location, weather, error } = useWeatherContext();
  const { colors } = useTheme();

  const icon = weather
    ? getWeatherIcon(weather.current.weather_code, weather.current.is_day)
    : null;

  const background = weather
    ? getWeatherBackground(weather.current.weather_code, weather.current.is_day)
    : "linear-gradient(160deg, #1b467e, #245da8, #5790db)";

  const temperature = weather
    ? `${Math.round(weather.current.temperature_2m)}${weather.current_units.temperature_2m}`
    : "--";

  const dewPoint = weather
    ? `${Math.round(weather.current.dew_point_2m)}${weather.current_units.dew_point_2m}`
    : null;

  const highLow =
    weather?.daily && weather.daily_units
      ? `${Math.round(weather.daily.temperature_2m_max[0])}${weather.daily_units.temperature_2m_max} / ${Math.round(weather.daily.temperature_2m_min[0])}${weather.daily_units.temperature_2m_min}`
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
    <Flex justifyContent="center">
      <Center
        minW={{ base: "auto", md: "xs" }}
        textAlign="center"
        background={background}
        transition="background 0.6s ease"
        borderRadius="1rem"
        shadow="lg"
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
            color={colors.white}
            textShadow={`2px 2px ${colors.brand.ajBlueLvls["200"]}`}
            fontSize={{ base: "xl", md: "2rem" }}
          >
            {heading}
          </Heading>
          <Heading
            color={colors.white}
            textShadow={`2px 2px ${colors.brand.ajBlueLvls["200"]}`}
            fontSize={{ base: "5xl", md: "6xl" }}
            lineHeight="1.1"
          >
            {temperature}
          </Heading>
          {icon && (
            <Text color={colors.white} fontSize={{ base: "md", md: "lg" }}>
              {icon.label}
            </Text>
          )}
          {dewPoint && (
            <HStack justify="center" spacing={1} color={colors.white}>
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
                textShadow={`1px 1px ${colors.brand.ajBlueLvls["200"]}`}
              >
                Dew point {dewPoint}
              </Text>
            </HStack>
          )}
          {highLow && (
            <Text
              color={colors.whiteAlpha["900"]}
              fontSize={{ base: "sm", md: "md" }}
            >
              {highLow}
            </Text>
          )}
          <Text
            color={colors.whiteAlpha["900"]}
            fontSize={{ base: "sm", md: "md" }}
          >
            {updatedAt()}
          </Text>
        </Stack>
      </Center>
    </Flex>
  );
};

export default Hero;
