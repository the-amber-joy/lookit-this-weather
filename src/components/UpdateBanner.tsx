import { Box, Button, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { applyUpdate, subscribeToUpdateAvailable } from "../pwaUpdate";

/**
 * Fixed banner shown when a new service worker has installed and is waiting
 * to take over. Tapping "Update" applies it and reloads the page, instead of
 * the app silently updating (or failing to update) underneath the user.
 */
const UpdateBanner = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => subscribeToUpdateAvailable(setUpdateAvailable), []);

  if (!updateAvailable) return null;

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={20}
      display="flex"
      alignItems="center"
      justifyContent="center"
      gap={3}
      flexWrap="wrap"
      bg="brand.ajCheez"
      color="blackAlpha.900"
      px={4}
      py={2}
      pt="calc(env(safe-area-inset-top) + 0.5rem)"
      boxShadow="md"
    >
      <Text fontSize="sm" fontWeight="semibold">
        A new version is available.
      </Text>
      <Button
        size="sm"
        colorScheme="blackAlpha"
        onClick={applyUpdate}
        aria-label="Update to the latest version and reload"
      >
        Update
      </Button>
    </Box>
  );
};

export default UpdateBanner;
