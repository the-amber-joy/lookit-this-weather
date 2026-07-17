import { Container, Flex } from "@chakra-ui/react";

import ComfortCard from "./ComfortCard";
import Controls from "./Controls";
import Hero from "./Hero";
import MetricGrid from "./MetricGrid";

const Layout = () => (
  <Container maxWidth="1280px">
    <Flex
      minH="100dvh"
      paddingY={{ base: 4, md: 12 }}
      direction="column"
      align="center"
      justify="center"
      gap={{ base: 4, md: 8 }}
    >
      <ComfortCard />
      <Flex
        direction={{ base: "column", md: "row" }}
        align={{ base: "stretch", md: "center" }}
        justify="center"
        gap={{ base: 4, md: 6 }}
        w="100%"
      >
        <Hero />
        <MetricGrid />
      </Flex>
      <Controls />
    </Flex>
  </Container>
);

export default Layout;
