import type { CreateUserNoteDTO } from "@/types/services/notes";
import { apiClient } from ".";

const BaseRoute = "/users/notes";

export const NotesService = {
  getNotes: async () => {
    const res = await apiClient.get(BaseRoute);
    return res.data;
  },

  createNote: async (data: CreateUserNoteDTO) => {
    const res = await apiClient.post(BaseRoute, data);
    return res.data;
  },

  getNoteById: async (id: string) => {
    const res = await apiClient.get(`${BaseRoute}/${id}`);
    return res.data;
  },

  updateNote: async (id: string, data: Partial<CreateUserNoteDTO>) => {
    const res = await apiClient.put(`${BaseRoute}/${id}`, data);
    return res.data;
  },

  deleteNote: async (id: string) => {
    const res = await apiClient.delete(`${BaseRoute}/${id}`);
    return res.data;
  },
};
