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
import { arrayMove } from "@dnd-kit/sortable";

import Column from "@/components/todo/views/boardview/Column";
import TaskCard from "@/components/todo/views/boardview/TaskCard";

import { columns, type ColumnStatus } from "../view-config";

import type { Todo } from "@/types/services/todo";

import { useGetTodosQuery } from "@/hooks/queries/useTodo.queries";

export default function BoardView() {
  const { data: tasks = [] } = useGetTodosQuery();
  const [localTasks, setLocalTasks] = useState<Todo[] | null>(null);
  const boardTasks = localTasks ?? tasks;

  const [activeTask, setActiveTask] = useState<Todo | null>(null);

  const isColumnId = (value: string): value is ColumnStatus => {
    return columns.includes(value as ColumnStatus);
  };

  const groupByColumn = (items: Todo[]) => {
    return columns.reduce(
      (acc, col) => {
        acc[col] = items
          .filter((task) => task.status === col)
          .sort((a, b) => a.position - b.position);

        return acc;
      },
      {} as Record<ColumnStatus, Todo[]>,
    );
  };

  const flattenColumns = (grouped: Record<ColumnStatus, Todo[]>) => {
    return columns.flatMap((col) =>
      grouped[col].map((task, index) => ({
        ...task,
        position: index,
      })),
    );
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const task = boardTasks.find((t) => t._id === event.active.id);

    setActiveTask(task ?? null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveTask(null);

    if (!over) return;

    const taskId = String(active.id);

    setLocalTasks((prev) => {
      const sourceTasks = prev ?? tasks;
      const activeItem = sourceTasks.find((task) => task._id === taskId);
      if (!activeItem) return prev;

      const grouped = groupByColumn(sourceTasks);
      const sourceColumn = activeItem.status as ColumnStatus;
      const sourceItems = [...grouped[sourceColumn]];
      const sourceIndex = sourceItems.findIndex((task) => task._id === taskId);

      if (sourceIndex === -1) return prev;

      const overId = String(over.id);
      const isOverColumn = isColumnId(overId);
      const overItem = sourceTasks.find((task) => task._id === overId);
      const destinationColumn = isOverColumn
        ? overId
        : (overItem?.status as ColumnStatus | undefined);

      if (!destinationColumn) return sourceTasks;

      if (destinationColumn === sourceColumn) {
        const targetIndex = isOverColumn
          ? sourceItems.length - 1
          : sourceItems.findIndex((task) => task._id === overId);

        if (targetIndex < 0 || targetIndex === sourceIndex) return sourceTasks;

        grouped[sourceColumn] = arrayMove(sourceItems, sourceIndex, targetIndex);
        return flattenColumns(grouped);
      }

      const [movedItem] = sourceItems.splice(sourceIndex, 1);
      if (!movedItem) return sourceTasks;

      const destinationItems = [...grouped[destinationColumn]];
      const insertIndex = isOverColumn
        ? destinationItems.length
        : destinationItems.findIndex((task) => task._id === overId);

      destinationItems.splice(
        insertIndex >= 0 ? insertIndex : destinationItems.length,
        0,
        {
          ...movedItem,
          status: destinationColumn,
        },
      );

      grouped[sourceColumn] = sourceItems;
      grouped[destinationColumn] = destinationItems;

      return flattenColumns(grouped);
    });
  };

  const groupedTasks = groupByColumn(boardTasks);

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
