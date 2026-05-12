import { useEffect, useRef } from "react";
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
  MoreVertical,
  Quote,
  RemoveFormatting,
  Share,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useNotesWorkspace } from "@/contexts/notes-context";

const EDITOR_CLASS =
  "min-h-[320px] bg-background py-3 text-sm leading-7 outline-none focus-visible:ring-0 prose max-w-none prose-p:my-2 prose-blockquote:border-l-primary/40 prose-blockquote:text-muted-foreground [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mt-4 [&_h1]:mb-2 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:mt-4 [&_h2]:mb-2 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:mb-1";

const emptyEditorHtml = "<p></p>";

export function NotesEditor() {
  const { selectedNote, updateNote } = useNotesWorkspace();
  console.log("Selected note in editor:", selectedNote);
  // flag no longer needed once we focus during initial setContent
  // keep lastSyncedNoteId to avoid resetting content repeatedly
  const lastSyncedNoteId = useRef<string | null>(null);
  const selectedNoteRef = useRef(selectedNote);
  const updateNoteRef = useRef(updateNote);

  useEffect(() => {
    selectedNoteRef.current = selectedNote;
  }, [selectedNote]);

  useEffect(() => {
    updateNoteRef.current = updateNote;
  }, [updateNote]);

  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({
          heading: {
            levels: [1, 2, 3],
          },
          bulletList: {
            HTMLAttributes: {
              class: "list-disc list-inside",
            },
          },
          orderedList: {
            HTMLAttributes: {
              class: "list-decimal list-inside",
            },
          },
          codeBlock: {
            HTMLAttributes: {
              class: "bg-muted p-4 rounded-md font-mono text-sm",
            },
          },
          listItem: {},
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
          class: EDITOR_CLASS,
        },
      },
      onUpdate: ({ editor: nextEditor }) => {
        const activeNote = selectedNoteRef.current;
        if (!activeNote) return;

        updateNoteRef.current(activeNote.id, {
          content: nextEditor.getHTML(),
        });
      },
    },
    [],
  );

  useEffect(() => {
    if (!editor || !selectedNote) return;

    if (lastSyncedNoteId.current !== selectedNote.id) {
      editor.commands.setContent(selectedNote.content || emptyEditorHtml, {
        emitUpdate: false,
      });
      lastSyncedNoteId.current = selectedNote.id;

      // Focus at end only on initial load for this note
      editor.commands.focus("end");
    }
  }, [editor, selectedNote]);

  // Debounced title save (uncontrolled input below uses defaultValue + key)
  const titleDebounceRef = useRef<number | undefined>(undefined);
  const scheduleTitleSave = (next: string) => {
    if (titleDebounceRef.current !== undefined)
      clearTimeout(titleDebounceRef.current);
    titleDebounceRef.current = window.setTimeout(() => {
      const active = selectedNoteRef.current;
      if (!active) return;
      updateNoteRef.current(active.id, { title: next });
      titleDebounceRef.current = undefined;
    }, 400);
  };

  if (!selectedNote) {
    return (
      <div className="flex h-full min-h-0 items-center justify-center p-6">
        <div className="max-w-xl rounded-2xl border border-dashed border-border/70 bg-background/60 p-8 text-center">
          <h2 className="text-xl font-semibold tracking-tight">
            No note selected
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Create a new note from the sidebar to start writing.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 p-4 lg:p-6">
      <div className="flex items-center justify-between ">
        <p className="text-xs text-primary tracking-wider font-semibold">
          ACTIVE DRAFT
        </p>
        <div className="flex-1 mx-4 border-t border-border" />
        <div>
          <Button className="bg-transparent text-accent-foreground hover:bg-transparent">
            <Share size={15} />
          </Button>
          <Button className="bg-transparent text-accent-foreground hover:bg-transparent">
            <MoreVertical size={15} />
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex flex-col overflow-hidden scrollbar-thin scrollbar-thumb-muted scrollbar-track-background">
        <div className="space-y-2">
          <input
            id="note-title"
            key={selectedNote.id}
            defaultValue={selectedNote.title}
            onChange={(event) => scheduleTitleSave(event.target.value)}
            placeholder="Untitled note"
            className="w-full py-1 bg-transparent border-0 ring-0 outline-none focus:outline-none focus:ring-0 text-2xl md:text-3xl font-bold tracking-tight text-foreground"
          />
        </div>
        <div className="border-t border-border my-2" />

        <div className="flex flex-wrap items-center text-sm gap-2 my-2">
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
          <div className="mx-1 hidden h-6 w-px bg-border md:block" />

          <Button
            type="button"
            variant={
              editor?.isActive("heading", { level: 1 }) ? "secondary" : "ghost"
            }
            size="icon-sm"
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 1 }).run()
            }
            aria-label="Heading 1"
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant={
              editor?.isActive("heading", { level: 2 }) ? "secondary" : "ghost"
            }
            size="icon-sm"
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 2 }).run()
            }
            aria-label="Heading 2"
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant={
              editor?.isActive("heading", { level: 3 }) ? "secondary" : "ghost"
            }
            size="icon-sm"
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 3 }).run()
            }
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
        </div>

        <div className="border-t border-border my-2" />

        <div className="flex-1 min-h-0 overflow-y-auto bg-card thin-scrollbar no-scrollbar-sm">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}
