// sidebar.routes.ts
import {
  LayoutDashboard,
  CheckSquare,
  FolderKanban,
  CalendarDays,
  ListTodo,
  Settings,
} from "lucide-react";

export const sidebarRoutes = [
  {
    label: "Overview",
    to: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Todos",
    to: "/todos",
    icon: ListTodo,
  },
  {
    label: "Tasks",
    to: "/tasks",
    icon: CheckSquare,
  },
  {
    label: "Projects",
    to: "/projects",
    icon: FolderKanban,
  },
  {
    label: "Calendar",
    to: "/calendar",
    icon: CalendarDays,
  },
  {
    label: "Settings",
    to: "/settings",
    icon: Settings,
  },
];