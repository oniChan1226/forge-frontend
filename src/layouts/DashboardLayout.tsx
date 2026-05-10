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
    <main className="h-screen flex overflow-hidden">
      {/* Overlay (mobile) */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden bg-black/10 backdrop-blur-xs"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar (desktop) */}
      <aside
        className={`hidden lg:flex flex-col border-r shadow-sm transition-all duration-300
        ${collapsed ? "w-16" : "w-52"}`}
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
        className={`fixed lg:hidden z-50 top-0 left-0 h-full w-72 border-r shadow-lg transform transition-transform duration-300
        ${mobileOpen ? "translate-x-0 bg-sidebar-primary-mobile" : "-translate-x-full"}`}
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

        <div className="px-3 pt-2 md:px-5 md:pt-4">
          <BreadcrumbNav />
        </div>

        {/* Content */}
        <main className="flex-1 pt-4 px-3 md:px-5 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-muted-foreground scrollbar-track-secondary">
          {children}
        </main>
      </div>
    </main>
  );
};

export default DashboardLayout;
