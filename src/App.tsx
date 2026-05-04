import { BrowserRouter, useRoutes } from "react-router-dom";
import { appRoutes } from "./routes";
import { AppProviders } from "./providers/app-providers";
import { Toaster } from "sonner";

function AppRoutes() {
  return useRoutes(appRoutes);
}

function App() {
  return (
    <BrowserRouter>
      <AppProviders>
        <AppRoutes />
      </AppProviders>
      <Toaster position="top-right" richColors expand closeButton />
    </BrowserRouter>
  );
}

export default App;
