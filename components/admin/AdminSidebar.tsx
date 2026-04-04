"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, getSession } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { FiHome, FiUser, FiCode, FiFolder, FiAward, FiBook, FiBriefcase, FiGrid, FiMessageSquare, FiLogOut, FiExternalLink, FiMail } from "react-icons/fi";

const NAV = [
  { label:"Dashboard",    href:"/admin",               icon: FiHome          },
  { label:"Profile",      href:"/admin/profile",       icon: FiUser          },
  { label:"Skills",       href:"/admin/skills",        icon: FiCode          },
  { label:"Experience",   href:"/admin/experience",    icon: FiBriefcase     },
  { label:"Education",    href:"/admin/education",     icon: FiBook          },
  { label:"Projects",     href:"/admin/projects",      icon: FiFolder        },
  { label:"Services",     href:"/admin/services",      icon: FiGrid          },
  { label:"Certificates", href:"/admin/certificates",  icon: FiAward         },
  { label:"Testimonials", href:"/admin/testimonials",  icon: FiMessageSquare },
  { label:"Messages",     href:"/admin/messages",      icon: FiMail          },
];

export default function AdminSidebar() {
  const path = usePathname();
  const router = useRouter();
  const [email, setEmail] = useState("");

  useEffect(() => { getSession().then(s => setEmail(s?.user?.email ?? "")); }, []);

  async function handleSignOut() { await signOut(); router.push("/admin/login"); }

  return (
    <aside className="w-56 shrink-0 bg-[#0d0f1a] border-r border-[var(--border)] flex flex-col min-h-screen">
      <div className="p-5 border-b border-[var(--border)]">
        <p className="font-mono text-cyan-400 font-bold">admin /&gt;</p>
        <div className="mt-3 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
            <span className="text-cyan-400 font-bold text-xs">{email[0]?.toUpperCase() ?? "A"}</span>
          </div>
          <div className="min-w-0">
            <p className="text-xs text-white font-medium truncate">{email || "Admin"}</p>
            <p className="text-xs text-green-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />Online</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {NAV.map(({ label, href, icon: Icon }) => {
          const active = path === href;
          return (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${active ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/20" : "text-slate-400 hover:bg-[#111827] hover:text-white"}`}>
              <Icon size={15} />{label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-[var(--border)] space-y-1">
        <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-[#111827] hover:text-white transition-all">
          <FiExternalLink size={15} />View Portfolio
        </a>
        <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all">
          <FiLogOut size={15} />Sign Out
        </button>
      </div>
    </aside>
  );
}
