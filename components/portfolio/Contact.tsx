"use client";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import type { Profile } from "@/lib/types";
import { FiMail, FiSend, FiGithub, FiLinkedin, FiMapPin, FiPhone } from "react-icons/fi";
import { createMessage } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { fadeUp, fadeLeft, fadeRight, staggerContainer, staggerItem, viewport, ease } from "@/lib/animations";

export default function Contact({ profile }: { profile: Profile | null }) {
  const [form, setForm] = useState({ name:"", email:"", message:"" });
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { toast.error("Please fill all fields"); return; }
    setSending(true);
    const { error } = await createMessage(form);
    setSending(false);
    if (error) { toast.error("Failed to send. Try again."); return; }
    toast.success("Message sent! I'll reply soon 🎉");
    setForm({ name:"", email:"", message:"" });
  }

  return (
    <section id="contact" className="py-16 sm:py-28 px-4 sm:px-5">
      <div className="max-w-5xl mx-auto">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} className="text-center mb-8 sm:mb-14">
          <span className="section-tag"><span className="w-6 h-px bg-cyan-400" />Contact</span>
          <h2 className="section-title mt-4">Let&apos;s <span className="gradient-text">Work Together</span></h2>
          <p className="text-slate-400 text-sm mt-4 max-w-md mx-auto">Have a project? I&apos;d love to hear about it. Send me a message!</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
          {/* Info */}
          <motion.div variants={fadeLeft} initial="hidden" whileInView="visible" viewport={viewport} className="space-y-5">
            {[
              { icon:FiMail, label:"Email", val:profile?.email ?? "bhuvaneshr206@gmail.com", href:`mailto:${profile?.email ?? "bhuvaneshr206@gmail.com"}` },
              ...(profile?.phone ? [{ icon:FiPhone, label:"Phone", val:profile.phone, href:`tel:${profile.phone}` }] : []),
              ...(profile?.location ? [{ icon:FiMapPin, label:"Location", val:profile.location, href:"#" }] : []),
            ].map(({ icon:Icon, label, val, href }) => (
              <motion.div key={label} whileHover={{ x: 4 }} transition={{ duration: 0.25 }}
                className="card p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0"><Icon size={16} className="text-cyan-400" /></div>
                <div><p className="text-xs text-slate-500 uppercase tracking-wider">{label}</p><a href={href} className="text-sm text-white hover:text-cyan-400 transition-colors">{val}</a></div>
              </motion.div>
            ))}

            <div className="flex gap-3">
              {profile?.github_url && (
                <motion.a href={profile.github_url} target="_blank" rel="noopener noreferrer"
                  whileHover={{ y: -3 }} transition={{ duration: 0.25 }}
                  className="flex-1 card p-4 flex items-center gap-3 hover:border-cyan-400/30 group transition-colors">
                  <FiGithub size={18} className="text-slate-400 group-hover:text-cyan-400 transition-colors" /><span className="text-sm text-slate-400 group-hover:text-white transition-colors">GitHub</span>
                </motion.a>
              )}
              {profile?.linkedin_url && (
                <motion.a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer"
                  whileHover={{ y: -3 }} transition={{ duration: 0.25 }}
                  className="flex-1 card p-4 flex items-center gap-3 hover:border-cyan-400/30 group transition-colors">
                  <FiLinkedin size={18} className="text-slate-400 group-hover:text-cyan-400 transition-colors" /><span className="text-sm text-slate-400 group-hover:text-white transition-colors">LinkedIn</span>
                </motion.a>
              )}
            </div>

            <motion.div whileHover={{ borderColor: "rgba(34,211,238,0.3)" }} className="card p-5 border-cyan-400/20 transition-colors">
              <div className="flex items-center gap-2 mb-2"><span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /><span className="text-xs font-mono text-green-400">Available for work</span></div>
              <p className="text-xs text-slate-500">Open to freelance projects, full-time roles and collaborations.</p>
            </motion.div>
          </motion.div>

          {/* Form */}
          <motion.div variants={fadeRight} initial="hidden" whileInView="visible" viewport={viewport}>
            <form onSubmit={handleSubmit} className="card p-4 sm:p-7 space-y-5">
              {[
                { id:"name",    label:"Your Name",      type:"text",  placeholder:"John Doe",           value:form.name,    key:"name"    },
                { id:"email",   label:"Email Address",  type:"email", placeholder:"john@example.com",   value:form.email,   key:"email"   },
              ].map(f => (
                <div key={f.id}>
                  <label className="label">{f.label}</label>
                  <motion.input type={f.type} value={f.value}
                    onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    placeholder={f.placeholder} className="input"
                    whileFocus={{ scale: 1.01 }} transition={{ duration: 0.2 }} />
                </div>
              ))}
              <div>
                <label className="label">Message</label>
                <motion.textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell me about your project…" rows={5} className="input resize-none"
                  whileFocus={{ scale: 1.01 }} transition={{ duration: 0.2 }} />
              </div>
              <motion.button type="submit" disabled={sending}
                whileHover={{ scale: sending ? 1 : 1.02 }} whileTap={{ scale: sending ? 1 : 0.97 }}
                className="btn-primary w-full justify-center">
                {sending
                  ? <><span className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />Sending…</>
                  : <><FiSend size={14} />Send Message</>}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
