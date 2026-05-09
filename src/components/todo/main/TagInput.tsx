import { MentionsInput, Mention } from "react-mentions";
import { WordProgressCircle } from "./WordProgressCircle";

type Props = {
  value: string;
  onChange: (value: string, tags: string[]) => void;
  maxWords?: number;
  maxLength?: number;
};

const TAGS = [
  "react",
  "node",
  "mongodb",
  "typescript",
  "idea",
  "todo",
  "design",
];

// const getWordProgress = (used: number, max: number) => {
//   return Math.min((used / max) * 100, 100);
// };

const countWords = (text: string) => {
  return text.trim().split(/\s+/).filter(Boolean).length;
};

export default function TagEditor({
  value,
  onChange,
  maxWords = 100,
  maxLength = 5000,
}: Props) {
  const wordsUsed = countWords(value);

  return (
    <div className="group relative rounded-md border border-border bg-card p-2 transition-all focus-within:ring-2 focus-within:ring-primary/50">
      <MentionsInput
        value={value}
        placeholder="Share your thoughts"
        allowSuggestionsAboveCursor
        className="mentions-container"
        maxLength={maxLength}
        onChange={(e, newValue, plainTextValue, mentions) => {
          const words = plainTextValue.trim().split(/\s+/).filter(Boolean);

          // ❌ BLOCK ANY INPUT THAT EXCEEDS LIMIT
          if (words.length > maxWords) {
            return; // do NOTHING → prevents state update completely
          }

          onChange(
            newValue,
            mentions.map((m) => m.id),
          );
        }}
        style={{
          control: {
            fontSize: 15,
            lineHeight: "1.6",
            fontFamily: "sans-serif",
          },
          input: {
            outline: "none",
            border: "none",
            minHeight: 140,
            color: "inherit",
          },
          highlighter: {
            border: "none",
            minHeight: 140,
          },
          suggestions: {
            list: {
              backgroundColor: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              fontSize: 14,
              boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
              overflow: "hidden",
            },
            item: {
              padding: "8px 12px",
              borderBottom: "1px solid #f1f5f9",
              // Target the focused/hovered item
            },
          },
        }}
      >
        <Mention
          trigger="@"
          markup="@[__display__](__id__)"
          displayTransform={(_, display) => `@${display}`}
          className="mention-tag" // This class is applied in the HIGHLIGHTER
          data={(search) => {
            // 1. Filter existing tags
            const filtered = TAGS.filter((tag) =>
              tag.toLowerCase().includes(search.toLowerCase()),
            ).map((tag) => ({ id: tag, display: tag }));

            // 2. If there's a search string and no exact match, add a "Create new" option
            if (search.length > 0 && !TAGS.includes(search)) {
              return [...filtered, { id: search, display: `${search}` }];
            }

            return filtered;
          }}
          style={{
            backgroundColor: "#c47a5a1f",
            color: "#c47a5a",
            borderRadius: 4,
            position: "relative",
            zIndex: 1,
          }}
        />
      </MentionsInput>

      <div className="mt-2 flex items-center justify-between border-t border-border pt-2 px-2 text-[12px]">
        <span className="text-muted-foreground">
          Type <kbd className="font-sans font-bold text-primary">@</kbd> to tag
        </span>

        <div className="flex items-center gap-2">
          <WordProgressCircle used={wordsUsed} max={maxWords} />
        </div>
      </div>
    </div>
  );
}
