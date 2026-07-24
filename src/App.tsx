import { ChakraProvider } from "@chakra-ui/react";
import { useMemo } from "react";

import Layout from "./components/Layout";
import { DayModePreferenceProvider } from "./context/DayModePreferenceContext";
import { ThemeNameProvider, useThemeName } from "./context/ThemeNameContext";
import { WeatherProvider } from "./context/WeatherContext";
import { getTheme } from "./theme/theme";

const ThemedApp = () => {
  const { themeName } = useThemeName();
  const theme = useMemo(() => getTheme(themeName), [themeName]);

  return (
    <ChakraProvider theme={theme}>
      <WeatherProvider>
        <Layout />
      </WeatherProvider>
    </ChakraProvider>
  );
};

const App = () => (
  <ThemeNameProvider>
    <DayModePreferenceProvider>
      <ThemedApp />
    </DayModePreferenceProvider>
  </ThemeNameProvider>
);

export default App;
