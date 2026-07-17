import { ChakraProvider } from "@chakra-ui/react";

import Layout from "./components/Layout";
import { WeatherProvider } from "./context/WeatherContext";
import theme from "./theme/theme";

const App = () => (
  <ChakraProvider theme={theme}>
    <WeatherProvider>
      <Layout />
    </WeatherProvider>
  </ChakraProvider>
);

export default App;
