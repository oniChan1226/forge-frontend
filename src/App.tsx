import { useEffect } from "react";
import { BrowserRouter, useRoutes } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { appRoutes } from "./routes";
import "./App.css";

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
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
