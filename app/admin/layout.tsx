"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getSession } from "@/lib/supabase/client";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { FiMenu, FiX } from "react-icons/fi";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router  = useRouter();
  const path    = usePathname();
  const [ready,     setReady]     = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (path === "/admin/login") { setReady(true); return; }
    getSession().then(session => {
      if (!session) router.replace("/admin/login");
      else setReady(true);
    });
  }, [path, router]);

  if (path === "/admin/login") return <>{children}</>;

  if (!ready) return (
    <div style={{
      minHeight: "100vh", backgroundColor: "#0a0c14",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{
        width: "32px", height: "32px",
        border: "2px solid rgba(34,211,238,0.2)",
        borderTopColor: "#22d3ee", borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--bg)] flex">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <AdminSidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="relative">
            <AdminSidebar />
          </div>
          <div className="flex-1 bg-black/60" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--bg2)]">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-[var(--border)] text-slate-400"
          >
            {sidebarOpen ? <FiX size={16} /> : <FiMenu size={16} />}
          </button>
          <p className="font-mono text-cyan-400 font-bold text-sm">admin /&gt;</p>
          <div className="w-9" />
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
