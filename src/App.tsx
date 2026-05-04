
import { BrowserRouter, useRoutes } from "react-router-dom";
import { appRoutes } from "./routes";
import { AppProviders } from "./providers/app-providers";

function AppRoutes() {
  return useRoutes(appRoutes);
}

function App() {

  return (
    <BrowserRouter>
      <AppProviders>
        <AppRoutes />
      </AppProviders>
    </BrowserRouter>
  );
}

export default App;
