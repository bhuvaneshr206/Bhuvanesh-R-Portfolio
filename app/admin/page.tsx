"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getProfile, getSkills, getProjects, getCertificates, getMessages } from "@/lib/supabase/client";
import { FiCode, FiFolder, FiAward, FiUser, FiArrowRight, FiMail, FiEye } from "react-icons/fi";

export default function AdminDashboard() {
  const [data, setData] = useState({ name:"", skills:0, projects:0, certs:0, messages:0, unread:0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getProfile(), getSkills(), getProjects(), getCertificates(), getMessages()]).then(([p, s, pr, c, m]) => {
      setData({ name: p?.name ?? "Bhuvanesh", skills: s.length, projects: pr.length, certs: c.length, messages: m.length, unread: m.filter(x => !x.read).length });
      setLoading(false);
    });
  }, []);

  const stats = [
    { label:"Skills",       value:data.skills,   icon:FiCode,   href:"/admin/skills",       color:"cyan"   },
    { label:"Projects",     value:data.projects, icon:FiFolder, href:"/admin/projects",     color:"violet" },
    { label:"Certificates", value:data.certs,    icon:FiAward,  href:"/admin/certificates", color:"amber"  },
    { label:"Messages",     value:data.messages, icon:FiMail,   href:"/admin/messages",     color:"green", badge:data.unread },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">Welcome back, {loading ? "…" : data.name} 👋</h2>
        <p className="text-slate-400 text-sm mt-1">Manage all your portfolio content from here.</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, href, color, badge }) => (
          <Link key={label} href={href} className="card p-5 hover:border-slate-700 transition-all group">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${color==="cyan"?"bg-cyan-400/10 border-cyan-400/20 text-cyan-400":color==="violet"?"bg-violet-400/10 border-violet-400/20 text-violet-400":color==="amber"?"bg-amber-400/10 border-amber-400/20 text-amber-400":"bg-green-400/10 border-green-400/20 text-green-400"}`}>
                <Icon size={16} />
              </div>
              {badge ? <span className="px-1.5 py-0.5 rounded-full text-xs bg-red-500 text-white font-bold">{badge}</span> : <FiArrowRight size={14} className="text-slate-700 group-hover:text-slate-400 group-hover:translate-x-1 transition-all" />}
            </div>
            <p className="text-3xl font-bold text-white">{loading ? <span className="inline-block w-8 h-7 rounded skeleton" /> : value}</p>
            <p className="text-sm text-slate-400 mt-1">{label}</p>
          </Link>
        ))}
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Quick Actions</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label:"Edit Profile",    href:"/admin/profile",      icon:FiUser   },
            { label:"Add Project",     href:"/admin/projects",     icon:FiFolder },
            { label:"Add Skill",       href:"/admin/skills",       icon:FiCode   },
            { label:"View Messages",   href:"/admin/messages",     icon:FiMail   },
          ].map(({ label, href, icon: Icon }) => (
            <Link key={label} href={href} className="card p-4 flex flex-col items-center gap-2 hover:border-cyan-400/30 hover:bg-cyan-400/5 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-slate-800 group-hover:bg-cyan-400/10 flex items-center justify-center transition-colors">
                <Icon size={16} className="text-slate-400 group-hover:text-cyan-400 transition-colors" />
              </div>
              <span className="text-xs text-slate-400 group-hover:text-white transition-colors text-center">{label}</span>
            </Link>
          ))}
        </div>
      </div>
      <div className="bg-gradient-to-r from-cyan-500/10 to-violet-500/10 border border-cyan-500/20 rounded-2xl p-5 flex items-center justify-between">
        <div>
          <p className="text-white font-semibold text-sm">Your portfolio is live!</p>
          <p className="text-slate-400 text-xs mt-0.5">All changes reflect immediately on the site.</p>
        </div>
        <a href="/" target="_blank" rel="noopener noreferrer" className="btn-primary text-xs px-4 py-2 shrink-0 flex items-center gap-1.5">
          <FiEye size={13} /> View Site
        </a>
      </div>
    </div>
  );
}
