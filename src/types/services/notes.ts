import type { createUserNoteSchema } from "@/schemas/notes/note";
import type z from "zod";

export type CreateUserNoteDTO = z.infer<typeof createUserNoteSchema>;

export type GetNotesQueryParams = {
  search?: string;
  page?: number;
  limit?: number;
};

export type NotesPaginationSummary = {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  hasNextPage?: boolean;
  nextPage?: number | null;
};

export type NotesPageResponse = {
  data?: UserNotes[];
  pagination?: NotesPaginationSummary;
  meta?: NotesPaginationSummary;
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  hasNextPage?: boolean;
  nextPage?: number | null;
};

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
