
import { useState, memo, type JSX } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  FilePlus2,
  NotebookPen,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { NotesWorkspaceProvider, useNotesWorkspace } from "@/contexts/notes-context";

type NotesLayoutProps = {
  children: React.ReactNode;
};

const NotesSidebar = memo(function NotesSidebar({
  collapsed,
  onToggleCollapsed,
}: {
  collapsed: boolean;
  onToggleCollapsed: () => void;
}): JSX.Element {
  const { notes, selectedNoteId, selectNote, createNote, noteCount } =
    useNotesWorkspace();

  return (
    <div
      className={cn(
        "flex h-full min-h-0 flex-col rounded-xl border bg-card/70 shadow-sm backdrop-blur-sm transition-all duration-300",
        collapsed ? "w-16" : "w-80",
      )}
    >
      <div className="flex h-14 items-center justify-between border-b px-3">
        {!collapsed ? (
          <div className="flex items-center gap-2">
            <NotebookPen className="h-4 w-4 text-primary" />
            <div>
              <p className="text-sm font-semibold leading-none">Notes</p>
              <p className="text-[11px] text-muted-foreground">{noteCount} documents</p>
            </div>
          </div>
        ) : (
          <NotebookPen className="h-4 w-4 text-primary" />
        )}

        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={onToggleCollapsed}
          aria-label={collapsed ? "Expand notes sidebar" : "Collapse notes sidebar"}
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <Button
          type="button"
          variant="secondary"
          className={cn("w-full justify-start gap-2", collapsed && "justify-center px-0")}
          onClick={createNote}
        >
          <FilePlus2 className="h-4 w-4" />
          {!collapsed && <span>New note</span>}
        </Button>

        <div className="mt-4 space-y-2">
          {notes.map((note, index) => {
            const isActive = note.id === selectedNoteId;

            return (
              <button
                key={note.id}
                type="button"
                onClick={() => selectNote(note.id)}
                className={cn(
                  "group w-full rounded-xl border text-left transition-all",
                  isActive
                    ? "border-primary/30 bg-primary/5 shadow-sm"
                    : "border-border/70 bg-background/60 hover:border-primary/20 hover:bg-background",
                  collapsed ? "flex items-center justify-center p-2" : "p-3",
                )}
              >
                {collapsed ? (
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg text-sm font-semibold",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground",
                    )}
                    title={note.title}
                  >
                    {index + 1}
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-semibold",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {index + 1}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-semibold">{note.title}</p>
                        {isActive && <ArrowRight className="h-4 w-4 text-primary" />}
                      </div>

                      <p className="mt-2 text-[11px] text-muted-foreground">
                        Updated {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
});

const NotesLayoutContent = memo(function NotesLayoutContent({ children }: NotesLayoutProps): JSX.Element {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-full min-h-0 gap-3">
      <NotesSidebar collapsed={collapsed} onToggleCollapsed={() => setCollapsed((prev) => !prev)} />

      <main className="min-w-0 flex-1 overflow-hidden rounded-xl border bg-background/80 shadow-sm">
        {children}
      </main>
    </div>
  );
});

const NotesLayout = ({ children }: NotesLayoutProps) => {
  return (
    <NotesWorkspaceProvider>
      <NotesLayoutContent>{children}</NotesLayoutContent>
    </NotesWorkspaceProvider>
  );
};

export default NotesLayout;
