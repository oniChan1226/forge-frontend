import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface LoaderProps {
  title?: string;
  subtitle?: string;
  progress?: number;
}

export const Loader = ({
  title = "Loading...",
  subtitle,
  progress,
}: LoaderProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-xl overflow-hidden">

      {/* 🌟 Glow Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 h-125 w-125 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[120px] animate-pulse" />
        <div className="absolute top-1/3 left-1/3 h-100 w-100 rounded-full bg-indigo-400/10 blur-[140px]" />
      </div>

      {/* Loader Card */}
      <Card className="relative w-[340px] shadow-xl border-muted/40 bg-card/90 backdrop-blur-md">

        <CardHeader className="flex flex-col items-center gap-3">
          <div className="relative">
            <Loader2 className="h-9 w-9 animate-spin text-primary" />
            <div className="absolute inset-0 blur-xl bg-primary/20 rounded-full" />
          </div>

          <div className="text-center space-y-1">
            <h2 className="text-sm font-medium">{title}</h2>

            {subtitle && (
              <p className="text-xs text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>
        </CardHeader>

        {typeof progress === "number" && (
          <CardContent className="pb-6 space-y-2">
            <Progress value={progress} className="h-1.5" />
          </CardContent>
        )}
      </Card>
    </div>
  );
};