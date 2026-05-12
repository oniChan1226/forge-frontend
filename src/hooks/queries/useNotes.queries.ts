import { NotesService } from "@/services/notes.service";
import { useQuery } from "@tanstack/react-query";

export const useGetNotesQuery = () => {
  return useQuery({
    queryKey: ["notes"],
    queryFn: NotesService.getNotes,
  });
};

export const useGetNoteByIdQuery = (id: string) => {
  return useQuery({
    queryKey: ["notes", id],
    queryFn: () => NotesService.getNoteById(id),
  });
};
