"use client";
import { motion } from "framer-motion";
import type { Certificate } from "@/lib/types";
import { FiAward, FiExternalLink } from "react-icons/fi";
import { fadeUp, staggerContainer, staggerItem, viewport, ease } from "@/lib/animations";

const FALLBACK: Certificate[] = [
  { id:"1", title:"The Joy of Computing using Python", issued_by:"NPTEL", issued_date:"2023-04-01", credential_url:"#" },
  { id:"2", title:"Introduction to IoT", issued_by:"NPTEL", issued_date:"2023-10-01", credential_url:"#" },
  { id:"3", title:"Full Stack Web Development", issued_by:"Udemy", issued_date:"2024-01-01", credential_url:"#" },
];

export default function Certificates({ certificates }: { certificates: Certificate[] }) {
  const list = certificates.length ? certificates : FALLBACK;
  return (
    <section id="certificates" className="py-16 sm:py-28 px-4 sm:px-5">
      <div className="max-w-5xl mx-auto">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} className="text-center mb-8 sm:mb-14">
          <span className="section-tag"><span className="w-6 h-px bg-cyan-400" />Certificates</span>
          <h2 className="section-title mt-4">My <span className="gradient-text">Certifications</span></h2>
        </motion.div>
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewport}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map(c => (
            <motion.div key={c.id} variants={staggerItem}
              whileHover={{ y: -6, rotateX: 3, boxShadow: "0 20px 50px rgba(0,0,0,0.4), 0 0 20px rgba(245,158,11,0.1)" }}
              transition={{ duration: 0.35, ease }}
              style={{ transformPerspective: 800 }}
              className="card p-5 hover:border-amber-400/30">
              <div className="flex items-start gap-4">
                <motion.div whileHover={{ scale: 1.15, rotate: -5 }}
                  className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 transition-colors hover:bg-amber-500/20">
                  <FiAward size={16} className="text-amber-400" />
                </motion.div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm leading-snug">{c.title}</p>
                  <p className="text-cyan-400 text-xs mt-1">{c.issued_by}</p>
                  {c.issued_date && <p className="text-slate-500 text-xs mt-0.5">{new Date(c.issued_date).toLocaleDateString("en-IN",{month:"short",year:"numeric"})}</p>}
                  {c.credential_url && (
                    <motion.a href={c.credential_url} target="_blank" rel="noopener noreferrer"
                      whileHover={{ x: 3 }} transition={{ duration: 0.2 }}
                      className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-400 transition-colors mt-2">
                      <FiExternalLink size={11}/>View Certificate
                    </motion.a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
