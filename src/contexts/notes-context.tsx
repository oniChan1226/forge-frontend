import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { useAuth } from "@/hooks/custom/useAuth";
import { useCreateNoteMutation, useDeleteNoteMutation, useUpdateNoteMutation } from "@/hooks/mutations/useNotes.mutations";
import { useGetNotesQuery } from "@/hooks/queries/useNotes.queries";
import type { CreateUserNoteDTO, UserNotes } from "@/types/services/notes";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export type NoteDocument = {
  id: string;
  title: string;
  content: string;
  contentText: string;
  contentJson: unknown;
  tags: string[];
  isPinned: boolean;
  isArchived: boolean;
  isDeleted: boolean;
  lastOpenedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type NotesWorkspaceContextValue = {
  notes: NoteDocument[];
  selectedNoteId: string | null;
  selectedNote: NoteDocument | null;
  selectNote: (id: string) => void;
  createNote: () => void;
  updateNote: (
    id: string,
    patch: Partial<Pick<NoteDocument, "title" | "content" | "contentText" | "contentJson">>,
  ) => Promise<void>;
  deleteNote: (id: string) => void;
  noteCount: number;
};

const EMPTY_EDITOR_DOC = {
  type: "doc",
  content: [{ type: "paragraph" }],
};

const extractNotesData = (response: unknown): UserNotes[] => {
  if (Array.isArray(response)) {
    return response as UserNotes[];
  }

  if (response && typeof response === "object" && "data" in response) {
    const nested = (response as { data?: unknown }).data;

    if (Array.isArray(nested)) {
      return nested as UserNotes[];
    }
  }

  return [];
};

const extractSingleNote = (response: unknown): UserNotes | null => {
  if (!response) {
    return null;
  }

  if (response && typeof response === "object" && "data" in response) {
    const nested = (response as { data?: unknown }).data;
    if (nested && typeof nested === "object" && !Array.isArray(nested)) {
      return nested as UserNotes;
    }
  }

  if (response && typeof response === "object" && !Array.isArray(response)) {
    return response as UserNotes;
  }

  return null;
};

const htmlToPlainText = (html: string) => {
  if (typeof DOMParser === "undefined") {
    return html.replace(/<[^>]*>/g, "").trim();
  }

  const parser = new DOMParser();
  const document = parser.parseFromString(html, "text/html");
  return document.body.textContent?.trim() ?? "";
};

const mapApiNote = (note: UserNotes): NoteDocument => ({
  id: note._id,
  title: note.title,
  content: note.contentHtml,
  contentText: note.contentText,
  contentJson: note.contentJson,
  tags: note.tags,
  isPinned: note.isPinned,
  isArchived: note.isArchived,
  isDeleted: note.isDeleted,
  lastOpenedAt: note.lastOpenedAt ? new Date(note.lastOpenedAt).toISOString() : null,
  createdAt: new Date(note.createdAt).toISOString(),
  updatedAt: new Date(note.updatedAt).toISOString(),
});

const createNewNotePayload = (userId: string, notes: NoteDocument[]): CreateUserNoteDTO => {
  const suffix = notes.length + 1;
  const title = suffix === 1 ? "Untitled note" : `Untitled note ${suffix}`;

  return {
    user: userId,
    title,
    contentText: title,
    contentHtml: `<p>${title}</p>`,
    contentJson: {
      ...EMPTY_EDITOR_DOC,
      content: [{ type: "paragraph", content: [{ type: "text", text: title }] }],
    },
    tags: [],
    isPinned: false,
    isArchived: false,
    isDeleted: false,
    lastOpenedAt: new Date(),
  };
};

const NotesWorkspaceContext = createContext<NotesWorkspaceContextValue | null>(null);

function useNotesWorkspaceController(): NotesWorkspaceContextValue {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const notesQuery = useGetNotesQuery();
  const createNoteMutation = useCreateNoteMutation();
  const updateNoteMutation = useUpdateNoteMutation();
  const deleteNoteMutation = useDeleteNoteMutation();
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  const rawNotes = useMemo(() => extractNotesData(notesQuery.data), [notesQuery.data]);
  const notes = useMemo(() => rawNotes.map(mapApiNote), [rawNotes]);

  useEffect(() => {
    if (notes.length === 0) {
      setSelectedNoteId(null);
      return;
    }

    if (!selectedNoteId || !notes.some((note) => note.id === selectedNoteId)) {
      setSelectedNoteId(notes[0]?.id ?? null);
    }
  }, [notes, selectedNoteId]);

  const selectNote = useCallback((id: string) => setSelectedNoteId(id), []);

  const createNote = useCallback(() => {
    if (!user?._id) {
      toast.error("You need to be signed in to create notes.");
      return;
    }

    const payload = createNewNotePayload(user._id, notes);

    createNoteMutation.mutate(payload, {
      onSuccess: (response) => {
        const created = extractSingleNote(response);

        if (!created) {
          queryClient.invalidateQueries({ queryKey: ["notes"] });
          return;
        }

        queryClient.setQueryData(["notes"], (current: unknown) => {
          const currentNotes = extractNotesData(current);
          return [created, ...currentNotes.filter((note) => note._id !== created._id)];
        });

        setSelectedNoteId(created._id);
      },
    });
  }, [createNoteMutation, notes, queryClient, user?._id]);

  const updateNote = useCallback(async (
    id: string,
    patch: Partial<Pick<NoteDocument, "title" | "content" | "contentText" | "contentJson">>,
  ) => {
    const apiPatch: Partial<CreateUserNoteDTO> = {};

    if (patch.title !== undefined) {
      apiPatch.title = patch.title;
    }

    if (patch.content !== undefined) {
      const nextText = patch.contentText?.trim() || htmlToPlainText(patch.content) || patch.content;
      apiPatch.contentHtml = patch.content;
      apiPatch.contentText = nextText;
      apiPatch.contentJson = patch.contentJson ?? EMPTY_EDITOR_DOC;
    }

    await updateNoteMutation.mutateAsync({ id, data: apiPatch });
  }, [updateNoteMutation]);

  const deleteNote = useCallback((id: string) => {
    const nextSelectedId = (() => {
      const nextNotes = notes.filter((note) => note.id !== id);
      return selectedNoteId === id ? (nextNotes[0]?.id ?? null) : selectedNoteId;
    })();

    queryClient.setQueryData(["notes"], (current: unknown) => {
      const currentNotes = extractNotesData(current);
      return currentNotes.filter((note) => note._id !== id);
    });

    setSelectedNoteId(nextSelectedId);
    deleteNoteMutation.mutate(id);
  }, [deleteNoteMutation, notes, queryClient, selectedNoteId]);

  const selectedNote = notes.find((note) => note.id === selectedNoteId) ?? null;

  return useMemo(
    () => ({
      notes,
      selectedNoteId,
      selectedNote,
      selectNote,
      createNote,
      updateNote,
      deleteNote,
      noteCount: notes.length,
    }),
    [
      notes,
      selectedNoteId,
      selectedNote,
      selectNote,
      createNote,
      updateNote,
      deleteNote,
    ],
  );
}

export function NotesWorkspaceProvider({ children }: { children: React.ReactNode }) {
  const value = useNotesWorkspaceController();

  return (
    <NotesWorkspaceContext.Provider value={value}>
      {children}
    </NotesWorkspaceContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useNotesWorkspace(): NotesWorkspaceContextValue {
  const context = useContext(NotesWorkspaceContext);

  if (!context) {
    throw new Error("useNotesWorkspace must be used within NotesWorkspaceProvider");
  }

  return context;
}