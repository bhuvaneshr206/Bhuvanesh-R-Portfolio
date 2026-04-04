"use client";
import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { Project } from "@/lib/types";
import { FiGithub, FiExternalLink, FiStar, FiEye } from "react-icons/fi";
import { fadeUp, staggerContainer, staggerItem, imgHover, viewport, ease } from "@/lib/animations";

const FALLBACK: Project[] = [
  { id:"1", title:"Wearable Health Monitor", description:"ESP32 wearable for heart rate, SpO2, temp & steps. Synced via BLE to mobile and MQTT to web dashboard.", tech_stack:["ESP32","BLE","MQTT","React Native","Supabase"], featured:true, project_link:"#", github_link:"#" },
  { id:"2", title:"Portfolio Admin Dashboard", description:"Full-stack portfolio with complete admin panel. Next.js + Supabase with real-time content management.", tech_stack:["Next.js","TypeScript","Supabase","Tailwind CSS"], featured:false, project_link:"#", github_link:"#" },
  { id:"3", title:"IoT Smart Home System", description:"Home automation with ESP32, relay control, sensor monitoring and a web control panel.", tech_stack:["ESP32","MQTT","Node.js","React","Firebase"], featured:false, project_link:"#", github_link:"#" },
];

export default function Projects({ projects }: { projects: Project[] }) {
  const list = projects.length ? projects : FALLBACK;
  const [filter, setFilter] = useState("All");
  const allTech = ["All", ...Array.from(new Set(list.flatMap(p => p.tech_stack))).slice(0, 6)];
  const filtered = filter === "All" ? list : list.filter(p => p.tech_stack.includes(filter));

  return (
    <section id="projects" className="py-16 sm:py-28 px-4 sm:px-5 bg-[#0a0c16]">
      <div className="max-w-6xl mx-auto">

        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} className="text-center mb-14">
          <span className="section-tag"><span className="w-6 h-px bg-cyan-400" />Projects</span>
          <h2 className="section-title mt-4">Things I&apos;ve <span className="gradient-text">Built</span></h2>
        </motion.div>

        {/* Filter */}
        <motion.div variants={fadeUp} custom={0.1} initial="hidden" whileInView="visible" viewport={viewport}
          className="flex flex-wrap justify-center gap-2 mb-10">
          {allTech.map(t => (
            <motion.button key={t} onClick={() => setFilter(t)}
              whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}
              animate={{ backgroundColor: filter===t ? "#22d3ee" : "transparent", color: filter===t ? "#0f172a" : "#94a3b8" }}
              className={`px-4 py-1.5 rounded-full text-xs font-mono border transition-colors ${filter===t ? "border-cyan-500 font-bold" : "border-slate-700 hover:border-cyan-400/40"}`}>
              {t}
            </motion.button>
          ))}
        </motion.div>

        {/* Grid */}
        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => (
              <motion.div key={p.id} layout
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, ease, delay: i * 0.07 }}
                whileHover={{ y: -6, boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(34,211,238,0.06)" }}
                className={`card overflow-hidden group ${p.featured ? "md:col-span-2 lg:col-span-1" : ""}`}>

                {/* Image */}
                <motion.div className="relative h-40 sm:h-44 bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden"
                  initial="rest" whileHover="hover" animate="rest">
                  {p.image_url ? (
                    <motion.div variants={imgHover} className="absolute inset-0">
                      <Image src={p.image_url} alt={p.title} fill className="object-cover" unoptimized />
                    </motion.div>
                  ) : (
                    <motion.div variants={imgHover} className="w-full h-full flex items-center justify-center">
                      <span className="text-6xl font-bold text-slate-700">{p.title[0]}</span>
                    </motion.div>
                  )}

                  {/* Overlay links */}
                  <motion.div className="absolute inset-0 flex items-center justify-center gap-3"
                    style={{ background:"linear-gradient(to top,rgba(10,12,20,0.9) 0%,rgba(34,211,238,0.06) 100%)" }}
                    variants={{ rest:{ opacity:0 }, hover:{ opacity:1 } }}
                    transition={{ duration:0.3 }}>
                    {p.github_link && (
                      <motion.a href={p.github_link} target="_blank" rel="noopener noreferrer"
                        whileHover={{ scale:1.15 }} whileTap={{ scale:0.9 }}
                        initial={{ y:10, opacity:0 }} variants={{ hover:{ y:0, opacity:1 } }} transition={{ delay:0.05 }}
                        className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-cyan-500 hover:border-cyan-500 transition-colors backdrop-blur-sm">
                        <FiGithub size={16} />
                      </motion.a>
                    )}
                    {p.project_link && (
                      <motion.a href={p.project_link} target="_blank" rel="noopener noreferrer"
                        whileHover={{ scale:1.15 }} whileTap={{ scale:0.9 }}
                        initial={{ y:10, opacity:0 }} variants={{ hover:{ y:0, opacity:1 } }} transition={{ delay:0.1 }}
                        className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-cyan-500 hover:border-cyan-500 transition-colors backdrop-blur-sm">
                        <FiEye size={16} />
                      </motion.a>
                    )}
                  </motion.div>

                  {p.featured && (
                    <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-amber-400/20 border border-amber-400/30 z-10">
                      <FiStar size={10} className="text-amber-400 fill-amber-400" /><span className="text-xs font-mono text-amber-400">Featured</span>
                    </div>
                  )}
                </motion.div>

                <div className="p-5">
                  <h3 className="text-white font-semibold mb-2 group-hover:text-cyan-400 transition-colors duration-300">{p.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">{p.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {p.tech_stack.map(t => <span key={t} className="tech-tag">{t}</span>)}
                  </div>
                  <div className="flex gap-3 pt-3 border-t border-[var(--border)]">
                    {p.github_link && <a href={p.github_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors hover:-translate-y-0.5 duration-200"><FiGithub size={13}/>Code</a>}
                    {p.project_link && <a href={p.project_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition-colors hover:-translate-y-0.5 duration-200"><FiExternalLink size={13}/>Live Demo</a>}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
