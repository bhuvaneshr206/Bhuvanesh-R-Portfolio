"use client";
import { motion } from "framer-motion";
import type { Profile } from "@/lib/types";
import { fadeUp, viewport } from "@/lib/animations";

export default function Footer({ profile }: { profile: Profile | null }) {
  return (
    <motion.footer variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport}
      className="border-t border-[var(--border)] py-8 px-5 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ background:"radial-gradient(ellipse at center,rgba(34,211,238,0.03) 0%,transparent 70%)" }} />
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 relative">
        <motion.p whileHover={{ scale: 1.05 }} className="font-mono text-cyan-400 font-bold cursor-default">&lt; Bhuvanesh /&gt;</motion.p>
        <p className="text-xs text-slate-500">© {new Date().getFullYear()} Bhuvanesh R. Built with Next.js & Supabase.</p>
        <motion.a href="/admin" whileHover={{ y: -2, color: "#94a3b8" }} className="text-xs text-slate-600 transition-colors">Admin</motion.a>
      </div>
    </motion.footer>
  );
}
