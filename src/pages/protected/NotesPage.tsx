
import { Button } from "@/components/ui/button";
import { NotebookPen, Sparkles } from "lucide-react";

const NotesPage = () => {
  return (
    <div className="flex h-full min-h-0 items-center justify-center p-6">
      <div className="w-full max-w-2xl rounded-2xl border border-dashed border-border/70 bg-gradient-to-br from-background via-background to-muted/20 p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <NotebookPen className="h-6 w-6" />
        </div>

        <h1 className="mt-4 text-2xl font-semibold tracking-tight">
          Select a note or create a new one
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Your note content will appear here. Start with a blank note, then
          keep your ideas, drafts, and references in one place.
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <Button type="button" className="gap-2">
            <Sparkles className="h-4 w-4" />
            Create note
          </Button>
          <Button type="button" variant="outline">
            Browse notes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotesPage;
