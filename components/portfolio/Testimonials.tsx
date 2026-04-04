"use client";
import { motion } from "framer-motion";
import type { Testimonial } from "@/lib/types";
import { FiStar } from "react-icons/fi";
import { fadeUp, staggerContainer, staggerItem, viewport, ease } from "@/lib/animations";

const FALLBACK: Testimonial[] = [
  { id:"1", name:"Rahul Sharma",  role:"Founder", company:"StartupXYZ", message:"Bhuvanesh delivered our web app on time with excellent quality. His understanding of both IoT and web is impressive!", rating:5 },
  { id:"2", name:"Priya Nair",    role:"Manager", company:"TechCorp",   message:"Professional, responsive and technically strong. Highly recommend for any web or IoT project.", rating:5 },
  { id:"3", name:"Ankit Mehta",   role:"CEO",     company:"DigitalCo",  message:"Built our complete dashboard from scratch. Outstanding work and communication throughout.", rating:5 },
];

export default function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const list = testimonials.length ? testimonials : FALLBACK;
  return (
    <section id="testimonials" className="py-16 sm:py-28 px-4 sm:px-5 bg-[#0a0c16]">
      <div className="max-w-6xl mx-auto">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} className="text-center mb-8 sm:mb-14">
          <span className="section-tag"><span className="w-6 h-px bg-cyan-400" />Testimonials</span>
          <h2 className="section-title mt-4">What Clients <span className="gradient-text">Say</span></h2>
        </motion.div>
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewport}
          className="grid md:grid-cols-3 gap-5">
          {list.map(t => (
            <motion.div key={t.id} variants={staggerItem}
              whileHover={{ y: -6, boxShadow: "0 20px 60px rgba(0,0,0,0.4), 0 0 20px rgba(34,211,238,0.05)" }}
              transition={{ duration: 0.35, ease }}
              className="card p-6 group">
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_,si) => (
                  <motion.div key={si} whileHover={{ scale: 1.3, rotate: 15 }}
                    transition={{ delay: si * 0.04, duration: 0.2 }}>
                    <FiStar size={13} className={si < t.rating ? "text-amber-400 fill-amber-400" : "text-slate-700"} />
                  </motion.div>
                ))}
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-5 italic">&ldquo;{t.message}&rdquo;</p>
              <div className="flex items-center gap-3 pt-4 border-t border-[var(--border)]">
                <motion.div whileHover={{ scale: 1.12 }}
                  className="w-9 h-9 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center transition-colors group-hover:bg-cyan-500/30">
                  <span className="text-cyan-400 font-bold text-sm">{t.name[0]}</span>
                </motion.div>
                <div>
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  <p className="text-slate-500 text-xs">{t.role} · {t.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
