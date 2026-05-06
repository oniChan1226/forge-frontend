import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  className?: string;
}

export const StatsCard = ({
  label,
  value,
  icon,
  className,
}: StatsCardProps) => {
  return (
    <Card className={cn("p-4 shadow-sm", className)}>
      <CardContent className="p-0 flex items-center justify-between">
        {/* Left side */}
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <h3 className="text-2xl font-semibold font-eb-garamond">{value}</h3>
        </div>

        {/* Icon */}
        {icon && (
          <div className="text-primary bg-primary/10 p-2 rounded-md">
            {icon}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
