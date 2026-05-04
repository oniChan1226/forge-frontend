import { sidebarRoutes } from "@/routes/sidebar-routes";
import { NavLink } from "react-router-dom";

export const Sidebar = ({ collapsed }: { collapsed?: boolean }) => {
  return (
    <nav className="p-2 space-y-1">
      {sidebarRoutes.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md transition
              ${
                isActive
                  ? "bg-gray-200 text-black font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            <Icon size={18} />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        );
      })}
    </nav>
  );
};