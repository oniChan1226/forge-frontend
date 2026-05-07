
export const columns = ["backlog", "in-progress", "in-review", "done"] as const;
export type ColumnStatus = typeof columns[number];

export type Task = {
  id: string;
  title: string;
  status: "backlog" | "in-progress" | "in-review" | "done";
};