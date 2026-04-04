"use client";
import { motion } from "framer-motion";
import type { Service } from "@/lib/types";
import { FiCode, FiLayout, FiSmartphone, FiDatabase, FiShoppingCart, FiCpu } from "react-icons/fi";
import { fadeUp, staggerContainer, staggerItem, viewport, ease } from "@/lib/animations";

const ICON_MAP: Record<string, React.ElementType> = { code:FiCode, layout:FiLayout, smartphone:FiSmartphone, database:FiDatabase, shopping:FiShoppingCart, cpu:FiCpu };
const FALLBACK: Service[] = [
  { id:"1", title:"Web Development", description:"Full-stack websites using Next.js, React and Supabase. Portfolio, business, e-commerce sites.", icon:"code", price_range:"₹5,000 – ₹50,000" },
  { id:"2", title:"IoT System Development", description:"ESP32-based IoT solutions with sensor integration, real-time data and mobile dashboards.", icon:"cpu", price_range:"₹10,000 – ₹80,000" },
  { id:"3", title:"Mobile-Responsive Design", description:"Pixel-perfect, fast-loading sites optimized for all screen sizes and devices.", icon:"smartphone", price_range:"₹4,000 – ₹25,000" },
  { id:"4", title:"App + Backend Integration", description:"Connect your frontend to Supabase, Firebase or custom REST APIs.", icon:"database", price_range:"₹5,000 – ₹30,000" },
  { id:"5", title:"Custom Dashboards", description:"Admin panels and analytics dashboards with real-time data visualization.", icon:"layout", price_range:"₹8,000 – ₹40,000" },
  { id:"6", title:"E-Commerce Store", description:"Full online store with product management, cart, payments and order tracking.", icon:"shopping", price_range:"₹15,000 – ₹80,000" },
];

export default function Services({ services }: { services: Service[] }) {
  const list = services.length ? services : FALLBACK;
  return (
    <section id="services" className="py-16 sm:py-28 px-4 sm:px-5 bg-[#0a0c16]">
      <div className="max-w-6xl mx-auto">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} className="text-center mb-8 sm:mb-14">
          <span className="section-tag"><span className="w-6 h-px bg-cyan-400" />Services</span>
          <h2 className="section-title mt-4">What I <span className="gradient-text">Offer</span></h2>
          <p className="text-slate-400 text-sm mt-4 max-w-lg mx-auto">Professional services tailored to help your business and ideas come to life.</p>
        </motion.div>
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewport}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {list.map(s => {
            const Icon = ICON_MAP[s.icon] ?? FiCode;
            return (
              <motion.div key={s.id} variants={staggerItem}
                whileHover={{ y: -6, boxShadow: "0 20px 60px rgba(0,0,0,0.4), 0 0 30px rgba(34,211,238,0.05)" }}
                transition={{ duration: 0.3, ease }}
                className="card p-6 group">
                <motion.div whileHover={{ scale: 1.15, rotate: 5 }} transition={{ duration: 0.3, ease }}
                  className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-5 group-hover:bg-cyan-500/20 transition-colors">
                  <Icon size={20} className="text-cyan-400" />
                </motion.div>
                <h3 className="text-white font-semibold mb-2 group-hover:text-cyan-400 transition-colors duration-300">{s.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">{s.description}</p>
                {s.price_range && <div className="pt-4 border-t border-[var(--border)]"><span className="text-xs font-mono text-cyan-400">{s.price_range}</span></div>}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
