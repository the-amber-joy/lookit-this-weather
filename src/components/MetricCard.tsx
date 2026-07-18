import { ArrowUpIcon } from "@chakra-ui/icons";
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
  /** Wind direction in degrees (meteorological "from" convention). When set, renders a rotated arrow after the value showing the direction the wind is blowing toward. */
  windDirectionDegrees?: number;
}

const MetricCard = ({
  label,
  value,
  icon,
  detail,
  windDirectionDegrees,
}: MetricCardProps) => {
  const labelColor = useColorModeValue(
    "brand.ajBlueLvls.300",
    "brand.ajCheezLvls.700",
  );
  const iconColor = useColorModeValue("gray.800", "whiteAlpha.900");

  return (
    <Card shadow="md" borderRadius="1rem" minH={{ base: "5rem", md: "7rem" }}>
      <CardBody px={{ base: 3, md: 5 }} py={{ base: 2, md: 5 }}>
        <Flex align="center" gap={{ base: 3, md: 4 }}>
          <Box
            aria-hidden
            flexShrink={0}
            boxSize={{ base: "2rem", md: "2.75rem" }}
            color={iconColor}
            sx={{
              "& svg": { width: "100%", height: "100%", display: "block" },
            }}
            dangerouslySetInnerHTML={{ __html: icon }}
          />
          <Stat>
            <StatLabel
              color={labelColor}
              fontSize={{ base: "2xs", md: "sm" }}
              textTransform="uppercase"
              letterSpacing="wide"
            >
              {label}
            </StatLabel>
            <StatNumber
              as={Heading}
              fontSize={{ base: "md", md: "2xl" }}
              mt={1}
              display="flex"
              alignItems="center"
              gap={1}
            >
              {value}
              {windDirectionDegrees !== undefined && (
                <ArrowUpIcon
                  aria-hidden
                  boxSize={{ base: "0.7rem", md: "1rem" }}
                  transform={`rotate(${windDirectionDegrees + 180}deg)`}
                />
              )}
            </StatNumber>
            {detail && (
              <StatHelpText
                fontSize={{ base: "2xs", md: "sm" }}
                mb={0}
                mt={1}
                opacity={0.8}
              >
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
