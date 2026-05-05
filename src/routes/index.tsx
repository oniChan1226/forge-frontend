import { Navigate } from "react-router-dom";

import { LoginPage } from "@/pages/auth/LoginPage";
import { SignupPage } from "@/pages/auth/SignupPage";
import { DashboardPage } from "@/pages/protected/DashboardPage";
import { AuthRoute } from "./AuthRoute";
import { DashboardRoute } from "./DashboardRoute";
import { ROUTE_PATHS } from "./route-paths";
import TodoPage from "@/pages/protected/TodoPage";

export const appRoutes = [
  {
    path: ROUTE_PATHS.login,
    element: (
      <AuthRoute>
        <LoginPage />
      </AuthRoute>
    ),
  },
  {
    path: ROUTE_PATHS.signup,
    element: (
      <AuthRoute>
        <SignupPage />
      </AuthRoute>
    ),
  },
  {
    path: ROUTE_PATHS.dashboard,
    element: (
      <DashboardRoute>
        <DashboardPage />
      </DashboardRoute>
    ),
  },
  {
    path: ROUTE_PATHS.todos,
    element: (
      <DashboardRoute>
        <TodoPage />
      </DashboardRoute>
    ),
  },
  {
    path: "*",
    element: <Navigate to={ROUTE_PATHS.dashboard} replace />,
  },
];
