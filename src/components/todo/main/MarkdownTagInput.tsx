import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Mention from "@tiptap/extension-mention";
import { useEffect, useRef } from "react";

type Props = {
  value: string;
  onChange: (value: string, tags: string[]) => void;
  maxWords?: number;
};

const extractTags = (html: string) => {
  const matches = html.match(/@[\w\d_-]+/g) || [];
  return [...new Set(matches.map((t) => t.slice(1)))];
};

const countWords = (text: string) => {
  return text.trim().split(/\s+/).filter(Boolean).length;
};

export default function TagEditor({
  value,
  onChange,
  maxWords = 100,
}: Props) {
  const lastValidContent = useRef(value);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
      }),

      Mention.configure({
        HTMLAttributes: {
          class: "tag-mention",
        },
        suggestion: {
          char: "@",
          items: ({ query }) => {
            const options = [
              "react",
              "node",
              "mongodb",
              "typescript",
              "idea",
              "todo",
              "design",
            ];

            return options
              .filter((item) =>
                item.toLowerCase().includes(query.toLowerCase())
              )
              .slice(0, 5);
          },
        },
      }),
    ],

    content: value,

    onUpdate: ({ editor }) => {
      const text = editor.getText();
      const words = countWords(text);

      // enforce word limit
      if (words > maxWords) {
        editor.commands.setContent(lastValidContent.current);
        return;
      }

      const html = editor.getHTML();
      lastValidContent.current = html;

      onChange(html, extractTags(html));
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className="border rounded-md p-3 min-h-[200px]">
      <EditorContent editor={editor} />

      <style>{`
        .tag-mention {
          background: red;
          color: #0369a1;
          padding: 2px 8px;
          border-radius: 999px;
          font-weight: 500;
          display: inline-block;
        }
      `}</style>
    </div>
  );
}