import { sidebarRoutes } from "@/routes/sidebar-routes";
import { NavLink } from "react-router-dom";

export const Sidebar = ({ collapsed }: { collapsed?: boolean }) => {
  return (
    <nav className="p-2 space-y-1 font-base">
      {sidebarRoutes.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `relative flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-base

              before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2
              before:h-5 before:w-1 before:rounded-r-md before:bg-primary
              before:opacity-0 before:transition-opacity

              ${
                isActive
                  ? "text-black dark:bg-sidebar-accent dark:text-primary font-medium before:opacity-100"
                  : "text-neutral-600 dark:text-sidebar-foreground hover:bg-sidebar-accent/70 hover:before:opacity-100 hover:text-black dark:hover:text-primary"
              }`
            }
          >
            <Icon size={18} className="text-inherit" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        );
      })}
    </nav>
  );
};
