import type { CreateTodoDTO } from "@/types/services/todo";
import { apiClient } from ".";

export const TodoService = {
  getTodos: async () => {
    const res = await apiClient.get("/todos");
    return res.data;
  },

  createTodo: async (data: CreateTodoDTO) => {
    const res = await apiClient.post("/todos", data);
    return res.data;
  },

  getTodoById: async (id: string) => {
    const res = await apiClient.get(`/todos/${id}`);
    return res.data;
  },

  updateTodo: async (id: string, data: Partial<CreateTodoDTO>) => {
    const res = await apiClient.put(`/todos/${id}`, data);
    return res.data;
  },
};
