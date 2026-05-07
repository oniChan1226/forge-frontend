import { Plus } from "lucide-react";
import TaskCard from "./TaskCard";
import { useDroppable } from "@dnd-kit/core";
import type { ColumnStatus } from "../view-config";

const statusStyles: Record<ColumnStatus, string> = {
  backlog: "bg-status-backlog/20 text-black dark:text-white",
  "in-progress": "bg-status-in-progress/20 text-status-in-progress",
  "in-review": "bg-status-in-review/20 text-status-in-review",
  done: "bg-status-done/20 text-status-done",
};

interface ColumnProps {
  status: ColumnStatus;
  tasks: any[];
}

export default function Column({ status, tasks }: ColumnProps) {
  const { setNodeRef } = useDroppable({
    id: status,
  });

  const handleAddTask = async () => {
    alert(`Add new task to ${status}`);
  };

  return (
    <div className="w-72 ">
      <div className="flex items-center justify-between mb-3">
        <div className="flex space-x-2 items-center">
          <h2 className="text-base font-semibold capitalize">{status}</h2>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-bold ${statusStyles[status]}`}
          >
            {tasks.length}
          </span>
        </div>
        <button
          className="cursor-pointer text-neutral-500 dark:text-inherit hover:text-primary transition-colors duration-300"
          onClick={handleAddTask}
        >
          <Plus size={18} />
        </button>
      </div>

      <div ref={setNodeRef} className="min-h-50 space-y-2">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}

        {tasks.length === 0 && (
          <div className="text-xs text-neutral-500 border border-dashed border-neutral-700 rounded-lg p-3 text-center">
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  );
}
