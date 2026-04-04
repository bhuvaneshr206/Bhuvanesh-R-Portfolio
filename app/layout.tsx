import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bhuvanesh | Embedded Systems & Full Stack Developer",
  description: "Building real-world solutions with IoT and modern web technologies. Available for freelance projects.",
  keywords: ["Bhuvanesh", "Full Stack Developer", "IoT", "ESP32", "Next.js", "React", "Freelance"],
  openGraph: {
    title: "Bhuvanesh | Full Stack & IoT Developer",
    description: "Portfolio of Bhuvanesh R — Full Stack Developer & Embedded Systems Engineer",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="top-right" toastOptions={{
          style: { background: "#111827", color: "#e2e8f0", border: "1px solid #1e2a3a" },
        }} />
      </body>
    </html>
  );
}
