import { Navigate } from "react-router-dom";

import { LoginPage } from "@/pages/auth/LoginPage";
import { SignupPage } from "@/pages/auth/SignupPage";
import { DashboardPage } from "@/pages/protected/DashboardPage";
import { AuthRoute } from "./AuthRoute";
import { DashboardRoute } from "./DashboardRoute";

export const appRoutes = [
  {
    path: "/login",
    element: (
      <AuthRoute>
        <LoginPage />
      </AuthRoute>
    ),
  },
  {
    path: "/signup",
    element: (
      <AuthRoute>
        <SignupPage />
      </AuthRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <DashboardRoute>
        <DashboardPage />
      </DashboardRoute>
    ),
  },
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: "*",
    element: <Navigate to="/dashboard" replace />,
  },
];
