import { useState } from "react";
import {
  DndContext,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragStartEvent,
  type DragEndEvent,
  type DragCancelEvent,
} from "@dnd-kit/core";

import Column from "@/components/todo/views/boardview/Column";
import TaskCard from "@/components/todo/views/boardview/TaskCard";
import { columns, type Task } from "../view-config";

const initialTasks: Task[] = [
  { id: "1", title: "Setup auth", status: "backlog" },
  { id: "2", title: "Design UI", status: "in-progress" },
  { id: "3", title: "Fix bugs", status: "in-review" },
  { id: "4", title: "Deploy app", status: "done" },
];

export default function BoardView() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task ?? null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveTask(null);

    if (!over) return;

    const taskId = String(active.id);
    const newStatus = over.id as Task["status"];

    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, status: newStatus }
          : task,
      ),
    );
  };

  const handleDragCancel = (_event: DragCancelEvent) =>
    setActiveTask(null);

  return (
    <div className="w-full pt-6 md:pt-12">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="flex gap-4 overflow-x-auto">
          {columns.map((col) => (
            <Column
              key={col}
              status={col}
              tasks={tasks.filter((t) => t.status === col)}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? (
            <TaskCard task={activeTask} isOverlay />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}