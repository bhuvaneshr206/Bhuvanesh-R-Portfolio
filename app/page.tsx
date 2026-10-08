import {
  getProfile, getSkills, getProjects, getCertificates,
  getEducation, getExperience, getServices, getTestimonials
} from "@/lib/supabase/client";
import Navbar       from "@/components/portfolio/Navbar";
import Hero         from "@/components/portfolio/Hero";
import About        from "@/components/portfolio/About";
import Services     from "@/components/portfolio/Services";
import Skills       from "@/components/portfolio/Skills";
import Experience   from "@/components/portfolio/Experience";
import Education    from "@/components/portfolio/Education";
import Projects     from "@/components/portfolio/Projects";
import Certificates from "@/components/portfolio/Certificates";
import Testimonials from "@/components/portfolio/Testimonials";
import Contact      from "@/components/portfolio/Contact";
import Footer       from "@/components/portfolio/Footer";
import type { Metadata } from "next";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Bhuvanesh R | Embedded Systems & Full Stack Developer",
  description: "Portfolio of Bhuvanesh R — Embedded Systems Engineer & Full Stack Developer. ESP32, IoT, React, Next.js.",
  keywords: ["Bhuvanesh", "Full Stack Developer", "IoT", "ESP32", "Next.js", "React", "Freelance", "Tamil Nadu"],
  openGraph: {
    title: "Bhuvanesh R | Full Stack & IoT Developer",
    description: "Building real-world IoT and web solutions",
    type: "website",
  },
};

export default async function HomePage() {
  const [
    profile, skills, projects, certificates,
    education, experience, services, testimonials
  ] = await Promise.all([
    getProfile(), getSkills(), getProjects(), getCertificates(),
    getEducation(), getExperience(), getServices(), getTestimonials(),
  ]);

  return (
    <>
      <Navbar profile={profile} />
      <main>
        <Hero         profile={profile} />
        <About        profile={profile} />
        {/* <Services     services={services} /> */}
        <Skills       skills={skills} />
        <Experience   experience={experience} />
        <Education    education={education} />
        <Projects     projects={projects} />
        <Certificates certificates={certificates} />
        {/* <Testimonials testimonials={testimonials} /> */}
        <Contact      profile={profile} />
      </main>
      <Footer profile={profile} />
    </>
  );
}
