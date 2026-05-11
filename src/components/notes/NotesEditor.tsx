import { useEffect, useMemo, useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import {
  Bold,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  Redo2,
  RemoveFormatting,
  Strikethrough,
  Underline as UnderlineIcon,
  Undo2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useNotesWorkspace } from "@/contexts/notes-context";

const emptyEditorHtml = "<p></p>";

export function NotesEditor() {
  const { selectedNote, updateNote } = useNotesWorkspace();
  const [hasLoadedContent, setHasLoadedContent] = useState(false);
  const lastSyncedNoteId = useRef<string | null>(null);

  const editor = useEditor(
    useMemo(
      () => ({
        extensions: [
          StarterKit.configure({
            heading: {
              levels: [1, 2, 3],
            },
          }),
          Underline,
          Highlight,
          TextAlign.configure({
            types: ["heading", "paragraph"],
          }),
          Link.configure({
            openOnClick: false,
            autolink: true,
            linkOnPaste: true,
            HTMLAttributes: {
              class: "text-primary underline underline-offset-2",
            },
          }),
          Placeholder.configure({
            placeholder: "Start writing your note here...",
          }),
        ],
        content: selectedNote?.content ?? emptyEditorHtml,
        immediatelyRender: false,
        editorProps: {
          attributes: {
            class:
              "min-h-[320px] rounded-xl border border-border/70 bg-background px-4 py-3 text-sm leading-7 outline-none focus-visible:ring-0 prose max-w-none prose-p:my-2 prose-headings:scroll-mt-20 prose-headings:font-semibold prose-blockquote:border-l-primary/40 prose-blockquote:text-muted-foreground",
          },
        },
        onUpdate: ({ editor: nextEditor }) => {
          if (!selectedNote) return;

          updateNote(selectedNote.id, {
            content: nextEditor.getHTML(),
          });
        },
      }),
      [selectedNote, updateNote],
    ),
  );

  useEffect(() => {
    if (!editor || !selectedNote) return;

    if (lastSyncedNoteId.current !== selectedNote.id) {
      editor.commands.setContent(selectedNote.content || emptyEditorHtml, {
        emitUpdate: false,
      });
      lastSyncedNoteId.current = selectedNote.id;
      setHasLoadedContent(true);
    }
  }, [editor, selectedNote]);

  useEffect(() => {
    if (!editor || !selectedNote) return;

    if (hasLoadedContent && lastSyncedNoteId.current === selectedNote.id) {
      editor.commands.focus("end");
    }
  }, [editor, hasLoadedContent, selectedNote]);

  if (!selectedNote) {
    return (
      <div className="flex h-full min-h-0 items-center justify-center p-6">
        <div className="max-w-xl rounded-2xl border border-dashed border-border/70 bg-background/60 p-8 text-center">
          <h2 className="text-xl font-semibold tracking-tight">No note selected</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Create a new note from the sidebar to start writing.
          </p>
        </div>
      </div>
    );
  }

  const canUndo = editor?.can().undo() ?? false;
  const canRedo = editor?.can().redo() ?? false;

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 p-4 lg:p-6">
      <div className="flex items-start justify-between gap-3 rounded-2xl border bg-card/70 p-4 shadow-sm backdrop-blur-sm">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
            Note editor
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            Edit your note
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Use the sidebar to switch notes. Changes save locally as you type.
          </p>
        </div>

        <div className="hidden rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground md:flex">
          Auto-saved locally
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-rows-[auto_auto_1fr] gap-4 overflow-hidden rounded-2xl border bg-background/80 p-4 shadow-sm">
        <div className="space-y-2">
          <label htmlFor="note-title" className="text-sm font-medium">
            Title
          </label>
          <input
            id="note-title"
            value={selectedNote.title}
            onChange={(event) =>
              updateNote(selectedNote.id, { title: event.target.value })
            }
            placeholder="Untitled note"
            className="h-12 w-full rounded-lg border border-border/70 bg-background px-4 text-base outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border/70 bg-muted/20 p-2">
          <Button
            type="button"
            variant={editor?.isActive("bold") ? "secondary" : "ghost"}
            size="icon-sm"
            onClick={() => editor?.chain().focus().toggleBold().run()}
            aria-label="Bold"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant={editor?.isActive("italic") ? "secondary" : "ghost"}
            size="icon-sm"
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            aria-label="Italic"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant={editor?.isActive("underline") ? "secondary" : "ghost"}
            size="icon-sm"
            onClick={() => editor?.chain().focus().toggleUnderline().run()}
            aria-label="Underline"
          >
            <UnderlineIcon className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant={editor?.isActive("strike") ? "secondary" : "ghost"}
            size="icon-sm"
            onClick={() => editor?.chain().focus().toggleStrike().run()}
            aria-label="Strike through"
          >
            <Strikethrough className="h-4 w-4" />
          </Button>

          <div className="mx-1 hidden h-6 w-px bg-border md:block" />

          <Button
            type="button"
            variant={editor?.isActive("heading", { level: 1 }) ? "secondary" : "ghost"}
            size="icon-sm"
            onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
            aria-label="Heading 1"
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant={editor?.isActive("heading", { level: 2 }) ? "secondary" : "ghost"}
            size="icon-sm"
            onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
            aria-label="Heading 2"
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant={editor?.isActive("heading", { level: 3 }) ? "secondary" : "ghost"}
            size="icon-sm"
            onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
            aria-label="Heading 3"
          >
            <Heading3 className="h-4 w-4" />
          </Button>

          <div className="mx-1 hidden h-6 w-px bg-border md:block" />

          <Button
            type="button"
            variant={editor?.isActive("bulletList") ? "secondary" : "ghost"}
            size="icon-sm"
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            aria-label="Bullet list"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant={editor?.isActive("orderedList") ? "secondary" : "ghost"}
            size="icon-sm"
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            aria-label="Ordered list"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant={editor?.isActive("blockquote") ? "secondary" : "ghost"}
            size="icon-sm"
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
            aria-label="Blockquote"
          >
            <Quote className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant={editor?.isActive("codeBlock") ? "secondary" : "ghost"}
            size="icon-sm"
            onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
            aria-label="Code block"
          >
            <Code2 className="h-4 w-4" />
          </Button>

          <div className="mx-1 hidden h-6 w-px bg-border md:block" />

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => editor?.chain().focus().toggleHighlight().run()}
            aria-label="Highlight"
          >
            <span className="rounded-sm bg-yellow-300/80 px-1 text-[10px] font-bold text-yellow-950">
              H
            </span>
          </Button>
          <Button
            type="button"
            variant={editor?.isActive("link") ? "secondary" : "ghost"}
            size="icon-sm"
            onClick={() => {
              const url = window.prompt("Paste a link URL");

              if (!url) return;

              editor?.chain().focus().setLink({ href: url }).run();
            }}
            aria-label="Link"
          >
            <Link2 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => editor?.chain().focus().unsetLink().run()}
            aria-label="Remove link"
          >
            <RemoveFormatting className="h-4 w-4" />
          </Button>

          <div className="mx-1 hidden h-6 w-px bg-border md:block" />

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => editor?.chain().focus().undo().run()}
            disabled={!canUndo}
            aria-label="Undo"
          >
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => editor?.chain().focus().redo().run()}
            disabled={!canRedo}
            aria-label="Redo"
          >
            <Redo2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="min-h-0 overflow-y-auto rounded-xl border border-border/70 bg-card">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}