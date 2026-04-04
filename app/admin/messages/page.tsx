"use client";
import { useEffect, useState } from "react";
import { getMessages, markMessageRead, deleteMessage } from "@/lib/supabase/client";
import type { Message } from "@/lib/types";
import { FiMail, FiMailOpen, FiTrash2, FiRefreshCw } from "react-icons/fi";
import toast from "react-hot-toast";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() { setLoading(true); setMessages(await getMessages()); setLoading(false); }
  useEffect(() => { load(); }, []);

  async function handleRead(id: string) {
    await markMessageRead(id);
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
  }
  async function handleDelete(id: string) {
    if (!confirm("Delete this message?")) return;
    await deleteMessage(id); toast.success("Deleted"); load();
  }

  const unread = messages.filter(m => !m.read).length;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Messages</h2>
          <p className="text-slate-400 text-sm">{messages.length} total · <span className="text-cyan-400">{unread} unread</span></p>
        </div>
        <button onClick={load} className="btn-ghost"><FiRefreshCw size={14}/>Refresh</button>
      </div>
      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_,i)=><div key={i} className="h-24 rounded-xl skeleton"/>)}</div>
      ) : messages.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <FiMail size={40} className="mx-auto mb-3 opacity-30" />
          <p>No messages yet. Your contact form submissions will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map(m => (
            <div key={m.id} className={`card p-5 transition-all group ${!m.read ? "border-cyan-400/20 bg-cyan-400/3" : "hover:border-slate-700"}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${!m.read ? "bg-cyan-500/15 border border-cyan-500/20" : "bg-slate-800"}`}>
                    {m.read ? <FiMailOpen size={15} className="text-slate-500" /> : <FiMail size={15} className="text-cyan-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-white font-semibold text-sm">{m.name}</p>
                      {!m.read && <span className="px-1.5 py-0.5 rounded text-xs bg-cyan-500 text-slate-900 font-bold">New</span>}
                      <p className="text-slate-500 text-xs">{m.email}</p>
                    </div>
                    <p className="text-slate-300 text-sm mt-1">{m.message}</p>
                    <p className="text-slate-600 text-xs mt-2">{m.created_at ? new Date(m.created_at).toLocaleString("en-IN") : ""}</p>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  {!m.read && (
                    <button onClick={() => handleRead(m.id)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all" title="Mark as read">
                      <FiMailOpen size={13} />
                    </button>
                  )}
                  <button onClick={() => handleDelete(m.id)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all">
                    <FiTrash2 size={13} />
                  </button>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-[var(--border)]">
                <a href={`mailto:${m.email}?subject=Re: Your message`} className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">Reply via email →</a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
