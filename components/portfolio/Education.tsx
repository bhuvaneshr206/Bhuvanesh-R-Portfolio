"use client";
import { motion } from "framer-motion";
import type { Education } from "@/lib/types";
import { FiBook } from "react-icons/fi";
import { fadeUp, fadeRight, staggerContainer, staggerItem, viewport, ease } from "@/lib/animations";

const FALLBACK: Education[] = [
  { id:"1", degree:"Bachelor of Engineering", institution:"Anna University", field_of_study:"Computer Science & Engineering", start_year:"2020", end_year:"2024", grade:"8.0 CGPA", description:"Core subjects: Data Structures, DBMS, OS, Computer Networks, Embedded Systems, IoT." },
  { id:"2", degree:"Higher Secondary (12th)", institution:"Government Higher Secondary School", field_of_study:"Computer Science", start_year:"2019", end_year:"2020", grade:"88%", description:"Computer Science with Math & Physics. Strong foundation in programming." },
];

export default function EducationSection({ education }: { education: Education[] }) {
  const list = education.length ? education : FALLBACK;
  return (
    <section id="education" className="py-16 sm:py-28 px-4 sm:px-5 bg-[#0a0c16]">
      <div className="max-w-4xl mx-auto">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} className="text-center mb-8 sm:mb-14">
          <span className="section-tag"><span className="w-6 h-px bg-cyan-400" />Education</span>
          <h2 className="section-title mt-4">Academic <span className="gradient-text">Background</span></h2>
        </motion.div>
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewport} className="space-y-5">
          {list.map(edu => (
            <motion.div key={edu.id} variants={fadeRight}
              whileHover={{ y: -4, boxShadow: "0 16px 50px rgba(0,0,0,0.35)" }}
              transition={{ duration: 0.3, ease }}
              className="card p-6">
              <div className="flex gap-5">
                <motion.div whileHover={{ scale: 1.12, backgroundColor: "rgba(139,92,246,0.2)" }}
                  className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0 transition-colors">
                  <FiBook size={18} className="text-violet-400" />
                </motion.div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                    <div>
                      <h3 className="text-white font-semibold">{edu.degree}</h3>
                      <p className="text-cyan-400 text-sm">{edu.institution}</p>
                    </div>
                    <div className="text-right">
                      <span className="px-3 py-1 rounded-full text-xs font-mono bg-slate-800 text-slate-400 border border-slate-700">{edu.start_year} – {edu.end_year}</span>
                      {edu.grade && <p className="text-xs text-green-400 font-mono mt-1">{edu.grade}</p>}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mb-2">{edu.field_of_study}</p>
                  {edu.description && <p className="text-slate-400 text-sm">{edu.description}</p>}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
