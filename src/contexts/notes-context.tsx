import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useAuth } from "@/hooks/custom/useAuth";
import {
  useCreateNoteMutation,
  useDeleteNoteMutation,
  useUpdateNoteMutation,
} from "@/hooks/mutations/useNotes.mutations";
import { useGetNotesQuery } from "@/hooks/queries/useNotes.queries";
import type { CreateUserNoteDTO, UserNotes } from "@/types/services/notes";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  extractNotesQueryItems,
  extractNotesQuerySummary,
  prependNoteToNotesQueryData,
  removeNoteFromNotesQueryData,
} from "@/utils/notes-query-cache";
import { useDebounce } from "@/utils/general";

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
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectNote: (id: string) => void;
  createNote: () => void;
  updateNote: (
    id: string,
    patch: Partial<
      Pick<NoteDocument, "title" | "content" | "contentText" | "contentJson">
    >,
  ) => Promise<void>;
  deleteNote: (id: string) => void;
  noteCount: number;
  hasMoreNotes: boolean;
  loadMoreNotes: () => void;
  isLoadingMoreNotes: boolean;
};

const EMPTY_EDITOR_DOC = {
  type: "doc",
  content: [{ type: "paragraph" }],
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
  lastOpenedAt: note.lastOpenedAt
    ? new Date(note.lastOpenedAt).toISOString()
    : null,
  createdAt: new Date(note.createdAt).toISOString(),
  updatedAt: new Date(note.updatedAt).toISOString(),
});

const createNewNotePayload = (
  userId: string,
  notes: NoteDocument[],
): CreateUserNoteDTO => {
  const suffix = notes.length + 1;
  const title = suffix === 1 ? "Untitled note" : `Untitled note ${suffix}`;

  return {
    user: userId,
    title,
    contentText: title,
    contentHtml: `<p>${title}</p>`,
    contentJson: {
      ...EMPTY_EDITOR_DOC,
      content: [
        { type: "paragraph", content: [{ type: "text", text: title }] },
      ],
    },
    tags: [],
    isPinned: false,
    isArchived: false,
    isDeleted: false,
    lastOpenedAt: new Date(),
  };
};

const NotesWorkspaceContext = createContext<NotesWorkspaceContextValue | null>(
  null,
);

const NOTES_PAGE_LIMIT = 20;

function useNotesWorkspaceController(): NotesWorkspaceContextValue {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);
  const notesQuery = useGetNotesQuery({
    search: debouncedSearchTerm,
    limit: NOTES_PAGE_LIMIT,
  });
  const createNoteMutation = useCreateNoteMutation();
  const updateNoteMutation = useUpdateNoteMutation();
  const deleteNoteMutation = useDeleteNoteMutation();
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  const rawNotes: UserNotes[] = useMemo(
    () => extractNotesQueryItems(notesQuery.data),
    [notesQuery.data],
  );
  const notes: NoteDocument[] = useMemo(() => rawNotes.map(mapApiNote), [rawNotes]);
  const validSelectedNoteIdRef = useRef<string | null>(null);
  const noteCount = useMemo(() => {
    const summary = extractNotesQuerySummary(notesQuery.data);
    return summary.total ?? notes.length;
  }, [notes.length, notesQuery.data]);

  const hasMoreNotes = Boolean(notesQuery.hasNextPage);
  const isLoadingMoreNotes = Boolean(notesQuery.isFetchingNextPage);
  const hasNextPage = notesQuery.hasNextPage;
  const isFetchingNextPage = notesQuery.isFetchingNextPage;
  const fetchNextPage = notesQuery.fetchNextPage;

  const loadMoreNotes = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) {
      return;
    }

    void fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    // Sync the ref with current state
    validSelectedNoteIdRef.current = selectedNoteId;
  }, [selectedNoteId]);

  useEffect(() => {
    const isCurrentIdValid =
      validSelectedNoteIdRef.current === null ||
      notes.some((note) => note.id === validSelectedNoteIdRef.current);

    if (!isCurrentIdValid || (notes.length > 0 && !validSelectedNoteIdRef.current)) {
      const nextId = notes.length > 0 ? notes[0]?.id ?? null : null;
      setSelectedNoteId(nextId);
    }
  }, [notes]);

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

        queryClient.setQueriesData({ queryKey: ["notes"] }, (current) =>
          prependNoteToNotesQueryData(current, created),
        );

        setSelectedNoteId(created._id);
      },
    });
  }, [createNoteMutation, notes, queryClient, user]);

  const updateNote = useCallback(
    async (
      id: string,
      patch: Partial<
        Pick<NoteDocument, "title" | "content" | "contentText" | "contentJson">
      >,
    ) => {
      const apiPatch: Partial<CreateUserNoteDTO> = {};

      if (patch.title !== undefined) {
        apiPatch.title = patch.title;
      }

      if (patch.content !== undefined) {
        const nextText =
          patch.contentText?.trim() ||
          htmlToPlainText(patch.content) ||
          patch.content;
        apiPatch.contentHtml = patch.content;
        apiPatch.contentText = nextText;
        apiPatch.contentJson = patch.contentJson ?? EMPTY_EDITOR_DOC;
      }

      await updateNoteMutation.mutateAsync({ id, data: apiPatch });
    },
    [updateNoteMutation],
  );

  const deleteNote = useCallback(
    (id: string) => {
      const nextSelectedId = (() => {
        const nextNotes = notes.filter((note) => note.id !== id);
        return selectedNoteId === id
          ? (nextNotes[0]?.id ?? null)
          : selectedNoteId;
      })();

      queryClient.setQueriesData({ queryKey: ["notes"] }, (current) =>
        removeNoteFromNotesQueryData(current, id),
      );

      setSelectedNoteId(nextSelectedId);
      deleteNoteMutation.mutate(id);
    },
    [deleteNoteMutation, notes, queryClient, selectedNoteId],
  );

  const selectedNote = notes.find((note) => note.id === selectedNoteId) ?? null;

  return useMemo(
    () => ({
      notes,
      selectedNoteId,
      selectedNote,
      searchTerm,
      setSearchTerm,
      selectNote,
      createNote,
      updateNote,
      deleteNote,
      noteCount,
      hasMoreNotes,
      loadMoreNotes,
      isLoadingMoreNotes,
    }),
    [
      notes,
      selectedNoteId,
      selectedNote,
      searchTerm,
      noteCount,
      hasMoreNotes,
      loadMoreNotes,
      isLoadingMoreNotes,
      selectNote,
      createNote,
      updateNote,
      deleteNote,
    ],
  );
}

export function NotesWorkspaceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
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
    throw new Error(
      "useNotesWorkspace must be used within NotesWorkspaceProvider",
    );
  }

  return context;
}
