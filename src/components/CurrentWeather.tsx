import { Flex } from "@chakra-ui/react";

import ComfortCard from "./ComfortCard";
import Controls from "./Controls";
import Hero from "./Hero";
import MetricGrid from "./MetricGrid";

const CurrentWeather = () => (
  <Flex
    minH="100%"
    paddingY={{ base: 1, md: 8 }}
    direction="column"
    align="center"
    justify="center"
    gap={{ base: 1, md: 8 }}
  >
    <ComfortCard />
    <Flex
      direction={{ base: "column", md: "row" }}
      align={{ base: "stretch", md: "center" }}
      justify="center"
      gap={{ base: 2, md: 6 }}
      w="100%"
    >
      <Hero />
      <MetricGrid />
    </Flex>
    <Controls />
  </Flex>
);

export default CurrentWeather;
