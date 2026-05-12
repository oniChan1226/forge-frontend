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
};
