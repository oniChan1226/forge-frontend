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

import type { Todo } from "@/types/services/todo";

import { useGetTodosQuery } from "@/hooks/queries/useTodo.queries";
import { useMoveTodoMutation } from "@/hooks/mutations/useTodo.mutation";

export default function BoardView() {
  // Single source of truth
  const { data: tasks = [] } = useGetTodosQuery();

  const moveTodoMutation = useMoveTodoMutation();

  const [activeTask, setActiveTask] = useState<Todo | null>(null);

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

    const movedTask = tasks.find((t) => t._id === taskId);

    if (!movedTask) return;

    // prevent unnecessary mutation
    if (movedTask.status === newStatus) return;

    // tasks in destination column
    const targetTasks = tasks
      .filter((t) => t.status === newStatus)
      .sort((a, b) => a.position - b.position);

    // append to end
    const before = targetTasks[targetTasks.length - 1];

    const payload = {
      todoId: taskId,
      status: newStatus,
      beforeId: before?._id,
      afterId: undefined,
    };

    moveTodoMutation.mutate(payload);
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
  const handleDragCancel = (_event: DragCancelEvent) => {
    setActiveTask(null);
  };

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
