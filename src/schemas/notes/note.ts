import z from "zod";

export const createUserNoteSchema = z.object({
  user: z.string(),

  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title cannot exceed 200 characters"),

  contentText: z
    .string()
    .trim()
    .min(1, "Content text is required")
    .max(5000, "Content text cannot exceed 5000 characters"),

  contentHtml: z
    .string()
    .trim()
    .min(1, "Content HTML is required")
    .max(5000, "Content HTML cannot exceed 5000 characters"),

  contentJson: z.any(),

  tags: z.array(z.string().trim().min(1, "Tag cannot be empty")).default([]),

  isPinned: z.boolean().optional().default(false),

  isArchived: z.boolean().optional().default(false),

  isDeleted: z.boolean().optional().default(false),

  lastOpenedAt: z.date().optional(),
});
