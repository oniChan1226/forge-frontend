// sidebar.routes.ts
import {
  LayoutDashboard,
  // FolderKanban,
  CalendarDays,
  ListTodo,
  Settings,
  FileText,
  Repeat,
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
    label: "Habits",
    to: "/habits",
    icon: Repeat,
  },
  // {
  //   label: "Projects",
  //   to: "/projects",
  //   icon: FolderKanban,
  // },
  {
    label: "Notes",
    to: "/notes",
    icon: FileText,
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
