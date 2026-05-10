import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import * as motion from "motion/react-client";
import type { Todo } from "@/types/services/todo";

interface TaskCardProps {
  task: Todo;
  isOverlay?: boolean;
}

export default function TaskCard({ task, isOverlay = false }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id: task._id,
      disabled: isOverlay,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.div
      layout
      ref={isOverlay ? undefined : setNodeRef}
      {...(isOverlay ? {} : listeners)}
      {...(isOverlay ? {} : attributes)}
      style={isOverlay ? {} : style}
      whileHover={!isDragging && !isOverlay ? { y: -1 } : undefined}
      animate={{
        scale: isDragging ? 0.98 : 1,
        opacity: isDragging ? 0.5 : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 35,
      }}
      className={`
        rounded-sm border border-transparent hover:border-primary/20 bg-white/70 dark:bg-card p-3 text-card-foreground backdrop-blur-sm select-none will-change-transform
        ${
          isOverlay
            ? "shadow-xl cursor-grabbing"
            : "shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing"
        }
      `}
    >
      <div>
        <h6 className="text-sm font-medium">{task.title}</h6>
        {task.description && (
          <p className="text-xs text-neutral-500 mt-1 line-clamp-2">
            {task.description}
          </p>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-neutral-500">
        <span>Low priority</span>
        <span>Today</span>
      </div>
    </motion.div>
  );
}
