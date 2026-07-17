import { Stack, Text } from "@chakra-ui/react";

import { useWeatherContext } from "../context/WeatherContext";

const Controls = () => {
  const { status } = useWeatherContext();

  if (!status) return null;

  return (
    <Stack align="center" spacing={2}>
      <Text fontSize="sm" opacity={0.8}>
        {status}
      </Text>
    </Stack>
  );
};

export default Controls;
