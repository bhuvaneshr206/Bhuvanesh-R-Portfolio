export interface Profile {
  id: string; name: string; bio: string; tagline: string;
  email: string; phone?: string; location?: string;
  avatar_url?: string; github_url?: string; linkedin_url?: string; resume_url?: string;
  created_at?: string; updated_at?: string;
}
export interface Skill { id: string; name: string; level: number; category: string; created_at?: string; }
export interface Project {
  id: string; title: string; description: string; tech_stack: string[];
  project_link?: string; github_link?: string; image_url?: string; featured: boolean;
  created_at?: string; updated_at?: string;
}
export interface Certificate { id: string; title: string; issued_by: string; file_url?: string; issued_date?: string; credential_url?: string; created_at?: string; }
export interface Education { id: string; degree: string; institution: string; field_of_study?: string; start_year: string; end_year: string; grade?: string; description?: string; created_at?: string; }
export interface Experience { id: string; role: string; company: string; location?: string; start_date: string; end_date?: string; is_current: boolean; description: string; created_at?: string; }
export interface Service { id: string; title: string; description: string; icon: string; price_range?: string; created_at?: string; }
export interface Testimonial { id: string; name: string; role?: string; company?: string; message: string; avatar_url?: string; rating: number; created_at?: string; }
export interface Message { id: string; name: string; email: string; message: string; read: boolean; created_at?: string; }
