"use client";
import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import type { Profile } from "@/lib/types";
import { FiCpu, FiCode, FiZap, FiLayers } from "react-icons/fi";
import { fadeUp, fadeLeft, fadeRight, staggerContainer, staggerItem, cardHover, viewport, ease } from "@/lib/animations";

const TRAITS = [
  { icon:FiCpu,    title:"IoT & Embedded",  desc:"ESP32, sensors, real-time systems",    cls:"bg-cyan-500/10 border-cyan-500/20 text-cyan-400 group-hover:bg-cyan-500/25" },
  { icon:FiCode,   title:"Full Stack Web",  desc:"Next.js, React, Node.js backends",     cls:"bg-violet-500/10 border-violet-500/20 text-violet-400 group-hover:bg-violet-500/25" },
  { icon:FiZap,    title:"Fast Delivery",   desc:"Clean code, on-time projects",         cls:"bg-amber-500/10 border-amber-500/20 text-amber-400 group-hover:bg-amber-500/25" },
  { icon:FiLayers, title:"End-to-End",      desc:"Hardware to cloud integration",        cls:"bg-green-500/10 border-green-500/20 text-green-400 group-hover:bg-green-500/25" },
];

function CountUp({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  useEffect(() => {
    if (!inView) return;
    let cur = 0; const step = end / 40;
    const id = setInterval(() => { cur = Math.min(cur + step, end); setCount(Math.floor(cur)); if (cur >= end) clearInterval(id); }, 30);
    return () => clearInterval(id);
  }, [inView, end]);
  return <span ref={ref}>{count}{suffix}</span>;
}

export default function About({ profile }: { profile: Profile | null }) {
  const bio = profile?.bio ?? `I'm Bhuvanesh, an Embedded Systems and Full Stack Developer passionate about building real-world solutions that connect hardware with modern software.\n\nI specialize in IoT systems using ESP32 and sensors, integrated with mobile apps and web dashboards. I also build full-stack web applications using Next.js, React, and Supabase — delivering end-to-end digital products for clients.`;

  return (
    <section id="about" className="py-16 sm:py-28 px-4 sm:px-5">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

        {/* Text */}
        <motion.div variants={fadeLeft} initial="hidden" whileInView="visible" viewport={viewport}>
          <span className="section-tag"><span className="w-6 h-px bg-cyan-400" />About Me</span>
          <h2 className="section-title mt-4">Hardware meets <span className="gradient-text">Software</span></h2>
          <div className="mt-6 space-y-4">
            {bio.trim().split("\n\n").map((p, i) => <p key={i} className="text-slate-400 text-sm leading-relaxed">{p.trim()}</p>)}
          </div>
          <div className="flex gap-8 mt-10 pt-8 border-t border-[var(--border)]">
            {[["5","+","Projects Built"],["2","+","Years Experience"],["100","%","Client Focus"]].map(([v,s,l]) => (
              <div key={l}>
                <p className="text-2xl font-bold gradient-text"><CountUp end={parseInt(v)} suffix={s} /></p>
                <p className="text-xs text-slate-500 mt-0.5 uppercase tracking-wide">{l}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Trait cards */}
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewport}
          className="grid grid-cols-2 gap-4">
          {TRAITS.map(({ icon:Icon, title, desc, cls }) => (
            <motion.div key={title} variants={staggerItem}
              whileHover="hover" initial="rest" animate="rest"
              // @ts-ignore
              variants={{ ...staggerItem, rest:cardHover.rest, hover:cardHover.hover }}
              className="card p-5 group cursor-default">
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 transition-all duration-300 ${cls}`}>
                <Icon size={18} />
              </div>
              <p className="text-sm font-semibold text-white">{title}</p>
              <p className="text-xs text-slate-500 mt-1">{desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
