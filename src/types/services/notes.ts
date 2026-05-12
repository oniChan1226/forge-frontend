import type { createUserNoteSchema } from "@/schemas/notes/note";
import type z from "zod";

export type CreateUserNoteDTO = z.infer<typeof createUserNoteSchema>;

export interface UserNotes {
  _id: string;

  user: string;

  title: string;

  contentText: string;

  contentHtml: string;

  contentJson: unknown;

  tags: string[];

  isPinned: boolean;

  isArchived: boolean;

  isDeleted: boolean;

  lastOpenedAt: Date | null;

  createdAt: Date;

  updatedAt: Date;
}
