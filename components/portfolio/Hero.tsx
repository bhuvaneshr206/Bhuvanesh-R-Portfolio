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
  const { scrollY }
