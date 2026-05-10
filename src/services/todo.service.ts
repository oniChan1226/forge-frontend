import type { CreateTodoDTO } from "@/types/services/todo";
import { apiClient } from ".";

const BaseRoute = "/users/todos";

export const TodoService = {
  getTodos: async () => {
    const res = await apiClient.get(`${BaseRoute}/`);
    return res.data;
  },

  createTodo: async (data: CreateTodoDTO) => {
    const res = await apiClient.post(`${BaseRoute}/`, data);
    return res.data;
  },

  getTodoById: async (id: string) => {
    const res = await apiClient.get(`${BaseRoute}/${id}`);
    return res.data;
  },

  updateTodo: async (id: string, data: Partial<CreateTodoDTO>) => {
    const res = await apiClient.put(`${BaseRoute}/${id}`, data);
    return res.data;
  },
};
