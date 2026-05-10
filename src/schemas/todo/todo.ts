import z from "zod";

export const createTodoSchema = z.object({
	title: z.string().min(1, "Title is required").max(200),
	description: z.string().max(5000).optional(),
	status: z.enum(["backlog", "in-progress", "in-review", "done"]).optional(),
	priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
	tags: z.array(z.string()).optional(),
	dueDate: z.date().optional(),
	position: z.number().int().optional(),
	completed: z.boolean().optional(),
});