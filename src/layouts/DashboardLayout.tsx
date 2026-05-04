import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Sidebar } from "@/components/dashboard/sidebar/Sidebar";
import Logo from "@/assets/logo.png";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="h-screen flex bg-gray-100 overflow-hidden">
      {/* Overlay (mobile) */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar (desktop) */}
      <aside
        className={`hidden md:flex flex-col bg-white border-r shadow-sm transition-all duration-300
        ${collapsed ? "w-20" : "w-64"}`}
      >
        {/* Logo / Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b">
          {!collapsed && (
            <div className="flex items-center justify-center space-x-1">
              <img src={Logo} alt="Logo" className="w-7 h-7 rounded-md" />
              <span className="font-bold text-lg">Forge</span>
            </div>
          )}

          <button
            onClick={() => setCollapsed((prev) => !prev)}
            className="p-2 rounded hover:bg-gray-100"
          >
            {collapsed ? "→" : "←"}
          </button>
        </div>

        {/* Sidebar content */}
        <div className="flex-1 overflow-y-auto">
          <Sidebar collapsed={collapsed} />
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`fixed md:hidden z-50 top-0 left-0 h-full w-72 bg-white border-r shadow-lg transform transition-transform duration-300
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b">
          <span className="font-bold text-lg">Forge</span>
          <button onClick={() => setMobileOpen(false)}>
            <X />
          </button>
        </div>

        <Sidebar />
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-4 md:px-6">
          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded hover:bg-gray-100"
            onClick={() => setMobileOpen(true)}
          >
            <Menu />
          </button>

          <h1 className="font-semibold">Dashboard</h1>

          <div />
        </header>

        {/* Content */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
