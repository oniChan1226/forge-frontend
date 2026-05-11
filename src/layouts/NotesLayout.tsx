
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  FilePlus2,
  NotebookPen,
  StickyNote,
} from "lucide-react";

type NotesLayoutProps = {
  children: React.ReactNode;
};

const NotesLayout = ({ children }: NotesLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-full min-h-0 gap-3">
      <aside
        className={cn(
          "hidden min-h-0 flex-col rounded-xl border bg-card/70 shadow-sm backdrop-blur-sm transition-all duration-300 lg:flex",
          collapsed ? "w-16" : "w-72",
        )}
      >
        <div className="flex h-14 items-center justify-between border-b px-3">
          {!collapsed ? (
            <div className="flex items-center gap-2">
              <NotebookPen className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-semibold leading-none">Notes</p>
                <p className="text-[11px] text-muted-foreground">Your ideas</p>
              </div>
            </div>
          ) : (
            <NotebookPen className="h-4 w-4 text-primary" />
          )}

          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={() => setCollapsed((prev) => !prev)}
            aria-label={collapsed ? "Expand notes sidebar" : "Collapse notes sidebar"}
          >
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <Button
            type="button"
            variant="secondary"
            className={cn("w-full justify-start", collapsed && "justify-center px-0")}
          >
            <FilePlus2 className="h-4 w-4" />
            {!collapsed && <span>New note</span>}
          </Button>

          <div className="mt-4 space-y-2">
            {!collapsed ? (
              <div className="rounded-lg border border-dashed border-border/70 bg-background/40 p-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2 text-foreground/80">
                  <StickyNote className="h-4 w-4" />
                  <span>No notes yet</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed">
                  Create your first note to start organizing ideas, references,
                  and drafts.
                </p>
              </div>
            ) : (
              <div className="flex justify-center py-4 text-muted-foreground">
                <StickyNote className="h-4 w-4" />
              </div>
            )}
          </div>
        </div>
      </aside>

      <main className="min-w-0 flex-1 overflow-hidden rounded-xl border bg-background/80 shadow-sm">
        {children}
      </main>
    </div>
  );
};

export default NotesLayout;
