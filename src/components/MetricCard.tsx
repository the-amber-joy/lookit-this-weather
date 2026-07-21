import { ArrowUpIcon } from "@chakra-ui/icons";
import {
  Box,
  Card,
  CardBody,
  Flex,
  Heading,
  Stat,
  StatHelpText,
  StatNumber,
  useColorModeValue,
} from "@chakra-ui/react";

import { useFairycoreDayMode } from "../theme/fairycoreDayMode";

interface MetricCardProps {
  label: string;
  value: string;
  icon: string;
  detail?: string;
  /** Wind direction in degrees (meteorological "from" convention). When set, renders a rotated arrow after the value showing the direction the wind is blowing toward. */
  windDirectionDegrees?: number;
  /** Color of a small dot shown before the detail text, e.g. an AQI category color. */
  accentColor?: string;
}

const MetricCard = ({
  label,
  value,
  icon,
  detail,
  windDirectionDegrees,
  accentColor,
}: MetricCardProps) => {
  const defaultIconColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const dayMode = useFairycoreDayMode();

  // Fairycore's default dark navy card surface reads great against the
  // twilight-indigo night background, but clashes with the brighter
  // rose/moss daytime page background, so swap in a pastel surface (and
  // dark text/icons for contrast) then.
  const cardBg = dayMode.surfaceBg;
  const iconColor = dayMode.isFairycoreDay
    ? dayMode.textColor
    : defaultIconColor;
  const textColor = dayMode.isFairycoreDay ? dayMode.textColor : undefined;

  return (
    <Card shadow="card" borderRadius="1rem" h="100%" bg={cardBg}>
      <CardBody px={{ base: 4, md: 5 }} py={{ base: 3, md: 4 }}>
        <Flex align="center" gap={{ base: 3, md: 4 }}>
          <Box
            aria-hidden
            flexShrink={0}
            boxSize={{ base: "2.5rem", md: "2.75rem" }}
            color={iconColor}
            sx={{
              "& svg": { width: "100%", height: "100%", display: "block" },
            }}
            dangerouslySetInnerHTML={{ __html: icon }}
          />
          <Stat aria-label={label}>
            <StatNumber
              as={Heading}
              color={textColor}
              fontSize={{ base: "xl", md: "2xl" }}
              display="flex"
              alignItems="center"
              gap={1}
            >
              {value}
              {windDirectionDegrees !== undefined && (
                <ArrowUpIcon
                  aria-hidden
                  boxSize={{ base: "0.9rem", md: "1rem" }}
                  transform={`rotate(${windDirectionDegrees + 180}deg)`}
                />
              )}
            </StatNumber>
            {detail && (
              <StatHelpText
                color={textColor}
                fontSize={{ base: "sm", md: "sm" }}
                mb={0}
                mt={1}
                opacity={0.8}
                display="flex"
                alignItems="center"
                gap={1.5}
              >
                {accentColor && (
                  <Box
                    aria-hidden
                    boxSize="0.5rem"
                    borderRadius="full"
                    bg={accentColor}
                    flexShrink={0}
                  />
                )}
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
