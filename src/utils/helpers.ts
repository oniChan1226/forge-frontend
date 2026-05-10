export const getInitials = (name?: string) => {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
};


export function formatDueDate(date: string | Date) {
  const d = new Date(date);
  const now = new Date();

  const diffMs = d.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  const human = d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  let relative;

  if (diffDays < 0) relative = `${Math.abs(diffDays)} days overdue`;
  else if (diffDays === 0) relative = "Due today";
  else if (diffDays === 1) relative = "1 day left";
  else if (diffDays <= 30) relative = `${diffDays} days left`;
  else relative = "More than a month left";

  return { human, relative };
}