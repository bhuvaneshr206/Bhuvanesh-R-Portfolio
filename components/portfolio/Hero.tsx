"use client";
import Image from "next/image";
import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FiGithub, FiLinkedin, FiDownload, FiArrowDown, FiMail } from "react-icons/fi";
import type { Profile } from "@/lib/types";
import { fadeUp, scaleIn, ease } from "@/lib/animations";

/* Magnetic letter hover */
function MagneticText({ text, className = "", glowColor = "rgba(34,211,238,1)" }: { text: string; className?: string; glowColor?: string }) {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <span className={className} aria-label={text}>
      {text.split("").map((char, i) => {
        const d = hovered !== null ? Math.abs(hovered - i) : 99;
        return (
          <motion.span key={i} onHoverStart={() => setHovered(i)} onHoverEnd={() => setHovered(null)}
            animate={{
              y:     d === 0 ? -12 : d === 1 ? -6 : d === 2 ? -3 : 0,
              scale: d === 0 ? 1.4  : d === 1 ? 1.2 : d === 2 ? 1.08 : 1,
              color: d === 0 ? glowColor : d === 1 ? "rgba(34,211,238,0.7)" : undefined,
              textShadow: d === 0 ? `0 0 20px ${glowColor},0 0 40px ${glowColor}` : d === 1 ? `0 0 12px ${glowColor}` : "none",
            }}
            transition={{ duration: d === 0 ? 0.08 : 0.3, ease }}
            className="inline-block cursor-default select-none" style={{ display: "inline-block" }}>
            {char === " " ? "\u00A0" : char}
          </motion.span>
        );
      })}
    </span>
  );
}

/* Scramble effect */
function ScrambleText({ text, className = "" }: { text: string; className?: string }) {
  const [display, setDisplay] = useState(text);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$";
  const scramble = () => {
    let iter = 0;
    const id = setInterval(() => {
      setDisplay(text.split("").map((l, idx) => idx < iter ? text[idx] : chars[Math.floor(Math.random() * chars.length)]).join(""));
      if (iter >= text.length) clearInterval(id);
      iter += 0.5;
    }, 28);
  };
  return <span className={`font-mono cursor-default ${className}`} onMouseEnter={scramble}>{display}</span>;
}

export default function Hero({ profile }: { profile: Profile | null }) {
  const name = profile?.name ?? "Bhuvanesh R";
  const tagline = profile?.tagline ?? "Embedded Systems & Full Stack Developer";
  const firstName = name.split(" ")[0];
  const { scrollY } = useScroll();
  const avatarY = useTransform(scrollY, [0, 400], [0, -40]);
  const bgY     = useTransform(scrollY, [0, 600], [0, 80]);

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 pt-16">

      {/* Parallax grid bg */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y: bgY, backgroundImage: "linear-gradient(rgba(34,211,238,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(34,211,238,0.03) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />

      {/* Glow blobs */}
      <div className="absolute top-1/3 left-1/4 w-72 sm:w-96 h-72 sm:h-96 rounded-full pointer-events-none blur-3xl" style={{ background: "radial-gradient(circle,rgba(34,211,238,0.07) 0%,transparent 70%)" }} />
      <div className="absolute bottom-1/3 right-1/4 w-64 sm:w-80 h-64 sm:h-80 rounded-full pointer-events-none blur-3xl" style={{ background: "radial-gradient(circle,rgba(129,140,248,0.05) 0%,transparent 70%)" }} />

      <div className="relative max-w-6xl mx-auto w-full grid lg:grid-cols-2 gap-10 lg:gap-16 items-center py-12 sm:py-16">

        {/* TEXT SIDE */}
        <div className="order-2 lg:order-1 text-center lg:text-left">
          <motion.div variants={fadeUp} custom={0} initial="hidden" animate="visible"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/5 mb-5">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <ScrambleText text="Available for work" className="text-xs text-green-400" />
          </motion.div>

          <motion.h1 variants={fadeUp} custom={0.1} initial="hidden" animate="visible"
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-none tracking-tight">
            <MagneticText text="Hi, I'm" className="text-white block" glowColor="rgba(255,255,255,1)" />
            <MagneticText text={firstName} className="gradient-text block mt-1" glowColor="rgba(34,211,238,1)" />
          </motion.h1>

          <motion.p variants={fadeUp} custom={0.2} initial="hidden" animate="visible"
            className="mt-4 text-lg sm:text-xl md:text-2xl text-slate-300 font-medium">
            <ScrambleText text={tagline} className="text-slate-300 font-medium" />
          </motion.p>

          <motion.p variants={fadeUp} custom={0.3} initial="hidden" animate="visible"
            className="mt-3 text-slate-500 text-sm leading-relaxed max-w-lg mx-auto lg:mx-0">
            {profile?.bio ? profile.bio.slice(0, 160) + "…" : "Building real-world solutions with IoT (ESP32, sensors) and modern web technologies. Passionate about creating impactful products that bridge hardware and software."}
          </motion.p>

          <motion.div variants={fadeUp} custom={0.4} initial="hidden" animate="visible"
            className="flex flex-wrap gap-3 mt-7 justify-center lg:justify-start">
            <motion.a href="#projects" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="btn-primary">View Projects</motion.a>
            <motion.a href="#contact"  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="btn-ghost">Contact Me</motion.a>
            {profile?.resume_url && (
              <motion.a href={profile.resume_url} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="btn-outline">
                <FiDownload size={14} /> Resume
              </motion.a>
            )}
          </motion.div>

          <motion.div variants={fadeUp} custom={0.5} initial="hidden" animate="visible"
            className="flex items-center gap-3 mt-6 justify-center lg:justify-start">
            {profile?.github_url && (
              <motion.a href={profile.github_url} target="_blank" rel="noopener noreferrer"
                whileHover={{ y: -3, scale: 1.1, boxShadow: "0 8px 20px rgba(34,211,238,0.2)" }} whileTap={{ scale: 0.95 }}
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-700 text-slate-400 hover:text-cyan-400 hover:border-cyan-400/40 transition-colors">
                <FiGithub size={18} />
              </motion.a>
            )}
            {profile?.linkedin_url && (
              <motion.a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer"
                whileHover={{ y: -3, scale: 1.1, boxShadow: "0 8px 20px rgba(34,211,238,0.2)" }} whileTap={{ scale: 0.95 }}
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-700 text-slate-400 hover:text-cyan-400 hover:border-cyan-400/40 transition-colors">
                <FiLinkedin size={18} />
              </motion.a>
            )}
            <motion.a href={`mailto:${profile?.email ?? "bhuvaneshr206@gmail.com"}`}
              whileHover={{ y: -3, scale: 1.1, boxShadow: "0 8px 20px rgba(34,211,238,0.2)" }} whileTap={{ scale: 0.95 }}
              className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-700 text-slate-400 hover:text-cyan-400 hover:border-cyan-400/40 transition-colors">
              <FiMail size={18} />
            </motion.a>
          </motion.div>
        </div>

        {/* AVATAR SIDE */}
        <motion.div variants={scaleIn} custom={0.3} initial="hidden" animate="visible"
          className="flex justify-center order-1 lg:order-2">
          <motion.div style={{ y: avatarY }} className="relative">
            {/* Rings */}
            <motion.div animate={{ scale: [1, 1.06, 1], opacity: [0.3, 0.7, 0.3] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="absolute -inset-6 rounded-full border border-cyan-400/20" />
            <motion.div animate={{ scale: [1, 1.04, 1], opacity: [0.15, 0.4, 0.15] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.5 }}
              className="absolute -inset-12 rounded-full border border-cyan-400/10" />

            {/* Photo */}
            <motion.div whileHover={{ scale: 1.04 }} transition={{ duration: 0.4, ease }}
              animate={{ y: [0, -10, 0] }}
              className="relative overflow-hidden border-2 border-cyan-400/20 animate-glow-pulse"
              style={{ animationDuration: "6s", width: "clamp(180px,40vw,340px)", height: "clamp(180px,40vw,340px)", borderRadius: "50%", boxShadow: "0 0 80px rgba(34,211,238,0.15)" }}>
              {profile?.avatar_url ? (
                <motion.div className="w-full h-full" whileHover={{ scale: 1.08 }} transition={{ duration: 0.5, ease }}>
                  <Image src={profile.avatar_url} alt={name} fill
                    sizes="(max-width:480px) 180px,(max-width:768px) 220px,340px"
                    className="object-cover object-center" priority unoptimized />
                </motion.div>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                  <span className="text-7xl sm:text-8xl font-bold text-cyan-400/20">{name[0]}</span>
                </div>
              )}
            </motion.div>

            {/* Floating badges */}
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
              className="absolute -bottom-4 -right-2 sm:-right-6 card px-3 sm:px-4 py-2 shadow-xl">
              <ScrambleText text="</> IoT + Web Dev" className="text-xs text-cyan-400" />
            </motion.div>
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.5 }}
              className="absolute -top-4 -left-2 sm:-left-6 card px-3 sm:px-4 py-2 shadow-xl">
              <ScrambleText text="ESP32 · React · Next.js" className="text-xs text-violet-400" />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-xs font-mono text-slate-600 tracking-widest">SCROLL</span>
        <FiArrowDown size={14} className="text-slate-600" />
      </motion.div>
    </section>
  );
}
