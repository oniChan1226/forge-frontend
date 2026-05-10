import { useEffect, useState } from "react";
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
import type { Todo } from "@/types/services/todo";
import { useGetTodosQuery } from "@/hooks/queries/useTodo.queries";

export default function BoardView() {
  const { data } = useGetTodosQuery();
  const [tasks, setTasks] = useState<Todo[]>(data ?? []);
  const [activeTask, setActiveTask] = useState<Todo | null>(null);

  useEffect(() => {
    if (data) setTasks(data);
  }, [data]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t._id === event.active.id);
    setActiveTask(task ?? null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = String(active.id);
    const newStatus = over.id as Task["status"];

    const previous = tasks;

    // find moved task
    const movedTask = tasks.find((t) => t._id === taskId);
    if (!movedTask) return;

    // get target column tasks
    const targetTasks = tasks.filter((t) => t.status === newStatus);

    // NEW POSITION = append to end
    const newPosition =
      targetTasks.length > 0
        ? Math.max(...targetTasks.map((t) => t.position)) + 1
        : 0;

    // optimistic update
    setTasks((prev) =>
      prev.map((task) =>
        task._id === taskId
          ? { ...task, status: newStatus, position: newPosition }
          : task,
      ),
    );

    try {
      const targetColumnTasks = tasks
        .filter((t) => t.status === newStatus)
        .sort((a, b) => a.position - b.position);

      // find index of newly positioned task
      const updatedTasks = targetColumnTasks
        .map((t) =>
          t._id === taskId
            ? { ...t, status: newStatus, position: newPosition }
            : t,
        )
        .sort((a, b) => a.position - b.position);

      const index = updatedTasks.findIndex((t) => t._id === taskId);

      const before = updatedTasks[index - 1];
      const after = updatedTasks[index + 1];

      const payload = {
        todoId: taskId,
        status: newStatus,
        beforeId: before?._id,
        afterId: after?._id,
      };

      console.log("🚀 moveTodo payload:", payload);
    } catch (error: unknown) {
      setTasks(previous);
    }
  };

  const groupedTasks = columns.reduce(
    (acc, col) => {
      acc[col] = tasks
        .filter((t) => t.status === col)
        .sort((a, b) => a.position - b.position);

      return acc;
    },
    {} as Record<string, Todo[]>,
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDragCancel = (_event: DragCancelEvent) => setActiveTask(null);

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
            <Column key={col} status={col} tasks={groupedTasks[col]} />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} isOverlay /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
