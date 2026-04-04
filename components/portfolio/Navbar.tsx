"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import type { Profile } from "@/lib/types";
import { FiMenu, FiX, FiSun, FiMoon, FiSettings, FiLock } from "react-icons/fi";
import { ease } from "@/lib/animations";

const NAV = [
  { label:"About",        href:"#about"        },
  { label:"Services",     href:"#services"     },
  { label:"Skills",       href:"#skills"       },
  { label:"Experience",   href:"#experience"   },
  { label:"Projects",     href:"#projects"     },
  { label:"Education",    href:"#education"    },
  { label:"Certificates", href:"#certificates" },
  { label:"Contact",      href:"#contact"      },
];

export default function Navbar({ profile }: { profile: Profile | null }) {
  const [open,     setOpen]     = useState(false);
  const [dark,     setDark]     = useState(true);
  const [settings, setSettings] = useState(false);
  const [fontSize, setFontSize] = useState("Medium");
  const [active,   setActive]   = useState("");

  const { scrollY } = useScroll();
  const navHeight  = useTransform(scrollY, [0, 60], [68, 56]);
  const navBg      = useTransform(scrollY, [0, 60], ["rgba(10,12,20,0)", "rgba(10,12,20,0.92)"]);
  const navBlur    = useTransform(scrollY, [0, 60], ["blur(0px)", "blur(18px)"]);
  const navBorder  = useTransform(scrollY, [0, 60], ["rgba(30,42,58,0)", "rgba(30,42,58,1)"]);

  useEffect(() => {
    const fn = () => {
      const sections = NAV.map(n => document.querySelector(n.href));
      const idx = sections.findLastIndex(s => s && s.getBoundingClientRect().top < 100);
      if (idx >= 0) setActive(NAV[idx].href);
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  function toggleTheme() { setDark(!dark); document.body.classList.toggle("light"); }

  useEffect(() => {
    const sizes: Record<string, string> = { Small:"13px", Medium:"15px", Large:"17px" };
    document.documentElement.style.fontSize = sizes[fontSize];
  }, [fontSize]);

  return (
    <>
      <motion.header
        style={{ height: navHeight, backgroundColor: navBg, backdropFilter: navBlur, borderBottomColor: navBorder }}
        className="fixed top-0 left-0 right-0 z-50 border-b">
        <div className="max-w-6xl mx-auto px-5 h-full flex items-center justify-between">

          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <Link href="/" className="font-mono text-cyan-400 font-bold text-lg shrink-0">
              &lt; Bhuvanesh /&gt;
            </Link>
          </motion.div>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-5">
            {NAV.map((n, i) => (
              <motion.a key={n.label} href={n.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4, ease }}
                className="relative text-sm font-medium whitespace-nowrap"
                style={{ color: active === n.href ? "#22d3ee" : "#94a3b8" }}>
                {n.label}
                {/* Active underline */}
                <motion.span
                  className="absolute -bottom-0.5 left-0 h-px bg-cyan-400"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: active === n.href ? 1 : 0 }}
                  transition={{ duration: 0.3, ease }}
                  style={{ transformOrigin: "left", width: "100%" }} />
                {/* Hover underline */}
                <motion.span
                  className="absolute -bottom-0.5 left-0 h-px bg-slate-500"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.25, ease }}
                  style={{ transformOrigin: "left", width: "100%" }} />
              </motion.a>
            ))}
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-1">
            {/* Theme toggle */}
            <motion.button onClick={toggleTheme} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-[var(--border)] text-slate-400 hover:text-white hover:border-cyan-500/50 transition-colors">
              <motion.div key={dark ? "sun" : "moon"} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} transition={{ duration: 0.25 }}>
                {dark ? <FiSun size={15} /> : <FiMoon size={15} />}
              </motion.div>
            </motion.button>

            {/* Settings */}
            <div className="relative">
              <motion.button onClick={() => setSettings(!settings)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                className={`w-9 h-9 flex items-center justify-center rounded-lg border transition-colors ${settings ? "border-cyan-500/50 text-cyan-400" : "border-[var(--border)] text-slate-400 hover:text-white hover:border-cyan-500/50"}`}>
                <motion.div animate={{ rotate: settings ? 45 : 0 }} transition={{ duration: 0.3 }}><FiSettings size={15} /></motion.div>
              </motion.button>

              <AnimatePresence>
                {settings && (
                  <motion.div initial={{ opacity: 0, scale: 0.92, y: -8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: -8 }} transition={{ duration: 0.2, ease }}
                    className="absolute right-0 top-12 w-56 bg-[#0f1117] border border-[#1e2a3a] rounded-2xl shadow-2xl z-50 overflow-hidden origin-top-right">
                    <div className="px-4 py-3 border-b border-[#1e2a3a]"><p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">⚙️ Settings</p></div>
                    <div className="p-4 space-y-4">
                      <div>
                        <p className="text-xs text-slate-500 mb-2">🌙 Theme</p>
                        <div className="grid grid-cols-2 gap-2">
                          {["Dark","Light"].map(t => (
                            <button key={t} onClick={() => { if ((t==="Dark")!==dark) toggleTheme(); }}
                              className={`py-2 rounded-xl text-xs font-medium transition-all ${(t==="Dark")===dark ? "bg-cyan-500 text-slate-900" : "bg-[#161b27] text-slate-400 hover:text-white"}`}>
                              {t==="Dark"?"🌙":"☀️"} {t}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-2">🔤 Font Size</p>
                        <div className="grid grid-cols-3 gap-2">
                          {["Small","Medium","Large"].map(f => (
                            <button key={f} onClick={() => setFontSize(f)}
                              className={`py-2 rounded-xl text-xs font-medium transition-all ${fontSize===f ? "bg-cyan-500 text-slate-900" : "bg-[#161b27] text-slate-400 hover:text-white"}`}>
                              {f}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="border-t border-[#1e2a3a] pt-3">
                        <Link href="/admin/login" onClick={() => setSettings(false)}
                          className="w-full flex items-center justify-center gap-2 py-2.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-xl text-xs font-semibold hover:bg-cyan-500 hover:text-slate-900 transition-all">
                          <FiLock size={12} /> Admin Login
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Link href="/admin/login" className="w-9 h-9 flex items-center justify-center rounded-lg border border-[var(--border)] text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-colors">
                <FiLock size={15} />
              </Link>
            </motion.div>

            <motion.a href={`mailto:${profile?.email ?? "bhuvaneshr206@gmail.com"}`}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="hidden sm:inline-flex btn-primary text-sm px-4 py-2 ml-1">
              Hire Me
            </motion.a>

            <motion.button onClick={() => setOpen(!open)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-[var(--border)] text-slate-400 ml-1">
              <AnimatePresence mode="wait">
                <motion.div key={open ? "x" : "menu"} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  {open ? <FiX size={16} /> : <FiMenu size={16} />}
                </motion.div>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {open && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease }}
              className="lg:hidden overflow-hidden bg-[var(--bg)]/95 backdrop-blur-xl border-t border-[var(--border)]">
              <div className="px-5 py-4 flex flex-col gap-1">
                {NAV.map((n, i) => (
                  <motion.a key={n.label} href={n.href} onClick={() => setOpen(false)}
                    initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.04, duration: 0.3, ease }}
                    className="text-sm text-slate-300 hover:text-white py-3 border-b border-[var(--border)] last:border-0 transition-colors">
                    {n.label}
                  </motion.a>
                ))}
                <div className="flex gap-2 pt-3">
                  <motion.a href={`mailto:${profile?.email ?? "bhuvaneshr206@gmail.com"}`}
                    whileTap={{ scale: 0.97 }} className="btn-primary flex-1 justify-center">Hire Me</motion.a>
                  <Link href="/admin/login" onClick={() => setOpen(false)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[var(--border)] text-slate-400 text-sm hover:border-cyan-500/50 hover:text-cyan-400 transition-all">
                    <FiLock size={13} /> Admin
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {settings && <div className="fixed inset-0 z-40" onClick={() => setSettings(false)} />}
    </>
  );
}
