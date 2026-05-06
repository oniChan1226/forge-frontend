import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import * as motion from "motion/react-client";

export default function TaskCard({ task, isOverlay = false }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
      disabled: isOverlay, // important fix
    });

  const style = {
    transform: CSS.Transform.toString(transform),
  };

  return (
    <motion.div
      ref={isOverlay ? undefined : setNodeRef}
      {...(isOverlay ? {} : listeners)}
      {...(isOverlay ? {} : attributes)}
      style={isOverlay ? {} : style}
      className={`p-3 rounded-lg border bg-neutral-800 border-neutral-700 ${
        isOverlay ? "cursor-grabbing shadow-xl" : "cursor-grab active:cursor-grabbing"
      }`}
      animate={
        isOverlay
          ? { scale: 1.05 }
          : {
              scale: isDragging ? 0.95 : 1,
              opacity: isDragging ? 0.4 : 1,
            }
      }
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    >
      <p className="text-sm">{task.title}</p>

      <div className="flex justify-between mt-2 text-xs text-neutral-500">
        <span>Low priority</span>
        <span>Today</span>
      </div>
    </motion.div>
  );
}