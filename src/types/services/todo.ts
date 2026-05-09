import type { createTodoSchema } from "@/schemas/todo/todo";
import type z from "zod";

export type Todo = z.infer<typeof createTodoSchema> & {
  _id: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateTodoDTO = z.infer<typeof createTodoSchema>;