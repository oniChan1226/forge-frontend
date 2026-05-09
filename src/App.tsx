import { BrowserRouter, useRoutes } from "react-router-dom";
import { appRoutes } from "./routes";
import { AppProviders } from "./providers/app-providers";
import { Toaster } from "sonner";
import { TooltipProvider } from "./components/ui/tooltip";


function AppRoutes() {
  return useRoutes(appRoutes);
}

function App() {
  return (
    <BrowserRouter>
      <AppProviders>
        <TooltipProvider>
          <AppRoutes />
        </TooltipProvider>
      </AppProviders>
      <Toaster position="top-right" richColors />
    </BrowserRouter>
  );
}

export default App;
