import { NotesService } from "@/services/notes.service";
import { patchNotesQueryData, removeNoteFromNotesQueryData } from "@/utils/notes-query-cache";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreateNoteMutation = () => {
  return useMutation({
    mutationFn: (data: Parameters<typeof NotesService.createNote>[0]) => {
      const trimmedData = {
        ...data,
        title: data.title?.trim() || "",
        contentText: data.contentText?.trim() || "",
      };
      return NotesService.createNote(trimmedData);
    },
    onSuccess: () => {
      toast.success("Note created successfully!");
    },
    onError: (error) => {
      console.error("Failed to create note", error);
      toast.error("Failed to create note. Please try again.");
    },
  });
};

export const useUpdateNoteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Parameters<typeof NotesService.updateNote>[1];
    }) => {
      const trimmedData = {
        ...data,
        title: data.title?.trim(),
        contentText: data.contentText?.trim(),
      };
      return NotesService.updateNote(id, trimmedData);
    },
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ["notes"] });

      const previousNotes = queryClient.getQueriesData({ queryKey: ["notes"] });

      queryClient.setQueriesData({ queryKey: ["notes"] }, (current) =>
        patchNotesQueryData(current, id, {
          ...data,
          updatedAt: new Date().toISOString(),
        }),
      );

      return { previousNotes };
    },
    onError: (error, _variables, context) => {
      console.error("Failed to update note", error);
      if (context?.previousNotes !== undefined) {
        for (const [queryKey, queryData] of context.previousNotes) {
          queryClient.setQueryData(queryKey, queryData);
        }
      }
      toast.error("Failed to save note. Please try again.");
    },
    onSuccess: (response) => {
      if (!response) return;

      const nextNoteId =
        response && typeof response === "object" && "data" in response
          ? (response as { data?: { _id?: string } }).data?._id
          : (response as { _id?: string })._id;

      if (!nextNoteId) {
        return;
      }

      queryClient.setQueriesData({ queryKey: ["notes"] }, (current) =>
        patchNotesQueryData(current, nextNoteId, response as Record<string, unknown>),
      );
    },
  });
};

export const useDeleteNoteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: NotesService.deleteNote,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["notes"] });
      const previousNotes = queryClient.getQueriesData({ queryKey: ["notes"] });

      queryClient.setQueriesData({ queryKey: ["notes"] }, (current) =>
        removeNoteFromNotesQueryData(current, id),
      );

      return { previousNotes };
    },
    onError: (error, _variables, context) => {
      console.error("Failed to delete note", error);
      if (context?.previousNotes !== undefined) {
        for (const [queryKey, queryData] of context.previousNotes) {
          queryClient.setQueryData(queryKey, queryData);
        }
      }
      toast.error("Failed to delete note. Please try again.");
    },
    onSuccess: async () => {
      toast.success("Note deleted successfully!");
    },
  });
};
