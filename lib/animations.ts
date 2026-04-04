// ─────────────────────────────────────────────
//  Shared Framer Motion variants & helpers
// ─────────────────────────────────────────────

export const ease = [0.16, 1, 0.3, 1] as const;   // custom spring-like ease

// ── Fade up (sections, headings)
export const fadeUp = {
  hidden:  { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.65, ease, delay },
  }),
};

// ── Fade left
export const fadeLeft = {
  hidden:  { opacity: 0, x: -40 },
  visible: (delay = 0) => ({
    opacity: 1, x: 0,
    transition: { duration: 0.65, ease, delay },
  }),
};

// ── Fade right
export const fadeRight = {
  hidden:  { opacity: 0, x: 40 },
  visible: (delay = 0) => ({
    opacity: 1, x: 0,
    transition: { duration: 0.65, ease, delay },
  }),
};

// ── Scale in
export const scaleIn = {
  hidden:  { opacity: 0, scale: 0.88 },
  visible: (delay = 0) => ({
    opacity: 1, scale: 1,
    transition: { duration: 0.6, ease, delay },
  }),
};

// ── Stagger container (parent)
export const staggerContainer = {
  hidden:  {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

// ── Stagger item (child)
export const staggerItem = {
  hidden:  { opacity: 0, y: 30 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.55, ease },
  },
};

// ── Card hover
export const cardHover = {
  rest:  { y: 0,  boxShadow: "0 0 0px rgba(34,211,238,0)" },
  hover: { y: -6, boxShadow: "0 20px 60px rgba(0,0,0,0.4), 0 0 30px rgba(34,211,238,0.06)",
    transition: { duration: 0.35, ease } },
};

// ── Image hover
export const imgHover = {
  rest:  { scale: 1,    filter: "brightness(1)" },
  hover: { scale: 1.08, filter: "brightness(0.65)",
    transition: { duration: 0.55, ease } },
};

// ── Section heading line (decorative)
export const lineGrow = {
  hidden:  { scaleX: 0, originX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.7, ease, delay: 0.2 } },
};

// ── Viewport settings for useInView / whileInView
export const viewport = { once: true, amount: 0.15 };
