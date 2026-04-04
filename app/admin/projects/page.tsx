"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { getProjects, createProject, updateProject, deleteProject, uploadFile } from "@/lib/supabase/client";
import type { Project } from "@/lib/types";
import { FiPlus, FiEdit2, FiTrash2, FiCheck, FiX, FiStar, FiUpload } from "react-icons/fi";
import toast from "react-hot-toast";

const EMPTY = { title:"", description:"", tech_stack:[] as string[], project_link:"", github_link:"", image_url:"", featured:false };

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<string|null>(null);
  const [form, setForm] = useState({...EMPTY});
  const [techInput, setTechInput] = useState("");
  const [show, setShow] = useState(false);
  const [imgFile, setImgFile] = useState<File|null>(null);
  const [preview, setPreview] = useState("");

  async function load() { setLoading(true); setProjects(await getProjects()); setLoading(false); }
  useEffect(() => { load(); }, []);
  function openNew() { setEditId(null); setForm({...EMPTY}); setTechInput(""); setPreview(""); setImgFile(null); setShow(true); }
  function openEdit(p: Project) { setEditId(p.id); setForm({ title:p.title, description:p.description, tech_stack:p.tech_stack, project_link:p.project_link??"", github_link:p.github_link??"", image_url:p.image_url??"", featured:p.featured }); setPreview(p.image_url??""); setTechInput(""); setShow(true); }
  function cancel() { setEditId(null); setForm({...EMPTY}); setShow(false); setImgFile(null); setPreview(""); }
  function addTech() { const t = techInput.trim(); if (t && !form.tech_stack.includes(t)) { setForm(p=>({...p,tech_stack:[...p.tech_stack,t]})); setTechInput(""); } }
  function removeTech(t: string) { setForm(p=>({...p,tech_stack:p.tech_stack.filter(x=>x!==t)})); }

  async function save() {
    if (!form.title || !form.description) { toast.error("Title and description required"); return; }
    setSaving(true);
    let imageUrl = form.image_url;
    if (imgFile) {
      const { url, error } = await uploadFile("portfolio", `projects/${Date.now()}-${imgFile.name}`, imgFile);
      if (error) { toast.error("Image upload failed"); setSaving(false); return; }
      imageUrl = url ?? "";
    }
    const data = { ...form, image_url: imageUrl };
    const { error } = editId ? await updateProject(editId, data) : await createProject(data);
    setSaving(false);
    if (error) { toast.error(error); return; }
    toast.success(editId?"Updated!":"Project added!"); cancel(); load();
  }
  async function remove(id: string, title: string) {
    if (!confirm(`Delete "${title}"?`)) return;
    await deleteProject(id); toast.success("Deleted"); load();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-xl font-bold text-white">Projects</h2><p className="text-slate-400 text-sm">{projects.length} projects</p></div>
        <button onClick={openNew} className="btn-primary"><FiPlus size={15}/>Add Project</button>
      </div>
      {show && (
        <div className="card p-6 space-y-5 border-slate-700">
          <h3 className="text-sm font-semibold text-white">{editId?"Edit":"New"} Project</h3>
          <div><label className="label">Title *</label><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Project Title" className="input" /></div>
          <div><label className="label">Description *</label><textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} rows={4} placeholder="What does this project do?" className="input resize-none" /></div>
          <div>
            <label className="label">Project Image</label>
            <label className="cursor-pointer block">
              <div className="border-2 border-dashed border-slate-700 rounded-xl p-4 text-center hover:border-cyan-400/50 transition-colors flex items-center gap-3">
                {preview ? <Image src={preview} alt="preview" width={60} height={40} className="rounded-lg object-cover" unoptimized /> : <FiUpload size={18} className="text-slate-400 mx-auto" />}
                <span className="text-sm text-slate-400">{preview?"Change image":"Click to upload image"}</span>
              </div>
              <input type="file" accept="image/*" onChange={e=>{const f=e.target.files?.[0];if(f){setImgFile(f);setPreview(URL.createObjectURL(f));}}} className="hidden" />
            </label>
          </div>
          <div>
            <label className="label">Tech Stack</label>
            <div className="flex gap-2 mb-2">
              <input value={techInput} onChange={e=>setTechInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&(e.preventDefault(),addTech())} placeholder="e.g. React, ESP32…" className="input flex-1" />
              <button onClick={addTech} className="btn-ghost px-3">Add</button>
            </div>
            <div className="flex flex-wrap gap-2">{form.tech_stack.map(t=><span key={t} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-slate-800 text-slate-300 border border-slate-700">{t}<button onClick={()=>removeTech(t)} className="text-slate-500 hover:text-red-400"><FiX size={11}/></button></span>)}</div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="label">Live Demo URL</label><input value={form.project_link} onChange={e=>setForm({...form,project_link:e.target.value})} placeholder="https://…" className="input" /></div>
            <div><label className="label">GitHub URL</label><input value={form.github_link} onChange={e=>setForm({...form,github_link:e.target.value})} placeholder="https://github.com/…" className="input" /></div>
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={e=>setForm({...form,featured:e.target.checked})} className="w-4 h-4 accent-cyan-400" />
            <span className="text-sm text-slate-300 flex items-center gap-1.5"><FiStar size={14} className="text-amber-400"/>Mark as Featured</span>
          </label>
          <div className="flex gap-3">
            <button onClick={save} disabled={saving} className="btn-primary disabled:opacity-60"><FiCheck size={14}/>{saving?"Saving…":editId?"Update":"Add"}</button>
            <button onClick={cancel} className="btn-ghost"><FiX size={14}/>Cancel</button>
          </div>
        </div>
      )}
      {loading ? <div className="space-y-3">{[...Array(3)].map((_,i)=><div key={i} className="h-24 rounded-xl skeleton"/>)}</div>
      : projects.length===0 ? <div className="text-center py-16 text-slate-500">No projects yet.</div>
      : <div className="space-y-3">{projects.map(p=>(
          <div key={p.id} className="card p-5 flex items-start gap-4 group hover:border-slate-700 transition-colors">
            <div className="w-16 h-12 rounded-xl bg-slate-800 overflow-hidden shrink-0">
              {p.image_url ? <Image src={p.image_url} alt={p.title} width={64} height={48} className="object-cover w-full h-full" /> : <div className="w-full h-full flex items-center justify-center text-slate-600 text-xl font-bold">{p.title[0]}</div>}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2"><p className="text-white font-semibold">{p.title}</p>{p.featured&&<span className="text-xs font-mono text-amber-400 flex items-center gap-1"><FiStar size={11} className="fill-amber-400"/>Featured</span>}</div>
              <p className="text-slate-400 text-sm mt-0.5 truncate">{p.description}</p>
              <div className="flex flex-wrap gap-1 mt-2">{p.tech_stack.map(t=><span key={t} className="px-2 py-0.5 rounded text-xs bg-slate-800 text-slate-400 border border-slate-700">{t}</span>)}</div>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              <button onClick={()=>openEdit(p)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-400/10"><FiEdit2 size={13}/></button>
              <button onClick={()=>remove(p.id,p.title)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10"><FiTrash2 size={13}/></button>
            </div>
          </div>
        ))}</div>
      }
    </div>
  );
}
