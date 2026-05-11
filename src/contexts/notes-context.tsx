import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

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

const createUntitledName = (notes: NoteDocument[]) => {
  const suffix = notes.length + 1;
  return suffix === 1 ? "Untitled note" : `Untitled note ${suffix}`;
};

type NotesWorkspaceStore = {
  notes: NoteDocument[];
  selectedNoteId: string | null;
  selectNote: (id: string) => void;
  createNote: () => NoteDocument;
  updateNote: (
    id: string,
    patch: Partial<Pick<NoteDocument, "title" | "content">>,
  ) => void;
  deleteNote: (id: string) => void;
};

const initialNotes = createInitialNotes();

const generateNoteId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `note-${Date.now()}`;
};

const useNotesWorkspaceStore = create<NotesWorkspaceStore>()(
  persist(
    (set, get) => ({
      notes: initialNotes,
      selectedNoteId: initialNotes[0]?.id ?? null,

      selectNote: (id) => set({ selectedNoteId: id }),

      createNote: () => {
        const now = new Date().toISOString();
        const currentNotes = get().notes;
        const newNote: NoteDocument = {
          id: generateNoteId(),
          title: createUntitledName(currentNotes),
          content: "<p></p>",
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          notes: [newNote, ...state.notes],
          selectedNoteId: newNote.id,
        }));

        return newNote;
      },

      updateNote: (id, patch) => {
        const now = new Date().toISOString();

        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id
              ? {
                  ...note,
                  ...patch,
                  updatedAt: now,
                }
              : note,
          ),
        }));
      },

      deleteNote: (id) => {
        set((state) => {
          const nextNotes = state.notes.filter((note) => note.id !== id);

          return {
            notes: nextNotes,
            selectedNoteId:
              state.selectedNoteId === id
                ? (nextNotes[0]?.id ?? null)
                : state.selectedNoteId,
          };
        });
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      version: 1,
    },
  ),
);

export function NotesWorkspaceProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useNotesWorkspace(): NotesWorkspaceContextValue {
  const notes = useNotesWorkspaceStore((state) => state.notes);
  const selectedNoteId = useNotesWorkspaceStore((state) => state.selectedNoteId);
  const selectNote = useNotesWorkspaceStore((state) => state.selectNote);
  const createNote = useNotesWorkspaceStore((state) => state.createNote);
  const updateNote = useNotesWorkspaceStore((state) => state.updateNote);
  const deleteNote = useNotesWorkspaceStore((state) => state.deleteNote);

  const selectedNote = notes.find((note) => note.id === selectedNoteId) ?? null;

  return {
    notes,
    selectedNoteId,
    selectedNote,
    selectNote,
    createNote,
    updateNote,
    deleteNote,
    noteCount: notes.length,
  };
}