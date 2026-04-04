"use client";
import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import type { Skill } from "@/lib/types";
import { fadeUp, staggerContainer, staggerItem, viewport } from "@/lib/animations";

const FALLBACK: Skill[] = [
  { id:"1", name:"React / Next.js", level:90, category:"Frontend" },
  { id:"2", name:"TypeScript", level:85, category:"Frontend" },
  { id:"3", name:"Tailwind CSS", level:90, category:"Frontend" },
  { id:"4", name:"Node.js / Express", level:78, category:"Backend" },
  { id:"5", name:"Supabase / Firebase", level:82, category:"Backend" },
  { id:"6", name:"REST APIs", level:80, category:"Backend" },
  { id:"7", name:"ESP32 / Arduino", level:88, category:"Hardware & IoT" },
  { id:"8", name:"Sensors & Actuators", level:85, category:"Hardware & IoT" },
  { id:"9", name:"IoT Protocols (MQTT)", level:75, category:"Hardware & IoT" },
  { id:"10", name:"Figma / UI Design", level:72, category:"Design" },
];

const COLORS: Record<string,string> = {
  "Frontend":"from-cyan-500 to-cyan-400","Backend":"from-violet-500 to-violet-400",
  "Hardware & IoT":"from-orange-500 to-amber-400","Design":"from-pink-500 to-pink-400",
};

function SkillBar({ level, color }: { level: number; color: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  return (
    <div ref={ref} className="skill-bar">
      <motion.div className={`skill-bar-fill bg-gradient-to-r ${color}`}
        initial={{ width: 0 }} animate={{ width: inView ? `${level}%` : 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }} />
    </div>
  );
}

export default function Skills({ skills }: { skills: Skill[] }) {
  const list = skills.length ? skills : FALLBACK;
  const categories = Array.from(new Set(list.map(s => s.category)));

  return (
    <section id="skills" className="py-16 sm:py-28 px-4 sm:px-5">
      <div className="max-w-6xl mx-auto">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} className="text-center mb-8 sm:mb-14">
          <span className="section-tag"><span className="w-6 h-px bg-cyan-400" />Skills</span>
          <h2 className="section-title mt-4">My <span className="gradient-text">Tech Stack</span></h2>
        </motion.div>

        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewport}
          className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
          {categories.map(cat => (
            <motion.div key={cat} variants={staggerItem}
              whileHover={{ y: -5, boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}
              transition={{ duration: 0.3 }}
              className="card p-6">
              <p className="text-xs font-mono text-cyan-400 mb-5 uppercase tracking-widest">{cat}</p>
              <div className="space-y-5">
                {list.filter(s => s.category === cat).map(skill => (
                  <div key={skill.id} className="group">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-slate-200 group-hover:text-white transition-colors">{skill.name}</span>
                      <motion.span className="text-xs font-mono text-slate-500 group-hover:text-cyan-400 transition-colors">{skill.level}%</motion.span>
                    </div>
                    <SkillBar level={skill.level} color={COLORS[cat] ?? "from-cyan-500 to-cyan-400"} />
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={fadeUp} custom={0.3} initial="hidden" whileInView="visible" viewport={viewport}
          className="text-center mt-14">
          <p className="text-xs font-mono text-slate-600 tracking-widest mb-5">ALSO FAMILIAR WITH</p>
          <div className="flex flex-wrap justify-center gap-2">
            {["Docker","Git","GitHub","Linux","CI/CD","Vercel","PostgreSQL","MQTT","BLE","WiFi","Python","C/C++"].map((t,i) => (
              <motion.span key={t} className="tech-tag" whileHover={{ y: -3, scale: 1.05 }}
                initial={{ opacity:0, y:10 }} whileInView={{ opacity:1, y:0 }}
                transition={{ delay: i * 0.04, duration: 0.35 }} viewport={{ once:true }}>
                {t}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
