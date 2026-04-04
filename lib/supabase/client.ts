import { createClient } from "@supabase/supabase-js";
import type { Profile, Skill, Project, Certificate, Education, Experience, Service, Testimonial, Message } from "@/lib/types";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(URL, KEY, {
  auth: { persistSession: true, autoRefreshToken: true },
});

// AUTH
export async function signIn(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return { error: error?.message ?? null };
}
export async function signOut() { await supabase.auth.signOut(); }
export async function getSession() { const { data } = await supabase.auth.getSession(); return data.session; }

// PROFILE
export async function getProfile(): Promise<Profile | null> {
  const { data } = await supabase.from("profile").select("*").limit(1).single();
  return (data as Profile) ?? null;
}
export async function updateProfile(id: string, u: Partial<Profile>) {
  const { error } = await supabase.from("profile").update({ ...u, updated_at: new Date().toISOString() }).eq("id", id);
  return { error: error?.message ?? null };
}

// SKILLS
export async function getSkills(): Promise<Skill[]> {
  const { data } = await supabase.from("skills").select("*").order("level", { ascending: false });
  return (data as Skill[]) ?? [];
}
export async function createSkill(s: Omit<Skill, "id"|"created_at">) { const { error } = await supabase.from("skills").insert([s]); return { error: error?.message ?? null }; }
export async function updateSkill(id: string, u: Partial<Skill>) { const { error } = await supabase.from("skills").update(u).eq("id", id); return { error: error?.message ?? null }; }
export async function deleteSkill(id: string) { const { error } = await supabase.from("skills").delete().eq("id", id); return { error: error?.message ?? null }; }

// PROJECTS
export async function getProjects(): Promise<Project[]> {
  const { data } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
  return (data as Project[]) ?? [];
}
export async function createProject(p: Omit<Project, "id"|"created_at"|"updated_at">) { const { error } = await supabase.from("projects").insert([p]); return { error: error?.message ?? null }; }
export async function updateProject(id: string, u: Partial<Project>) { const { error } = await supabase.from("projects").update({ ...u, updated_at: new Date().toISOString() }).eq("id", id); return { error: error?.message ?? null }; }
export async function deleteProject(id: string) { const { error } = await supabase.from("projects").delete().eq("id", id); return { error: error?.message ?? null }; }

// CERTIFICATES
export async function getCertificates(): Promise<Certificate[]> {
  const { data } = await supabase.from("certificates").select("*").order("created_at", { ascending: false });
  return (data as Certificate[]) ?? [];
}
export async function createCertificate(c: Omit<Certificate, "id"|"created_at">) { const { error } = await supabase.from("certificates").insert([c]); return { error: error?.message ?? null }; }
export async function updateCertificate(id: string, u: Partial<Certificate>) { const { error } = await supabase.from("certificates").update(u).eq("id", id); return { error: error?.message ?? null }; }
export async function deleteCertificate(id: string) { const { error } = await supabase.from("certificates").delete().eq("id", id); return { error: error?.message ?? null }; }

// EDUCATION
export async function getEducation(): Promise<Education[]> {
  const { data } = await supabase.from("education").select("*").order("start_year", { ascending: false });
  return (data as Education[]) ?? [];
}
export async function createEducation(e: Omit<Education, "id"|"created_at">) { const { error } = await supabase.from("education").insert([e]); return { error: error?.message ?? null }; }
export async function updateEducation(id: string, u: Partial<Education>) { const { error } = await supabase.from("education").update(u).eq("id", id); return { error: error?.message ?? null }; }
export async function deleteEducation(id: string) { const { error } = await supabase.from("education").delete().eq("id", id); return { error: error?.message ?? null }; }

// EXPERIENCE
export async function getExperience(): Promise<Experience[]> {
  const { data } = await supabase.from("experience").select("*").order("start_date", { ascending: false });
  return (data as Experience[]) ?? [];
}
export async function createExperience(e: Omit<Experience, "id"|"created_at">) { const { error } = await supabase.from("experience").insert([e]); return { error: error?.message ?? null }; }
export async function updateExperience(id: string, u: Partial<Experience>) { const { error } = await supabase.from("experience").update(u).eq("id", id); return { error: error?.message ?? null }; }
export async function deleteExperience(id: string) { const { error } = await supabase.from("experience").delete().eq("id", id); return { error: error?.message ?? null }; }

// SERVICES
export async function getServices(): Promise<Service[]> {
  const { data } = await supabase.from("services").select("*").order("created_at", { ascending: true });
  return (data as Service[]) ?? [];
}
export async function createService(s: Omit<Service, "id"|"created_at">) { const { error } = await supabase.from("services").insert([s]); return { error: error?.message ?? null }; }
export async function updateService(id: string, u: Partial<Service>) { const { error } = await supabase.from("services").update(u).eq("id", id); return { error: error?.message ?? null }; }
export async function deleteService(id: string) { const { error } = await supabase.from("services").delete().eq("id", id); return { error: error?.message ?? null }; }

// TESTIMONIALS
export async function getTestimonials(): Promise<Testimonial[]> {
  const { data } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });
  return (data as Testimonial[]) ?? [];
}
export async function createTestimonial(t: Omit<Testimonial, "id"|"created_at">) { const { error } = await supabase.from("testimonials").insert([t]); return { error: error?.message ?? null }; }
export async function updateTestimonial(id: string, u: Partial<Testimonial>) { const { error } = await supabase.from("testimonials").update(u).eq("id", id); return { error: error?.message ?? null }; }
export async function deleteTestimonial(id: string) { const { error } = await supabase.from("testimonials").delete().eq("id", id); return { error: error?.message ?? null }; }

// MESSAGES
export async function getMessages(): Promise<Message[]> {
  const { data } = await supabase.from("messages").select("*").order("created_at", { ascending: false });
  return (data as Message[]) ?? [];
}
export async function markMessageRead(id: string) { const { error } = await supabase.from("messages").update({ read: true }).eq("id", id); return { error: error?.message ?? null }; }
export async function deleteMessage(id: string) { const { error } = await supabase.from("messages").delete().eq("id", id); return { error: error?.message ?? null }; }
export async function createMessage(m: { name: string; email: string; message: string }) {
  const { error } = await supabase.from("messages").insert([{ ...m, read: false }]);
  return { error: error?.message ?? null };
}

// STORAGE
export async function uploadFile(bucket: string, path: string, file: File) {
  const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
  if (error) return { url: null, error: error.message };
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { url: data.publicUrl, error: null };
}
