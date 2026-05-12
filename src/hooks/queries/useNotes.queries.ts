import { NotesService } from "@/services/notes.service";
import { useQuery } from "node_modules/@tanstack/react-query/build/modern/_tsup-dts-rollup";

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
