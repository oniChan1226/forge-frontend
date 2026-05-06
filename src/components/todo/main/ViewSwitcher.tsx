import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { List, LayoutGrid, CalendarDays, Flame } from "lucide-react";

const views = [
  { id: "list", name: "List", icon: List },
  { id: "board", name: "Board", icon: LayoutGrid },
  { id: "calendar", name: "Calendar", icon: CalendarDays },
  { id: "priority", name: "Priority", icon: Flame },
] as const;

export type ViewId = (typeof views)[number]["id"];

type Props = {
  value: ViewId;
  onChange: (view: ViewId) => void;
};

export const ViewSwitcher = ({ value, onChange }: Props) => {
  return (
    <div className="inline-flex items-center rounded-lg bg-accent p-1 relative">
      {views.map((view) => {
        const isActive = value === view.id;
        const Icon = view.icon;

        return (
          <button
            key={view.id}
            onClick={() => onChange(view.id)}
            className={cn(
              "relative z-10 flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium text-sm transition-colors",
              isActive
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {/* animated pill */}
            {isActive && (
              <motion.div
                layoutId="active-pill"
                className="absolute inset-0 rounded-md bg-background shadow-sm"
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                }}
              />
            )}

            <span className="relative flex items-center gap-1.5">
              <Icon size={14} />
              {view.name}
            </span>
          </button>
        );
      })}
    </div>
  );
};
