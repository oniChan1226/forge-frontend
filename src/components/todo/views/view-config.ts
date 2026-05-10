
export const columns = ["backlog", "in-progress", "in-review", "done"] as const;
export type ColumnStatus = typeof columns[number];

export type Task = {
  id: string;
  title: string;
  status: "backlog" | "in-progress" | "in-review" | "done";
};


export const priorityBadgeStyles = {
  low: "bg-green-100 text-green-800",
  medium: "bg-orange-100 text-orange-800",
  high: "bg-red-100 text-red-800",
  urgent: "bg-purple-100 text-purple-800",
}