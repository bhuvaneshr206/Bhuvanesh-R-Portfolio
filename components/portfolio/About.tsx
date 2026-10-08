"use client";
import { motion } from "framer-motion";
import type { Profile } from "@/lib/types";
import { fadeLeft, viewport } from "@/lib/animations";

export default function About({ profile }: { profile: Profile | null }) {
  const bio = profile?.bio ?? `I'm Bhuvanesh, an Embedded Systems and Full Stack Developer passionate about building real-world solutions that connect hardware with modern software.\n\nI specialize in IoT systems using ESP32 and sensors, integrated with mobile apps and web dashboards. I also build full-stack web applications using Next.js, React, and Supabase — delivering end-to-end digital products for clients.`;

  return (
    <section id="about" className="py-16 sm:py-28 px-4 sm:px-5">
      <div className="max-w-3xl mx-auto">

        {/* Text */}
        <motion.div variants={fadeLeft} initial="hidden" whileInView="visible" viewport={viewport}>
          <span className="section-tag"><span className="w-6 h-px bg-cyan-400" />About Me</span>
          <h2 className="section-title mt-4">Hardware meets <span className="gradient-text">Software</span></h2>
          <div className="mt-6 space-y-4">
            {bio.trim().split("\n\n").map((p, i) => <p key={i} className="text-slate-400 text-sm leading-relaxed">{p.trim()}</p>)}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
