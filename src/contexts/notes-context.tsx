import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type NoteDocument = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

type NotesWorkspaceContextValue = {
  notes: NoteDocument[];
  selectedNoteId: string | null;
  selectedNote: NoteDocument | null;
  selectNote: (id: string) => void;
  createNote: () => NoteDocument;
  updateNote: (id: string, patch: Partial<Pick<NoteDocument, "title" | "content">>) => void;
  deleteNote: (id: string) => void;
  noteCount: number;
};

const STORAGE_KEY = "forge.notes.documents";

const createInitialNotes = (): NoteDocument[] => {
  const now = new Date().toISOString();

  return [
    {
      id: "note-1",
      title: "Product brief",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Similique nostrum eaque cumque quo quod, quaerat consequatur doloribus placeat inventore necessitatibus vero. Illum illo, commodi, eos iusto consectetur distinctio officia, quis quae molestias nobis exercitationem rem officiis nam! Repudiandae facere cum sunt laudantium quis iure nesciunt.",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "note-2",
      title: "Meeting recap",
      content:
        "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.</p><blockquote><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p></blockquote><p>Action items: follow up, review, and ship.</p>",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "note-3",
      title: "Ideas backlog",
      content:
        "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sodales ligula in libero.</p><ol><li>Draft the outline</li><li>Add references</li><li>Polish the final copy</li></ol>",
      createdAt: now,
      updatedAt: now,
    },
  ];
};

const loadInitialState = () => {
  if (typeof window === "undefined") {
    const notes = createInitialNotes();
    return {
      notes,
      selectedNoteId: notes[0]?.id ?? null,
    };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (raw) {
      const parsed = JSON.parse(raw) as {
        notes?: NoteDocument[];
        selectedNoteId?: string | null;
      };

      if (Array.isArray(parsed.notes) && parsed.notes.length > 0) {
        return {
          notes: parsed.notes,
          selectedNoteId:
            parsed.notes.find((note) => note.id === parsed.selectedNoteId)?.id ??
            parsed.notes[0].id,
        };
      }
    }
  } catch {
    // fall back to defaults
  }

  const notes = createInitialNotes();
  return {
    notes,
    selectedNoteId: notes[0]?.id ?? null,
  };
};

const NotesWorkspaceContext = createContext<NotesWorkspaceContextValue | null>(null);

const createUntitledName = (notes: NoteDocument[]) => {
  const suffix = notes.length + 1;
  return suffix === 1 ? "Untitled note" : `Untitled note ${suffix}`;
};

export function NotesWorkspaceProvider({ children }: { children: React.ReactNode }) {
  const initialState = useMemo(() => loadInitialState(), []);
  const [notes, setNotes] = useState<NoteDocument[]>(initialState.notes);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(
    initialState.selectedNoteId,
  );

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ notes, selectedNoteId }),
      );
    } catch {
      // ignore persistence errors in private browsing / disabled storage
    }
  }, [notes, selectedNoteId]);

  const selectedNote = notes.find((note) => note.id === selectedNoteId) ?? null;

  const createNote = () => {
    const now = new Date().toISOString();
    const newNote: NoteDocument = {
      id: `note-${Date.now()}`,
      title: createUntitledName(notes),
      content: "<p></p>",
      createdAt: now,
      updatedAt: now,
    };

    setNotes((prev) => [newNote, ...prev]);
    setSelectedNoteId(newNote.id);

    return newNote;
  };

  const updateNote = (
    id: string,
    patch: Partial<Pick<NoteDocument, "title" | "content">>,
  ) => {
    const now = new Date().toISOString();

    setNotes((prev) =>
      prev.map((note) =>
        note.id === id
          ? {
              ...note,
              ...patch,
              updatedAt: now,
            }
          : note,
      ),
    );
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => {
      const nextNotes = prev.filter((note) => note.id !== id);

      if (selectedNoteId === id) {
        setSelectedNoteId(nextNotes[0]?.id ?? null);
      }

      return nextNotes;
    });
  };

  const value: NotesWorkspaceContextValue = {
    notes,
    selectedNoteId,
    selectedNote,
    selectNote: setSelectedNoteId,
    createNote,
    updateNote,
    deleteNote,
    noteCount: notes.length,
  };

  return (
    <NotesWorkspaceContext.Provider value={value}>
      {children}
    </NotesWorkspaceContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useNotesWorkspace() {
  const context = useContext(NotesWorkspaceContext);

  if (!context) {
    throw new Error("useNotesWorkspace must be used within NotesWorkspaceProvider");
  }

  return context;
}