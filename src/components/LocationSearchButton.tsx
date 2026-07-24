import { CloseIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  IconButton,
  Input,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

import { searchLocations } from "../api/searchLocation";
import { Location } from "../api/types";
import { useLocationPreference } from "../context/LocationPreferenceContext";

const SEARCH_DEBOUNCE_MS = 350;

interface LocationSearchButtonProps {
  color?: string;
}

const LocationSearchButton = ({ color }: LocationSearchButtonProps) => {
  const {
    isSearchOpen: isOpen,
    openSearch: onOpen,
    closeSearch: onClose,
    recentLocations,
    selectLocation,
    selectCurrentLocation,
    removeRecentLocation,
  } = useLocationPreference();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Location[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!isOpen) return;

    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setSearchError(null);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    debounceRef.current = setTimeout(() => {
      searchLocations(trimmed)
        .then((nextResults) => {
          setResults(nextResults);
          setSearchError(
            nextResults.length === 0 ? "No matching locations found." : null,
          );
        })
        .catch(() => {
          setResults([]);
          setSearchError("Location search failed. Please try again.");
        })
        .finally(() => setIsSearching(false));
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(debounceRef.current);
  }, [query, isOpen]);

  const handleClose = () => {
    setQuery("");
    setResults([]);
    setSearchError(null);
    onClose();
  };

  const handleSelect = (location: Location) => {
    selectLocation(location);
    handleClose();
  };

  const handleUseCurrentLocation = () => {
    selectCurrentLocation();
    handleClose();
  };

  return (
    <>
      <IconButton
        aria-label="Search for a location"
        icon={<SearchIcon />}
        onClick={onOpen}
        position="absolute"
        top={3}
        left={3}
        size="sm"
        variant="ghost"
        color={color}
        _hover={{ bg: "whiteAlpha.300" }}
      />

      <Modal isOpen={isOpen} onClose={handleClose} isCentered>
        <ModalOverlay />
        <ModalContent mx={4}>
          <ModalHeader>Change location</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Stack spacing={4}>
              <Input
                placeholder="City name or zip code"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                autoFocus
                autoComplete="off"
                data-1p-ignore
                data-lpignore="true"
                data-bwignore
              />

              <Button variant="outline" onClick={handleUseCurrentLocation}>
                Use current location
              </Button>

              {isSearching && (
                <Stack align="center" py={2}>
                  <Spinner size="sm" />
                </Stack>
              )}

              {searchError && !isSearching && (
                <Text fontSize="sm" opacity={0.7}>
                  {searchError}
                </Text>
              )}

              {results.length > 0 && (
                <List spacing={1}>
                  {results.map((result, index) => (
                    <ListItem
                      key={`${result.latitude}-${result.longitude}-${index}`}
                    >
                      <Button
                        variant="ghost"
                        w="100%"
                        justifyContent="flex-start"
                        onClick={() => handleSelect(result)}
                      >
                        {result.name}
                      </Button>
                    </ListItem>
                  ))}
                </List>
              )}

              {!query && recentLocations.length > 0 && (
                <Box>
                  <Text fontSize="xs" fontWeight="bold" opacity={0.7} mb={1}>
                    Recent
                  </Text>
                  <List spacing={1}>
                    {recentLocations.map((location, index) => (
                      <ListItem
                        key={`${location.latitude}-${location.longitude}-${index}`}
                      >
                        <Stack direction="row" spacing={1} align="center">
                          <Button
                            variant="ghost"
                            flex={1}
                            justifyContent="flex-start"
                            onClick={() => handleSelect(location)}
                          >
                            {location.name}
                          </Button>
                          <IconButton
                            aria-label={`Remove ${location.name} from recent locations`}
                            icon={<CloseIcon boxSize={2.5} />}
                            size="sm"
                            variant="ghost"
                            onClick={() => removeRecentLocation(location)}
                          />
                        </Stack>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default LocationSearchButton;
