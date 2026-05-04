import { useEffect } from "react";
import { BrowserRouter, useRoutes } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { appRoutes } from "./routes";
import { AppProviders } from "./providers/app-providers";

function AppRoutes() {
  return useRoutes(appRoutes);
}

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <AppProviders>
        <AppRoutes />
      </AppProviders>
    </BrowserRouter>
  );
}

export default App;
