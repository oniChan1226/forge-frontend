import type { CreateTodoDTO, GetTodoQueryParams, MoveTodoDTO } from "@/types/services/todo";
import { apiClient } from ".";

const BaseRoute = "/users/todos";

export const TodoService = {
  getTodos: async (params?: GetTodoQueryParams) => {
    const res = await apiClient.get(`${BaseRoute}/`, { params });
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

  deleteTodo: async (id: string) => {
    const res = await apiClient.delete(`${BaseRoute}/${id}`);
    return res.data;
  },

  moveTodo: async (payload: MoveTodoDTO) => {
    const res = await apiClient.post(`${BaseRoute}/${payload.todoId}/move`, payload);
    return res.data;
  },
};
