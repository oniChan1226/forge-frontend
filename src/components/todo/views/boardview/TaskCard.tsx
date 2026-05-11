import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import * as motion from "motion/react-client";
import { useState } from "react";
import type { Todo } from "@/types/services/todo";
import { Badge } from "@/components/ui/badge";
import { priorityBadgeStyles, priorityOptionsMap } from "../view-config";
import { MoreHorizontal, Edit, Trash, Clock } from "lucide-react";
import { TooltipWrapper } from "@/components/generic/TooltipWrapper";
import { ConfirmActionModal } from "@/components/generic/ConfirmActionModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDueDate } from "@/utils/helpers";
import { useDeleteTodoMutation } from "@/hooks/mutations/useTodo.mutation";
import { useTodoModal } from "@/contexts/todo-modal-context";

interface TaskCardProps {
  task: Todo;
  isOverlay?: boolean;
}

export default function TaskCard({ task, isOverlay = false }: TaskCardProps) {
  const { openEditModal } = useTodoModal();
  const deleteTodoMutation = useDeleteTodoMutation();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
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
      // whileHover={!isDragging && !isOverlay ? { y: -1 } : undefined}
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
      <div className="flex items-center justify-between">
        <Badge
          variant="secondary"
          className={`capitalize text-xs mb-2 rounded-xs ${priorityBadgeStyles[task.priority]}`}
        >
          ! {priorityOptionsMap[task.priority]}
        </Badge>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              className="rounded-sm p-1 hover:bg-muted transition-colors"
            >
              <span className="sr-only">Open menu</span>
              <MoreHorizontal size={16} className="text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="start"
            className="rounded-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                openEditModal(task);
              }}
              className="text-sm"
            >
              <Edit className="mr-1" size={5} />
              Edit
            </DropdownMenuItem>

            <DropdownMenuItem
              variant="destructive"
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteConfirm(true);
              }}
              className="text-sm"
            >
              <Trash className="mr-1" color="red" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div>
        <h6 className="text-sm text-foreground font-medium max-w-xs truncate">
          {task.title}
        </h6>
        {task.description && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {task.description}
          </p>
        )}
      </div>

      <div className="mt-3 flex items-center justify-end">
        {task?.tags && task?.tags?.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap justify-end">
            {task.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center max-w-30 truncate overflow-hidden whitespace-nowrap rounded-sm bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary/80 transition-colors hover:bg-primary/15"
              >
                @{tag}
              </span>
            ))}

            {task.tags.length > 2 && (
              <TooltipWrapper
                tip={task.tags
                  .slice(2)
                  .map((t) => `@${t}`)
                  .join(" ")}
              >
                <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground cursor-default">
                  +{task.tags.length - 2} more
                </span>
              </TooltipWrapper>
            )}
          </div>
        )}
      </div>

      <div className="mt-2">
        {task.dueDate && (
          <TooltipWrapper tip={formatDueDate(task.dueDate).human}>
            <div className="flex items-center gap-1 text-xs text-muted-foreground cursor-default">
              <Clock className="h-3.5 w-3.5" />
              <span>{formatDueDate(task.dueDate).relative}</span>
            </div>
          </TooltipWrapper>
        )}
      </div>

      <ConfirmActionModal
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Delete this todo?"
        description="This action cannot be undone and will permanently remove this task."
        confirmLabel="Delete"
        onConfirm={async () => {
          await deleteTodoMutation.mutateAsync(task._id);
          setShowDeleteConfirm(false);
        }}
        isConfirming={deleteTodoMutation.isPending}
      />
    </motion.div>
  );
}
