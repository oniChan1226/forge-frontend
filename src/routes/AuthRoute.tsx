import { PublicRoute } from "@/components/ProtectedRoute";
import { AuthLayout } from "@/layouts/AuthLayout";

export const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  return (
    <PublicRoute>
      <AuthLayout>{children}</AuthLayout>
    </PublicRoute>
  );
};
