import {
  Box,
  Center,
  HStack,
  IconButton,
  Text,
} from "@chakra-ui/react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";

import { useWeatherContext } from "../context/WeatherContext";
import ThemedSpinner from "./ThemedSpinner";

// Public LibreWXR instance (https://librewxr.net) — a free, open-source,
// Rain Viewer-compatible radar tile API. No API key required. Self-hosting is
// possible (see their Docker docs) by swapping this for your own server URL.
const LIBREWXR_URL = "https://api.librewxr.net";
const RADAR_COLOR_SCHEME = 10; // Viper HD — high-res palette, clean default
const ANIMATION_DELAY_MS = 500;
const PAUSE_AT_END_MS = 1500;
const REFRESH_INTERVAL_MS = 5 * 60 * 1000;

interface RadarFrame {
  time: number;
  path: string;
}

interface WeatherMapsResponse {
  host: string;
  radar: {
    past: RadarFrame[];
    nowcast: RadarFrame[];
  };
}

const buildTileUrl = (host: string, frame: RadarFrame) =>
  `${host}${frame.path}/256/{z}/{x}/{y}/${RADAR_COLOR_SCHEME}/1_0.png`;

// Leaflet's raster layers aren't something react-leaflet models
// declaratively, so this imperatively swaps a single tile layer in as the
// current animation frame changes, cross-fading once the new tiles load.
const RadarTileLayer = ({
  host,
  frame,
}: {
  host: string;
  frame: RadarFrame | null;
}) => {
  const map = useMap();
  const layerRef = useRef<L.TileLayer | null>(null);

  useEffect(() => {
    if (!frame) return;

    const layer = L.tileLayer(buildTileUrl(host, frame), {
      tileSize: 256,
      opacity: 0.7,
      maxZoom: 12,
    }).addTo(map);

    const previous = layerRef.current;
    layerRef.current = layer;

    const removePrevious = () => {
      if (previous) map.removeLayer(previous);
    };

    if (previous) {
      layer.once("load", removePrevious);
    }

    return () => {
      layer.off("load", removePrevious);
      map.removeLayer(layer);
      removePrevious();
      if (layerRef.current === layer) layerRef.current = null;
    };
  }, [map, host, frame]);

  return null;
};

const RadarMap = () => {
  const { location, isLoading, error } = useWeatherContext();
  const [apiData, setApiData] = useState<WeatherMapsResponse | null>(null);
  const [position, setPosition] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [radarError, setRadarError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadRadarData = async () => {
      try {
        const response = await fetch(
          `${LIBREWXR_URL}/public/weather-maps.json`,
        );
        if (!response.ok) throw new Error("Radar data unavailable.");
        const data: WeatherMapsResponse = await response.json();
        if (cancelled) return;
        setApiData(data);
        setPosition(data.radar.past.length - 1);
        setRadarError(null);
      } catch {
        if (!cancelled) setRadarError("Radar data unavailable.");
      }
    };

    loadRadarData();
    const intervalId = setInterval(loadRadarData, REFRESH_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, []);

  const frames = useMemo(() => apiData?.radar.past ?? [], [apiData]);

  useEffect(() => {
    if (!isPlaying || frames.length === 0) return;

    const delay =
      position === frames.length - 1 ? PAUSE_AT_END_MS : ANIMATION_DELAY_MS;
    const timeoutId = setTimeout(() => {
      setPosition((prev) => (prev + 1) % frames.length);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [isPlaying, position, frames.length]);

  if (isLoading) {
    return (
      <Center minH="40vh">
        <ThemedSpinner />
      </Center>
    );
  }

  if (error || !location) {
    return (
      <Center minH="40vh">
        <Text opacity={0.7}>{error || "Location unavailable."}</Text>
      </Center>
    );
  }

  const currentFrame = frames[position] ?? null;
  const timestamp = currentFrame
    ? new Date(currentFrame.time * 1000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <Box
      h={{ base: "100%", md: "auto" }}
      maxW={{ base: "none", md: "50rem" }}
      mx="auto"
      py={{ base: 4, md: 8 }}
    >
      <Box
        position="relative"
        overflow="hidden"
        borderRadius="md"
        h={{ base: "100%", md: "auto" }}
        sx={{
          aspectRatio: { md: "4 / 3" },
          ".leaflet-tile": { imageRendering: "pixelated" },
        }}
      >
        <MapContainer
          center={[location.latitude, location.longitude]}
          zoom={8}
          maxZoom={12}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
          />
          {apiData && (
            <RadarTileLayer host={apiData.host} frame={currentFrame} />
          )}
        </MapContainer>

        {radarError && (
          <Box position="absolute" top={2} left={2} zIndex={1000}>
            <Text
              fontSize="xs"
              bg="blackAlpha.700"
              color="white"
              px={2}
              py={1}
              borderRadius="md"
            >
              {radarError}
            </Text>
          </Box>
        )}

        {frames.length > 0 && (
          <HStack
            position="absolute"
            bottom={2}
            left="50%"
            transform="translateX(-50%)"
            zIndex={1000}
            bg="blackAlpha.700"
            color="white"
            px={3}
            py={1}
            borderRadius="full"
            spacing={3}
          >
            <IconButton
              aria-label={
                isPlaying ? "Pause radar animation" : "Play radar animation"
              }
              icon={<Text as="span">{isPlaying ? "⏸" : "▶"}</Text>}
              size="xs"
              variant="ghost"
              color="white"
              _hover={{ bg: "whiteAlpha.300" }}
              onClick={() => setIsPlaying((prev) => !prev)}
            />
            <Text fontSize="xs">{timestamp}</Text>
          </HStack>
        )}
      </Box>

      <Text fontSize="xs" opacity={0.6} textAlign="center" mt={2}>
        Radar data via{" "}
        <a href="https://librewxr.net" target="_blank" rel="noreferrer">
          LibreWXR
        </a>
      </Text>
    </Box>
  );
};

export default RadarMap;
