
export const columns = ["backlog", "in-progress", "in-review", "done"] as const;
export type ColumnStatus = typeof columns[number];

export type Task = {
  id: string;
  title: string;
  status: "backlog" | "in-progress" | "in-review" | "done";
};


export const priorityBadgeStyles = {
  low: "bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-300",
  medium: "bg-orange-100 text-orange-800 dark:bg-orange-500/15 dark:text-orange-300",
  high: "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-300",
  urgent: "bg-purple-100 text-purple-800 dark:bg-purple-500/15 dark:text-purple-300",
};