import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TooltipProps {
  tip: string;
  children: React.ReactNode;
}

export function TooltipWrapper({ tip, children }: TooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {children}
      </TooltipTrigger>
      <TooltipContent className="font-sans">{tip}</TooltipContent>
    </Tooltip>
  );
}
