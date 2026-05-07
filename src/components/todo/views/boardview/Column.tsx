import TaskCard from "./TaskCard";
import { useDroppable } from "@dnd-kit/core";

export default function Column({ status, tasks }) {
  const { setNodeRef } = useDroppable({
    id: status,
  });

  return (
    <div className="w-72 ">
      <div className="flex justify-between mb-3">
        <h2 className="text-sm font-medium capitalize">{status}</h2>
        <span className="text-xs text-neutral-400">{tasks.length}</span>
      </div>

      <div ref={setNodeRef} className="min-h-[200px] space-y-2">
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