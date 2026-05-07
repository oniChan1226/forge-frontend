import { useState } from "react";
import {
  DndContext,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";

import Column from "@/components/todo/views/boardview/Column";
import TaskCard from "@/components/todo/views/boardview/TaskCard";

const initialTasks = [
  { id: "1", title: "Setup auth", status: "backlog" },
  { id: "2", title: "Design UI", status: "todo" },
  { id: "3", title: "Fix bugs", status: "doing" },
  { id: "4", title: "Deploy app", status: "done" },
];

const columns = ["backlog", "todo", "doing", "done"];

export default function BoardView() {
  const [tasks, setTasks] = useState(initialTasks);
  const [activeTask, setActiveTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const handleDragStart = (event) => {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    setActiveTask(null);

    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const handleDragCancel = () => setActiveTask(null);

  return (
    <div className="h-screen w-full pt-6 md:pt-12">
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

        {/* 🔥 FLOATING DRAG PREVIEW */}
        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} isOverlay /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}