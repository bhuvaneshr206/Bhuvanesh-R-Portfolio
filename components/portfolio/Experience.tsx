"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { Experience } from "@/lib/types";
import { FiBriefcase, FiCalendar, FiMapPin } from "react-icons/fi";
import { fadeUp, fadeLeft, viewport, ease } from "@/lib/animations";

const FALLBACK: Experience[] = [
  { id:"1", role:"Freelance Full Stack Developer", company:"Self Employed", location:"Remote", start_date:"2023-01", end_date:"", is_current:true, description:"Building web apps, IoT dashboards and business websites for clients. Delivered 5+ projects on time using Next.js, Supabase and ESP32." },
];

function TimelineLine() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
  return (
    <div ref={ref} className="absolute left-5 sm:left-6 top-0 bottom-0 w-px overflow-hidden">
      <motion.div className="h-full w-full origin-top"
        style={{ background:"linear-gradient(to bottom,rgba(34,211,238,0.5),rgba(34,211,238,0.15),transparent)" }}
        initial={{ scaleY: 0 }} animate={{ scaleY: inView ? 1 : 0 }}
        transition={{ duration: 1.4, ease }} />
    </div>
  );
}

export default function ExperienceSection({ experience }: { experience: Experience[] }) {
  const list = experience?.length > 0 ? experience : FALLBACK;
  return (
    <section id="experience" className="py-20 sm:py-28 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} className="text-center mb-10 sm:mb-14">
          <span className="section-tag"><span className="w-6 h-px bg-cyan-400 inline-block" />Experience</span>
          <h2 className="section-title mt-3 sm:mt-4">Work <span className="gradient-text">History</span></h2>
        </motion.div>
        <div className="relative">
          <TimelineLine />
          <div className="space-y-6 sm:space-y-8">
            {list.map((exp, i) => (
              <motion.div key={exp.id} variants={fadeLeft} custom={i * 0.15} initial="hidden" whileInView="visible" viewport={viewport}
                className="relative pl-14 sm:pl-16">
                <motion.div whileHover={{ scale: 1.12, backgroundColor: "rgba(34,211,238,0.2)" }}
                  className="absolute left-0 w-10 sm:w-12 h-10 sm:h-12 rounded-xl sm:rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center transition-colors">
                  <FiBriefcase size={16} className="text-cyan-400" />
                </motion.div>
                <motion.div whileHover={{ y: -4, boxShadow: "0 16px 50px rgba(0,0,0,0.4), 0 0 20px rgba(34,211,238,0.05)" }}
                  transition={{ duration: 0.3, ease }}
                  className="card p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3 mb-3">
                    <div>
                      <h3 className="text-white font-semibold text-base sm:text-lg">{exp.role}</h3>
                      <p className="text-cyan-400 text-sm font-medium">{exp.company}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 sm:shrink-0">
                      {exp.location && <span className="inline-flex items-center gap-1 text-xs text-slate-500"><FiMapPin size={11}/>{exp.location}</span>}
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono ${exp.is_current ? "bg-green-400/10 text-green-400 border border-green-400/20" : "bg-slate-800 text-slate-400 border border-slate-700"}`}>
                        {exp.is_current && <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />}
                        <FiCalendar size={10}/>{exp.is_current ? `${exp.start_date} – Present` : `${exp.start_date} – ${exp.end_date}`}
                      </span>
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">{exp.description}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
