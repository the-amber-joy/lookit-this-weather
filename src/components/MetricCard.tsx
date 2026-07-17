import {
  Box,
  Card,
  CardBody,
  Flex,
  Heading,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  useColorModeValue,
} from "@chakra-ui/react";

interface MetricCardProps {
  label: string;
  value: string;
  icon: string;
  detail?: string;
}

const MetricCard = ({ label, value, icon, detail }: MetricCardProps) => {
  const labelColor = useColorModeValue(
    "brand.ajBlueLvls.300",
    "brand.ajCheezLvls.700",
  );
  const iconColor = useColorModeValue("gray.800", "whiteAlpha.900");

  return (
    <Card shadow="md" borderRadius="1rem" minH="7rem">
      <CardBody>
        <Flex align="center" gap={4}>
          <Box
            aria-hidden
            flexShrink={0}
            boxSize="2.75rem"
            color={iconColor}
            sx={{
              "& svg": { width: "100%", height: "100%", display: "block" },
            }}
            dangerouslySetInnerHTML={{ __html: icon }}
          />
          <Stat>
            <StatLabel
              color={labelColor}
              fontSize="sm"
              textTransform="uppercase"
              letterSpacing="wide"
            >
              {label}
            </StatLabel>
            <StatNumber as={Heading} size="lg" mt={1}>
              {value}
            </StatNumber>
            {detail && (
              <StatHelpText mb={0} mt={1} opacity={0.8}>
                {detail}
              </StatHelpText>
            )}
          </Stat>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default MetricCard;
