import { Center, Heading, Stack, Text } from "@chakra-ui/react";

const ComingSoon = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <Center minH="40vh" paddingY={{ base: 8, md: 12 }}>
    <Stack spacing={2} textAlign="center" maxW="30rem">
      <Heading size="lg">{title}</Heading>
      <Text opacity={0.7}>{description}</Text>
    </Stack>
  </Center>
);

export default ComingSoon;
