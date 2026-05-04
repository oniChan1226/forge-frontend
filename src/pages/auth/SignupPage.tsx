import { Mail, Lock, User, Code2, Globe } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { useSignupMutation } from "@/hooks/mutations/useAuth.mutations";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "@/schemas/auth/auth";
import type { SignupDTO } from "@/types/services/auth";
import Loader from "@/utils/Loader";

export const SignupPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupDTO>({
    resolver: zodResolver(signupSchema),
  });

  const signupMutation = useSignupMutation();

  const onSubmit = (data: SignupDTO) => {
    signupMutation.mutate(data);
  };

  return (
    <div className="flex items-center justify-center">
      <Card className="sm:w-md max-w-lg shadow-xl border-border/50">
        {/* Header */}
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-semibold">
            Create account
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Start managing your workspace in seconds
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* OAuth */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:gap-2">
              <button className="w-full gap-2 flex items-center justify-center bg-muted py-2 rounded-sm cursor-pointer group">
                <Globe
                  size={18}
                  className="transition-transform duration-500 group-hover:rotate-180"
                />
                Google
              </button>

              <button className="w-full gap-2 flex items-center justify-center bg-muted py-2 rounded-sm cursor-pointer group">
                <Code2
                  size={18}
                  className="transition-transform duration-500 group-hover:rotate-180"
                />
                GitHub
              </button>
            </div>

            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">
                or create with email
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>

              <div className="relative">
                <User
                  className="absolute left-3 top-2.5 text-muted-foreground"
                  size={18}
                />
                <Input
                  {...register("name")}
                  placeholder="John Doe"
                  className="pl-10"
                />
                <p className="text-xs text-red-500">{errors.name?.message}</p>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>

              <div className="relative">
                <Mail
                  className="absolute left-3 top-2.5 text-muted-foreground"
                  size={18}
                />
                <Input
                  {...register("email")}
                  placeholder="you@example.com"
                  className="pl-10"
                />
                <p className="text-xs text-red-500">{errors.email?.message}</p>
              </div>
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
                  {...register("password")}
                  type="password"
                  className="pl-10"
                />
                <p className="text-xs text-red-500">
                  {errors.password?.message}
                </p>
              </div>
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full">
              <Loader
                isLoading={signupMutation.isPending}
                loadingText="Creating account..."
                loadedText="Create account"
              />
            </Button>
          </form>

          {/* Footer */}
          <div className="text-center pt-2">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary font-medium hover:text-primary/80 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupPage;
