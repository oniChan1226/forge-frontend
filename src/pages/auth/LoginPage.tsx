import { Mail, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useLoginMutation } from "@/hooks/mutations/useAuth.mutations";
import { Link } from "react-router-dom";
import Loader from "@/utils/Loader";
import { OAuthButtons } from "@/components/auth/OAuthButtons";
import type { LoginDTO } from "@/types/services/auth";
import { loginSchema } from "@/schemas/auth/auth";

export const LoginPage = () => {
  const loginMutation = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDTO>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginDTO) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="flex items-center justify-center">
      <Card className="sm:w-md max-w-lg shadow-xl border-border/50">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-semibold">Welcome back</CardTitle>
          <p className="text-sm text-muted-foreground">
            Login to continue to your workspace
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-3">
            <OAuthButtons />

            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">
                or continue with email
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>

              <div className="relative">
                <Mail
                  className="absolute left-3 top-2.5 text-muted-foreground"
                  size={18}
                />

                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10"
                  {...register("email")}
                />
              </div>

              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>

              <div className="relative">
                <Lock
                  className="absolute left-3 top-2.5 text-muted-foreground"
                  size={18}
                />

                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  {...register("password")}
                />
              </div>

              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full flex items-center justify-center gap-2"
              disabled={loginMutation.isPending}
            >
              <Loader
                isLoading={loginMutation.isPending}
                loadingText="Signing in..."
                loadedText="Sign in to Workspace"
              />
            </Button>

            {/* API Error */}
            {loginMutation.isError && (
              <p className="text-sm text-destructive text-center">
                Invalid email or password
              </p>
            )}
          </form>

          <div className="text-center pt-2">
            <p className="text-sm text-muted-foreground">
              Don’t have an account?{" "}
              <Link
                to="/signup"
                className="text-primary font-medium hover:text-primary/80 transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
