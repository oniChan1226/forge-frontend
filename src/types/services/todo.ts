import type { createTodoSchema } from "@/schemas/todo/todo";
import type z from "zod";

export type Todo = {
  _id: string;
  status: "backlog" | "in-progress" | "in-review" | "done";
  title: string;
  description?: string;
  priority: "low" | "medium" | "high" | "urgent";
  tags: string[];
  dueDate?: Date | null;
  isCompleted: boolean;
  completedAt?: Date | null;
  position: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateTodoDTO = z.infer<typeof createTodoSchema>;

export type MoveTodoDTO = {
  todoId: string;
  input: {
    status: string;
    beforeId?: string;
    afterId?: string;
  };
};

export type GetTodoQueryParams = {
  page?: number;
  limit?: number;
  status?: "backlog" | "in-progress" | "in-review" | "done";
  priority?: "low" | "medium" | "high" | "urgent";
  tags?: string[];
}