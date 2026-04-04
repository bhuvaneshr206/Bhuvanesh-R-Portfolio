"use client";
import { useEffect, useState } from "react";
import { getSkills, createSkill, updateSkill, deleteSkill } from "@/lib/supabase/client";
import type { Skill } from "@/lib/types";
import { FiPlus, FiEdit2, FiTrash2, FiCheck, FiX } from "react-icons/fi";
import toast from "react-hot-toast";

const CATS = ["Frontend","Backend","Hardware & IoT","Database","DevOps","Design","Other"];
const EMPTY = { name:"", level:80, category:"Frontend" };

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<string|null>(null);
  const [form, setForm] = useState({...EMPTY});
  const [show, setShow] = useState(false);

  async function load() { setLoading(true); setSkills(await getSkills()); setLoading(false); }
  useEffect(() => { load(); }, []);
  function openNew() { setEditId(null); setForm({...EMPTY}); setShow(true); }
  function openEdit(s: Skill) { setEditId(s.id); setForm({ name:s.name, level:s.level, category:s.category }); setShow(true); }
  function cancel() { setEditId(null); setForm({...EMPTY}); setShow(false); }
  async function save() {
    if (!form.name.trim()) { toast.error("Name required"); return; }
    setSaving(true);
    const { error } = editId ? await updateSkill(editId, form) : await createSkill(form);
    setSaving(false);
    if (error) { toast.error(error); return; }
    toast.success(editId ? "Updated!" : "Skill added!"); cancel(); load();
  }
  async function remove(id: string, name: string) {
    if (!confirm(`Delete "${name}"?`)) return;
    await deleteSkill(id); toast.success("Deleted"); load();
  }
  const grouped = CATS.reduce<Record<string,Skill[]>>((a,c) => { const items = skills.filter(s => s.category===c); if (items.length) a[c]=items; return a; }, {});

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-xl font-bold text-white">Skills</h2><p className="text-slate-400 text-sm">{skills.length} skills</p></div>
        <button onClick={openNew} className="btn-primary"><FiPlus size={15}/>Add Skill</button>
      </div>
      {show && (
        <div className="card p-6 space-y-5 border-slate-700">
          <h3 className="text-sm font-semibold text-white">{editId?"Edit":"New"} Skill</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="label">Skill Name *</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. React, ESP32…" className="input" /></div>
            <div><label className="label">Category</label><select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="input">{CATS.map(c=><option key={c}>{c}</option>)}</select></div>
          </div>
          <div>
            <div className="flex justify-between mb-2"><label className="label m-0">Level</label><span className="text-sm font-mono text-cyan-400">{form.level}%</span></div>
            <input type="range" min={10} max={100} step={5} value={form.level} onChange={e=>setForm({...form,level:Number(e.target.value)})} className="w-full accent-cyan-400 cursor-pointer" />
            <div className="flex justify-between text-xs text-slate-600 mt-1"><span>Beginner</span><span>Intermediate</span><span>Expert</span></div>
          </div>
          <div className="flex gap-3">
            <button onClick={save} disabled={saving} className="btn-primary disabled:opacity-60"><FiCheck size={14}/>{saving?"Saving…":editId?"Update":"Add"}</button>
            <button onClick={cancel} className="btn-ghost"><FiX size={14}/>Cancel</button>
          </div>
        </div>
      )}
      {loading ? <div className="space-y-2">{[...Array(4)].map((_,i)=><div key={i} className="h-14 rounded-xl skeleton"/>)}</div>
      : skills.length===0 ? <div className="text-center py-16 text-slate-500">No skills yet — add your first one!</div>
      : <div className="space-y-6">{Object.entries(grouped).map(([cat,items])=>(
          <div key={cat}>
            <p className="text-xs font-mono text-slate-600 uppercase tracking-widest mb-3">{cat}</p>
            <div className="space-y-2">{items.map(skill=>(
              <div key={skill.id} className="card px-5 py-4 flex items-center gap-4 group hover:border-slate-700 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between mb-1.5"><span className="text-sm font-medium text-white">{skill.name}</span><span className="text-xs font-mono text-cyan-400">{skill.level}%</span></div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-cyan-400" style={{width:`${skill.level}%`}}/></div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={()=>openEdit(skill)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-400/10"><FiEdit2 size={13}/></button>
                  <button onClick={()=>remove(skill.id,skill.name)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10"><FiTrash2 size={13}/></button>
                </div>
              </div>
            ))}</div>
          </div>
        ))}</div>
      }
    </div>
  );
}
