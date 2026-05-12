import { NotesService } from "@/services/notes.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type NotesResponse = unknown;

const extractNotesData = (response: NotesResponse) => {
  if (Array.isArray(response)) {
    return response as Array<Record<string, unknown>>;
  }

  if (response && typeof response === "object" && "data" in response) {
    const nested = (response as { data?: unknown }).data;

    if (Array.isArray(nested)) {
      return nested as Array<Record<string, unknown>>;
    }
  }

  return [] as Array<Record<string, unknown>>;
};

const patchNotesData = (
  current: NotesResponse,
  noteId: string,
  patch: Partial<Record<string, unknown>>,
) => {
  if (Array.isArray(current)) {
    return current.map((note) =>
      note && typeof note === "object" && "_id" in note && note._id === noteId
        ? { ...note, ...patch }
        : note,
    );
  }

  if (current && typeof current === "object" && "data" in current) {
    const nextData = extractNotesData(current).map((note) =>
      note._id === noteId ? { ...note, ...patch } : note,
    );

    return { ...(current as Record<string, unknown>), data: nextData };
  }

  return current;
};

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

      const previousNotes = queryClient.getQueryData(["notes"]);

      queryClient.setQueryData(["notes"], (current: NotesResponse) =>
        patchNotesData(current, id, {
          ...data,
          updatedAt: new Date().toISOString(),
        }),
      );

      return { previousNotes };
    },
    onError: (error, _variables, context) => {
      console.error("Failed to update note", error);
      if (context?.previousNotes !== undefined) {
        queryClient.setQueryData(["notes"], context.previousNotes);
      }
      toast.error("Failed to save note. Please try again.");
    },
    onSuccess: (response) => {
      if (!response) return;

      queryClient.setQueryData(["notes"], (current: NotesResponse) => {
        const currentNotes = extractNotesData(current);
        const nextNote =
          response && typeof response === "object" && "data" in response
            ? (response as { data?: Record<string, unknown> }).data
            : (response as Record<string, unknown>);

        if (!nextNote || !("_id" in nextNote)) {
          return current;
        }

        return currentNotes.map((note) =>
          note._id === nextNote._id ? nextNote : note,
        );
      });
    },
  });
};

export const useDeleteNoteMutation = () => {
  return useMutation({
    mutationFn: NotesService.deleteNote,
    onSuccess: async () => {
      toast.success("Note deleted successfully!");
    },
    onError: (error) => {
      console.error("Failed to delete note", error);
      toast.error("Failed to delete note. Please try again.");
    },
  });
};
