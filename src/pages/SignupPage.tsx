import { useState } from "react";
import { Mail, Lock, User, Code2, Globe } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

export const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: signup mutation here
    console.log({ name, email, password });
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
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>

              <div className="relative">
                <User
                  className="absolute left-3 top-2.5 text-muted-foreground"
                  size={18}
                />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className="pl-10"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
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
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
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
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full">
              Create account
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