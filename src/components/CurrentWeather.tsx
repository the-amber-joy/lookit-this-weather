import { Box, Flex } from "@chakra-ui/react";

import ComfortCard from "./ComfortCard";
import Controls from "./Controls";
import Hero from "./Hero";
import MetricGrid from "./MetricGrid";

const CurrentWeather = () => (
  <Flex
    h={{ base: "100%", md: "auto" }}
    minH="100%"
    paddingY={{ base: 3, md: 8 }}
    direction="column"
    align="center"
    justify="center"
    gap={{ base: 3, md: 8 }}
  >
    <Box w="100%" maxW={{ base: "none", md: "46rem" }} mx="auto">
      <ComfortCard />
    </Box>
    <Flex
      direction={{ base: "column", md: "row" }}
      align={{ base: "stretch", md: "center" }}
      justify="center"
      gap={{ base: 4, md: 6 }}
      w="100%"
      maxW={{ base: "none", md: "46rem" }}
      mx="auto"
    >
      <Hero />
      <MetricGrid />
    </Flex>
    <Controls />
  </Flex>
);

export default CurrentWeather;
