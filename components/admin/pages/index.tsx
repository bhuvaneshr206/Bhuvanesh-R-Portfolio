"use client";
import { useEffect, useState } from "react";
import {
  getEducation, createEducation, updateEducation, deleteEducation,
  getExperience, createExperience, updateExperience, deleteExperience,
  getServices, createService, updateService, deleteService,
  getCertificates, createCertificate, updateCertificate, deleteCertificate,
  getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial,
} from "@/lib/supabase/client";
import { FiPlus, FiEdit2, FiTrash2, FiCheck, FiX, FiBook, FiBriefcase, FiGrid, FiAward, FiStar } from "react-icons/fi";
import toast from "react-hot-toast";

// ── EDUCATION ─────────────────────────────────────────────────
const EDU_EMPTY = { degree:"", institution:"", field_of_study:"", start_year:"", end_year:"", grade:"", description:"" };
export function EducationPage() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<string|null>(null);
  const [form, setForm] = useState({...EDU_EMPTY});
  const [show, setShow] = useState(false);
  async function load() { setLoading(true); setList(await getEducation()); setLoading(false); }
  useEffect(() => { load(); }, []);
  function f(k: string) { return (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => setForm(p=>({...p,[k]:e.target.value})); }
  function openEdit(item: any) { setEditId(item.id); setForm({ degree:item.degree, institution:item.institution, field_of_study:item.field_of_study??"", start_year:item.start_year, end_year:item.end_year, grade:item.grade??"", description:item.description??"" }); setShow(true); }
  async function save() {
    if (!form.degree||!form.institution) { toast.error("Degree and Institution required"); return; }
    setSaving(true);
    const { error } = editId ? await updateEducation(editId, form) : await createEducation(form);
    setSaving(false); if (error) { toast.error(error); return; }
    toast.success(editId?"Updated!":"Added!"); setEditId(null); setForm({...EDU_EMPTY}); setShow(false); load();
  }
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-xl font-bold text-white">Education</h2><p className="text-slate-400 text-sm">{list.length} entries</p></div>
        <button onClick={()=>{setEditId(null);setForm({...EDU_EMPTY});setShow(true);}} className="btn-primary"><FiPlus size={15}/>Add Education</button>
      </div>
      {show && (
        <div className="card p-6 space-y-4 border-slate-700">
          <h3 className="text-sm font-semibold text-white">{editId?"Edit":"New"} Education</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="label">Degree *</label><input className="input" value={form.degree} onChange={f("degree")} placeholder="B.E. Computer Science" /></div>
            <div><label className="label">Institution *</label><input className="input" value={form.institution} onChange={f("institution")} placeholder="Anna University" /></div>
          </div>
          <div><label className="label">Field of Study</label><input className="input" value={form.field_of_study} onChange={f("field_of_study")} placeholder="Computer Science & Engineering" /></div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div><label className="label">Start Year</label><input className="input" value={form.start_year} onChange={f("start_year")} placeholder="2020" /></div>
            <div><label className="label">End Year</label><input className="input" value={form.end_year} onChange={f("end_year")} placeholder="2024" /></div>
            <div><label className="label">Grade</label><input className="input" value={form.grade} onChange={f("grade")} placeholder="8.0 CGPA" /></div>
          </div>
          <div><label className="label">Description</label><textarea className="input resize-none" rows={3} value={form.description} onChange={f("description")} placeholder="Brief description…" /></div>
          <div className="flex gap-3">
            <button onClick={save} disabled={saving} className="btn-primary disabled:opacity-60"><FiCheck size={14}/>{saving?"Saving…":editId?"Update":"Add"}</button>
            <button onClick={()=>setShow(false)} className="btn-ghost"><FiX size={14}/>Cancel</button>
          </div>
        </div>
      )}
      {loading ? <div className="space-y-3">{[...Array(2)].map((_,i)=><div key={i} className="h-20 rounded-xl skeleton"/>)}</div>
      : list.length===0 ? <div className="text-center py-16 text-slate-500">No education added yet.</div>
      : <div className="space-y-4">{list.map(e=>(
          <div key={e.id} className="card p-5 flex gap-4 group hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0"><FiBook size={15} className="text-violet-400"/></div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2">
                <div><p className="text-white font-semibold">{e.degree}</p><p className="text-cyan-400 text-sm">{e.institution}</p><p className="text-slate-500 text-xs mt-0.5">{e.field_of_study} · {e.start_year}–{e.end_year}{e.grade?` · ${e.grade}`:""}</p></div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={()=>openEdit(e)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-400/10"><FiEdit2 size={13}/></button>
                  <button onClick={async()=>{if(!confirm("Delete?"))return;await deleteEducation(e.id);toast.success("Deleted");load();}} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10"><FiTrash2 size={13}/></button>
                </div>
              </div>
            </div>
          </div>
        ))}</div>
      }
    </div>
  );
}

// ── EXPERIENCE ────────────────────────────────────────────────
const EXP_EMPTY = { role:"", company:"", location:"", start_date:"", end_date:"", is_current:false, description:"" };
export function ExperiencePage() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<string|null>(null);
  const [form, setForm] = useState({...EXP_EMPTY});
  const [show, setShow] = useState(false);
  async function load() { setLoading(true); setList(await getExperience()); setLoading(false); }
  useEffect(() => { load(); }, []);
  function f(k: string) { return (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => setForm(p=>({...p,[k]:e.target.value})); }
  function openEdit(item: any) { setEditId(item.id); setForm({ role:item.role, company:item.company, location:item.location??"", start_date:item.start_date, end_date:item.end_date??"", is_current:item.is_current, description:item.description }); setShow(true); }
  async function save() {
    if (!form.role||!form.company) { toast.error("Role and Company required"); return; }
    setSaving(true);
    const { error } = editId ? await updateExperience(editId, form) : await createExperience(form);
    setSaving(false); if (error) { toast.error(error); return; }
    toast.success(editId?"Updated!":"Added!"); setEditId(null); setForm({...EXP_EMPTY}); setShow(false); load();
  }
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-xl font-bold text-white">Experience</h2><p className="text-slate-400 text-sm">{list.length} entries</p></div>
        <button onClick={()=>{setEditId(null);setForm({...EXP_EMPTY});setShow(true);}} className="btn-primary"><FiPlus size={15}/>Add Experience</button>
      </div>
      {show && (
        <div className="card p-6 space-y-4 border-slate-700">
          <h3 className="text-sm font-semibold text-white">{editId?"Edit":"New"} Experience</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="label">Role *</label><input className="input" value={form.role} onChange={f("role")} placeholder="Full Stack Developer" /></div>
            <div><label className="label">Company *</label><input className="input" value={form.company} onChange={f("company")} placeholder="Company Name" /></div>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div><label className="label">Location</label><input className="input" value={form.location} onChange={f("location")} placeholder="Chennai / Remote" /></div>
            <div><label className="label">Start Date</label><input className="input" value={form.start_date} onChange={f("start_date")} placeholder="2023-01" /></div>
            <div><label className="label">End Date</label><input className="input" value={form.end_date} onChange={f("end_date")} placeholder="2024-06" disabled={form.is_current} /></div>
          </div>
          <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={form.is_current} onChange={e=>setForm(p=>({...p,is_current:e.target.checked,end_date:e.target.checked?"":p.end_date}))} className="w-4 h-4 accent-cyan-400" /><span className="text-sm text-slate-300">Currently working here</span></label>
          <div><label className="label">Description</label><textarea className="input resize-none" rows={4} value={form.description} onChange={f("description")} placeholder="Your responsibilities and achievements…" /></div>
          <div className="flex gap-3">
            <button onClick={save} disabled={saving} className="btn-primary disabled:opacity-60"><FiCheck size={14}/>{saving?"Saving…":editId?"Update":"Add"}</button>
            <button onClick={()=>setShow(false)} className="btn-ghost"><FiX size={14}/>Cancel</button>
          </div>
        </div>
      )}
      {loading ? <div className="space-y-3">{[...Array(2)].map((_,i)=><div key={i} className="h-20 rounded-xl skeleton"/>)}</div>
      : list.length===0 ? <div className="text-center py-16 text-slate-500">No experience added yet.</div>
      : <div className="space-y-4">{list.map(e=>(
          <div key={e.id} className="card p-5 flex gap-4 group hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0"><FiBriefcase size={15} className="text-cyan-400"/></div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2">
                <div><p className="text-white font-semibold">{e.role}</p><p className="text-cyan-400 text-sm">{e.company}{e.location?` · ${e.location}`:""}</p><p className="text-slate-500 text-xs">{e.start_date} – {e.is_current?"Present":e.end_date}</p></div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={()=>openEdit(e)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-400/10"><FiEdit2 size={13}/></button>
                  <button onClick={async()=>{if(!confirm("Delete?"))return;await deleteExperience(e.id);toast.success("Deleted");load();}} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10"><FiTrash2 size={13}/></button>
                </div>
              </div>
              <p className="text-slate-400 text-sm mt-2">{e.description}</p>
            </div>
          </div>
        ))}</div>
      }
    </div>
  );
}

// ── SERVICES ──────────────────────────────────────────────────
const SVC_ICONS = ["code","layout","smartphone","database","shopping","cpu","settings"];
const SVC_EMPTY = { title:"", description:"", icon:"code", price_range:"" };
export function ServicesPage() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<string|null>(null);
  const [form, setForm] = useState({...SVC_EMPTY});
  const [show, setShow] = useState(false);
  async function load() { setLoading(true); setList(await getServices()); setLoading(false); }
  useEffect(() => { load(); }, []);
  function f(k: string) { return (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => setForm(p=>({...p,[k]:e.target.value})); }
  function openEdit(item: any) { setEditId(item.id); setForm({ title:item.title, description:item.description, icon:item.icon, price_range:item.price_range??"" }); setShow(true); }
  async function save() {
    if (!form.title||!form.description) { toast.error("Title and Description required"); return; }
    setSaving(true);
    const { error } = editId ? await updateService(editId, form) : await createService(form);
    setSaving(false); if (error) { toast.error(error); return; }
    toast.success(editId?"Updated!":"Added!"); setEditId(null); setForm({...SVC_EMPTY}); setShow(false); load();
  }
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-xl font-bold text-white">Services</h2><p className="text-slate-400 text-sm">{list.length} services</p></div>
        <button onClick={()=>{setEditId(null);setForm({...SVC_EMPTY});setShow(true);}} className="btn-primary"><FiPlus size={15}/>Add Service</button>
      </div>
      {show && (
        <div className="card p-6 space-y-4 border-slate-700">
          <h3 className="text-sm font-semibold text-white">{editId?"Edit":"New"} Service</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="label">Title *</label><input className="input" value={form.title} onChange={f("title")} placeholder="Web Development" /></div>
            <div><label className="label">Icon</label><select className="input" value={form.icon} onChange={f("icon")}>{SVC_ICONS.map(i=><option key={i} value={i}>{i}</option>)}</select></div>
          </div>
          <div><label className="label">Description *</label><textarea className="input resize-none" rows={3} value={form.description} onChange={f("description")} placeholder="What you offer…" /></div>
          <div><label className="label">Price Range</label><input className="input" value={form.price_range} onChange={f("price_range")} placeholder="₹5,000 – ₹50,000" /></div>
          <div className="flex gap-3">
            <button onClick={save} disabled={saving} className="btn-primary disabled:opacity-60"><FiCheck size={14}/>{saving?"Saving…":editId?"Update":"Add"}</button>
            <button onClick={()=>setShow(false)} className="btn-ghost"><FiX size={14}/>Cancel</button>
          </div>
        </div>
      )}
      {loading ? <div className="space-y-3">{[...Array(3)].map((_,i)=><div key={i} className="h-16 rounded-xl skeleton"/>)}</div>
      : list.length===0 ? <div className="text-center py-16 text-slate-500">No services added yet.</div>
      : <div className="space-y-3">{list.map(s=>(
          <div key={s.id} className="card p-5 flex items-center gap-4 group hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0"><FiGrid size={15} className="text-cyan-400"/></div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold">{s.title}</p>
              <p className="text-slate-400 text-sm truncate">{s.description}</p>
              {s.price_range&&<p className="text-xs font-mono text-cyan-400 mt-0.5">{s.price_range}</p>}
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={()=>openEdit(s)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-400/10"><FiEdit2 size={13}/></button>
              <button onClick={async()=>{if(!confirm("Delete?"))return;await deleteService(s.id);toast.success("Deleted");load();}} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10"><FiTrash2 size={13}/></button>
            </div>
          </div>
        ))}</div>
      }
    </div>
  );
}

// ── CERTIFICATES ──────────────────────────────────────────────
const CERT_EMPTY = { title:"", issued_by:"", issued_date:"", credential_url:"", file_url:"" };
export function CertificatesPage() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<string|null>(null);
  const [form, setForm] = useState({...CERT_EMPTY});
  const [show, setShow] = useState(false);
  async function load() { setLoading(true); setList(await getCertificates()); setLoading(false); }
  useEffect(() => { load(); }, []);
  function f(k: string) { return (e: React.ChangeEvent<HTMLInputElement>) => setForm(p=>({...p,[k]:e.target.value})); }
  function openEdit(item: any) { setEditId(item.id); setForm({ title:item.title, issued_by:item.issued_by, issued_date:item.issued_date??"", credential_url:item.credential_url??"", file_url:item.file_url??"" }); setShow(true); }
  async function save() {
    if (!form.title||!form.issued_by) { toast.error("Title and Issuer required"); return; }
    setSaving(true);
    const { error } = editId ? await updateCertificate(editId, form) : await createCertificate(form);
    setSaving(false); if (error) { toast.error(error); return; }
    toast.success(editId?"Updated!":"Added!"); setEditId(null); setForm({...CERT_EMPTY}); setShow(false); load();
  }
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-xl font-bold text-white">Certificates</h2><p className="text-slate-400 text-sm">{list.length} certificates</p></div>
        <button onClick={()=>{setEditId(null);setForm({...CERT_EMPTY});setShow(true);}} className="btn-primary"><FiPlus size={15}/>Add Certificate</button>
      </div>
      {show && (
        <div className="card p-6 space-y-4 border-slate-700">
          <h3 className="text-sm font-semibold text-white">{editId?"Edit":"New"} Certificate</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="label">Certificate Title *</label><input className="input" value={form.title} onChange={f("title")} placeholder="Introduction to IoT" /></div>
            <div><label className="label">Issued By *</label><input className="input" value={form.issued_by} onChange={f("issued_by")} placeholder="NPTEL / Udemy" /></div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="label">Issue Date</label><input type="date" className="input" value={form.issued_date} onChange={f("issued_date")} /></div>
            <div><label className="label">Credential URL</label><input className="input" value={form.credential_url} onChange={f("credential_url")} placeholder="https://…" /></div>
          </div>
          <div className="flex gap-3">
            <button onClick={save} disabled={saving} className="btn-primary disabled:opacity-60"><FiCheck size={14}/>{saving?"Saving…":editId?"Update":"Add"}</button>
            <button onClick={()=>setShow(false)} className="btn-ghost"><FiX size={14}/>Cancel</button>
          </div>
        </div>
      )}
      {loading ? <div className="space-y-2">{[...Array(3)].map((_,i)=><div key={i} className="h-16 rounded-xl skeleton"/>)}</div>
      : list.length===0 ? <div className="text-center py-16 text-slate-500">No certificates yet.</div>
      : <div className="space-y-3">{list.map(c=>(
          <div key={c.id} className="card p-5 flex items-center gap-4 group hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0"><FiAward size={15} className="text-amber-400"/></div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold">{c.title}</p>
              <p className="text-cyan-400 text-sm">{c.issued_by}</p>
              {c.issued_date&&<p className="text-slate-500 text-xs">{new Date(c.issued_date).toLocaleDateString("en-IN",{month:"short",year:"numeric"})}</p>}
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={()=>openEdit(c)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-400/10"><FiEdit2 size={13}/></button>
              <button onClick={async()=>{if(!confirm("Delete?"))return;await deleteCertificate(c.id);toast.success("Deleted");load();}} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10"><FiTrash2 size={13}/></button>
            </div>
          </div>
        ))}</div>
      }
    </div>
  );
}

// ── TESTIMONIALS ──────────────────────────────────────────────
const TEST_EMPTY = { name:"", role:"", company:"", message:"", rating:5 };
export function TestimonialsPage() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<string|null>(null);
  const [form, setForm] = useState({...TEST_EMPTY});
  const [show, setShow] = useState(false);
  async function load() { setLoading(true); setList(await getTestimonials()); setLoading(false); }
  useEffect(() => { load(); }, []);
  function f(k: string) { return (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => setForm(p=>({...p,[k]:e.target.value})); }
  function openEdit(item: any) { setEditId(item.id); setForm({ name:item.name, role:item.role??"", company:item.company??"", message:item.message, rating:item.rating }); setShow(true); }
  async function save() {
    if (!form.name||!form.message) { toast.error("Name and Message required"); return; }
    setSaving(true);
    const { error } = editId ? await updateTestimonial(editId, form) : await createTestimonial(form);
    setSaving(false); if (error) { toast.error(error); return; }
    toast.success(editId?"Updated!":"Added!"); setEditId(null); setForm({...TEST_EMPTY}); setShow(false); load();
  }
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-xl font-bold text-white">Testimonials</h2><p className="text-slate-400 text-sm">{list.length} reviews</p></div>
        <button onClick={()=>{setEditId(null);setForm({...TEST_EMPTY});setShow(true);}} className="btn-primary"><FiPlus size={15}/>Add Testimonial</button>
      </div>
      {show && (
        <div className="card p-6 space-y-4 border-slate-700">
          <h3 className="text-sm font-semibold text-white">{editId?"Edit":"New"} Testimonial</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="label">Client Name *</label><input className="input" value={form.name} onChange={f("name")} placeholder="Rahul Sharma" /></div>
            <div><label className="label">Role</label><input className="input" value={form.role} onChange={f("role")} placeholder="CEO / Founder" /></div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="label">Company</label><input className="input" value={form.company} onChange={f("company")} placeholder="Company Name" /></div>
            <div>
              <label className="label">Rating</label>
              <div className="flex gap-2 mt-2">{[1,2,3,4,5].map(n=><button key={n} type="button" onClick={()=>setForm(p=>({...p,rating:n}))} className={`w-8 h-8 flex items-center justify-center rounded-lg ${form.rating>=n?"text-amber-400":"text-slate-600"}`}><FiStar size={16} className={form.rating>=n?"fill-amber-400":""}/></button>)}</div>
            </div>
          </div>
          <div><label className="label">Message *</label><textarea className="input resize-none" rows={4} value={form.message} onChange={f("message")} placeholder="What the client said…" /></div>
          <div className="flex gap-3">
            <button onClick={save} disabled={saving} className="btn-primary disabled:opacity-60"><FiCheck size={14}/>{saving?"Saving…":editId?"Update":"Add"}</button>
            <button onClick={()=>setShow(false)} className="btn-ghost"><FiX size={14}/>Cancel</button>
          </div>
        </div>
      )}
      {loading ? <div className="space-y-3">{[...Array(2)].map((_,i)=><div key={i} className="h-20 rounded-xl skeleton"/>)}</div>
      : list.length===0 ? <div className="text-center py-16 text-slate-500">No testimonials yet.</div>
      : <div className="space-y-4">{list.map(t=>(
          <div key={t.id} className="card p-5 group hover:border-slate-700 transition-colors">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div><p className="text-white font-semibold">{t.name}</p><p className="text-slate-400 text-sm">{t.role} · {t.company}</p><div className="flex gap-0.5 mt-1">{[...Array(5)].map((_,i)=><FiStar key={i} size={11} className={i<t.rating?"text-amber-400 fill-amber-400":"text-slate-700"}/>)}</div></div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={()=>openEdit(t)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-400/10"><FiEdit2 size={13}/></button>
                <button onClick={async()=>{if(!confirm("Delete?"))return;await deleteTestimonial(t.id);toast.success("Deleted");load();}} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10"><FiTrash2 size={13}/></button>
              </div>
            </div>
            <p className="text-slate-400 text-sm italic">&ldquo;{t.message}&rdquo;</p>
          </div>
        ))}</div>
      }
    </div>
  );
}

export default EducationPage;
