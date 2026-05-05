import { useState } from "react";
import { X } from "lucide-react";
import { Sidebar } from "@/components/dashboard/sidebar/Sidebar";
import Logo from "@/assets/logo.png";
import Header from "@/components/dashboard/header/Header";
import BreadcrumbNav from "@/components/breadcrumbs/Breadcrumb";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Overlay (mobile) */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar (desktop) */}
      <aside
        className={`hidden md:flex flex-col border-r shadow-sm transition-all duration-300
        ${collapsed ? "w-20" : "w-64"}`}
      >
        {/* Logo / Header */}
        <div className="h-16 flex items-center justify-between px-4">
          {!collapsed && (
            <div className="flex items-center justify-center space-x-1">
              <img src={Logo} alt="Logo" className="w-7 h-7 rounded-md" />
              <span className="text-primary font-bold text-lg">Forge</span>
            </div>
          )}

          <button
            onClick={() => setCollapsed((prev) => !prev)}
            className="p-2 rounded"
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
        className={`fixed md:hidden z-50 top-0 left-0 h-full w-72 border-r shadow-lg transform transition-transform duration-300
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
        <Header setMobileOpen={setMobileOpen} />

        <div className="px-4 md:px-6 pt-6">
          <BreadcrumbNav />
        </div>

        {/* Content */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
