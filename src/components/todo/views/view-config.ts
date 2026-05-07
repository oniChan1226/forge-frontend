
export const columns = ["backlog", "in-progress", "in-review", "done"] as const;
export type ColumnStatus = typeof columns[number];