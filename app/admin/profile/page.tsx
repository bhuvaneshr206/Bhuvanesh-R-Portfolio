"use client";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { getProfile, updateProfile, uploadFile } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types";
import { FiSave, FiUser, FiUpload, FiX, FiZoomIn, FiZoomOut, FiSun, FiRefreshCw } from "react-icons/fi";
import toast from "react-hot-toast";

// ─── Image Processing Utilities ──────────────────────────────────────────────

function measureBrightness(ctx: CanvasRenderingContext2D, w: number, h: number): number {
  const data = ctx.getImageData(0, 0, w, h).data;
  let sum = 0;
  for (let i = 0; i < data.length; i += 4) {
    sum += 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
  }
  return sum / (data.length / 4);
}

function applyBrightnessContrast(
  ctx: CanvasRenderingContext2D, w: number, h: number,
  brightness: number, contrast: number
) {
  const imgData = ctx.getImageData(0, 0, w, h);
  const d = imgData.data;
  const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
  for (let i = 0; i < d.length; i += 4) {
    d[i]     = Math.min(255, Math.max(0, factor * (d[i]     - 128) + 128 + brightness));
    d[i + 1] = Math.min(255, Math.max(0, factor * (d[i + 1] - 128) + 128 + brightness));
    d[i + 2] = Math.min(255, Math.max(0, factor * (d[i + 2] - 128) + 128 + brightness));
  }
  ctx.putImageData(imgData, 0, 0);
}

async function detectFace(img: HTMLImageElement): Promise<{ cx: number; cy: number; size: number } | null> {
  try {
    if (typeof (window as any).FaceDetector === "undefined") return null;
    const fd = new (window as any).FaceDetector({ fastMode: true, maxDetectedFaces: 1 });
    const faces: any[] = await fd.detect(img);
    if (!faces.length) return null;
    const box = faces[0].boundingBox;
    return { cx: box.x + box.width / 2, cy: box.y + box.height / 2, size: Math.max(box.width, box.height) };
  } catch { return null; }
}

interface ProcessResult { blob: Blob; url: string; adjustments: string[]; faceDetected: boolean; }

async function processProfileImage(file: File): Promise<ProcessResult> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = async () => {
      const adjustments: string[] = [];
      const OUTPUT = 600;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;

      const face = await detectFace(img);
      const faceDetected = !!face;

      let cropX: number, cropY: number, cropSize: number;
      if (face) {
        const padding = face.size * 1.2;
        cropSize = Math.min(iw, ih, padding * 2);
        cropX = Math.max(0, Math.min(face.cx - cropSize / 2, iw - cropSize));
        cropY = Math.max(0, Math.min(face.cy - cropSize * 0.6, ih - cropSize));
        adjustments.push("Face detected & centered");
      } else {
        cropSize = Math.min(iw, ih);
        cropX = (iw - cropSize) / 2;
        cropY = (ih - cropSize) / 2;
        adjustments.push("Centre crop applied");
      }

      const canvas = document.createElement("canvas");
      canvas.width = OUTPUT; canvas.height = OUTPUT;
      const ctx = canvas.getContext("2d")!;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, cropX, cropY, cropSize, cropSize, 0, 0, OUTPUT, OUTPUT);

      const brightness = measureBrightness(ctx, OUTPUT, OUTPUT);
      if (brightness < 90) {
        const boost = Math.round((90 - brightness) * 0.8);
        applyBrightnessContrast(ctx, OUTPUT, OUTPUT, boost, 15);
        adjustments.push(`Brightness +${boost}, Contrast +15`);
      } else if (brightness < 120) {
        applyBrightnessContrast(ctx, OUTPUT, OUTPUT, 10, 8);
        adjustments.push("Light brightness boost");
      }

      canvas.toBlob((blob) => {
        if (!blob) { reject(new Error("Canvas export failed")); return; }
        resolve({ blob, url: URL.createObjectURL(blob), adjustments, faceDetected });
      }, "image/jpeg", 0.92);
    };
    img.onerror = () => reject(new Error("Image load failed"));
    img.src = URL.createObjectURL(file);
  });
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function AdminProfilePage() {
  const [profile,    setProfile]    = useState<Profile | null>(null);
  const [form,       setForm]       = useState<Partial<Profile>>({});
  const [loading,    setLoading]    = useState(true);
  const [saving,     setSaving]     = useState(false);
  const [processing, setProcessing] = useState(false);
  const [rawFile,    setRawFile]    = useState<File | null>(null);
  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
  const [preview,    setPreview]    = useState("");
  const [adjustments, setAdjustments] = useState<string[]>([]);
  const [faceDetected, setFaceDetected] = useState(false);
  const [zoom,       setZoom]       = useState(1);
  const [brightnessOffset, setBrightnessOffset] = useState(0);

  useEffect(() => {
    getProfile().then(p => {
      setProfile(p);
      if (p) { setForm(p); setPreview(p.avatar_url ?? ""); }
      setLoading(false);
    });
  }, []);

  function f(key: keyof Profile) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(p => ({ ...p, [key]: e.target.value }));
  }

  const applyManualTweaks = useCallback(
    (blob: Blob, zoomVal: number, brightnessVal: number): Promise<string> =>
      new Promise((res) => {
        const img = new window.Image();
        img.onload = () => {
          const OUTPUT = 600;
          const canvas = document.createElement("canvas");
          canvas.width = OUTPUT; canvas.height = OUTPUT;
          const ctx = canvas.getContext("2d")!;
          ctx.imageSmoothingQuality = "high";
          const scaled = OUTPUT / zoomVal;
          const off = (OUTPUT - scaled) / 2;
          ctx.drawImage(img, off, off, scaled, scaled, 0, 0, OUTPUT, OUTPUT);
          if (brightnessVal !== 0) applyBrightnessContrast(ctx, OUTPUT, OUTPUT, brightnessVal, 0);
          res(canvas.toDataURL("image/jpeg", 0.92));
        };
        img.src = URL.createObjectURL(blob);
      }),
    []
  );

  useEffect(() => {
    if (!processedBlob) return;
    applyManualTweaks(processedBlob, zoom, brightnessOffset).then(setPreview);
  }, [zoom, brightnessOffset, processedBlob, applyManualTweaks]);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { toast.error("Max 10MB"); return; }
    setProcessing(true);
    setZoom(1); setBrightnessOffset(0); setRawFile(file);
    try {
      const result = await processProfileImage(file);
      setProcessedBlob(result.blob);
      setPreview(result.url);
      setAdjustments(result.adjustments);
      setFaceDetected(result.faceDetected);
      toast.success(result.faceDetected ? "Face detected & image processed! 🎯" : "Image processed ✅");
    } catch {
      toast.error("Processing failed — using original");
      setProcessedBlob(file);
      setPreview(URL.createObjectURL(file));
      setAdjustments([]);
    } finally { setProcessing(false); }
  }

  async function reprocess() {
    if (!rawFile) return;
    setProcessing(true);
    try {
      const result = await processProfileImage(rawFile);
      setProcessedBlob(result.blob); setPreview(result.url);
      setAdjustments(result.adjustments); setFaceDetected(result.faceDetected);
      setZoom(1); setBrightnessOffset(0);
    } catch { toast.error("Reprocess failed"); }
    finally { setProcessing(false); }
  }

  function removePhoto() {
    setRawFile(null); setProcessedBlob(null); setPreview("");
    setAdjustments([]); setFaceDetected(false);
    setZoom(1); setBrightnessOffset(0);
    setForm(p => ({ ...p, avatar_url: "" }));
  }

  async function getFinalBlob(): Promise<Blob | null> {
    if (!processedBlob) return null;
    if (zoom === 1 && brightnessOffset === 0) return processedBlob;
    return new Promise((res) => {
      const img = new window.Image();
      img.onload = () => {
        const OUTPUT = 600;
        const canvas = document.createElement("canvas");
        canvas.width = OUTPUT; canvas.height = OUTPUT;
        const ctx = canvas.getContext("2d")!;
        ctx.imageSmoothingQuality = "high";
        const scaled = OUTPUT / zoom;
        const off = (OUTPUT - scaled) / 2;
        ctx.drawImage(img, off, off, scaled, scaled, 0, 0, OUTPUT, OUTPUT);
        if (brightnessOffset !== 0) applyBrightnessContrast(ctx, OUTPUT, OUTPUT, brightnessOffset, 0);
        canvas.toBlob((b) => res(b), "image/jpeg", 0.92);
      };
      img.src = URL.createObjectURL(processedBlob);
    });
  }

  async function handleSave() {
    if (!profile?.id) { toast.error("Profile not found"); return; }
    setSaving(true);
    let avatarUrl = form.avatar_url ?? "";
    if (processedBlob) {
      const finalBlob = await getFinalBlob();
      if (finalBlob) {
        const finalFile = new File([finalBlob], `avatar-${Date.now()}.jpg`, { type: "image/jpeg" });
        const { url, error } = await uploadFile("portfolio", `avatars/${finalFile.name}`, finalFile);
        if (error) { toast.error("Upload failed: " + error); setSaving(false); return; }
        avatarUrl = url ?? "";
      }
    }
    const { error } = await updateProfile(profile.id, { ...form, avatar_url: avatarUrl });
    setSaving(false);
    if (error) { toast.error(error); return; }
    toast.success("Profile saved! ✅");
    setProcessedBlob(null); setRawFile(null);
    const updated = await getProfile();
    if (updated) { setProfile(updated); setForm(updated); setPreview(updated.avatar_url ?? ""); }
  }

  if (loading) return (
    <div className="max-w-2xl mx-auto space-y-4">
      {[...Array(6)].map((_, i) => <div key={i} className="h-14 rounded-xl skeleton" />)}
    </div>
  );

  const hasNewImage = !!processedBlob;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Profile</h2>
        <p className="text-slate-400 text-sm">Your public portfolio information</p>
      </div>

      {/* Photo Upload Card */}
      <div className="card p-6 space-y-5">
        <p className="label">Profile Photo</p>

        <div className="flex flex-col sm:flex-row items-center gap-5">
          {/* Circle preview */}
          <div className="relative shrink-0">
            <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-cyan-500/30 bg-slate-800 shadow-lg shadow-cyan-500/10">
              {processing ? (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-slate-900">
                  <div className="w-6 h-6 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
                  <span className="text-xs text-slate-500">Processing…</span>
                </div>
              ) : preview ? (
                <Image src={preview} alt="Profile preview" width={112} height={112}
                  className="w-full h-full object-cover object-center" unoptimized />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-600">
                  <FiUser size={36} />
                </div>
              )}
            </div>
            {preview && !processing && (
              <button onClick={removePhoto}
                className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-400 transition-colors shadow-md">
                <FiX size={11} />
              </button>
            )}
            {hasNewImage && !processing && (
              <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-xs font-mono whitespace-nowrap border ${faceDetected ? "bg-green-500/20 border-green-500/30 text-green-400" : "bg-slate-700 border-slate-600 text-slate-400"}`}>
                {faceDetected ? "🎯 Face" : "⚡ Auto"}
              </div>
            )}
          </div>

          {/* Upload zone */}
          <label className="flex-1 w-full cursor-pointer">
            <div className={`border-2 border-dashed rounded-xl p-5 text-center transition-all ${processing ? "border-cyan-400/50 bg-cyan-400/5 animate-pulse" : hasNewImage ? "border-cyan-400/40 bg-cyan-400/5" : "border-slate-700 hover:border-cyan-400/50"}`}>
              <FiUpload size={20} className="text-slate-400 mx-auto mb-2" />
              <p className="text-sm text-slate-400 font-medium">
                {processing ? "Analysing & processing…" : hasNewImage ? rawFile?.name : "Click to upload photo"}
              </p>
              <p className="text-xs text-slate-600 mt-1">PNG, JPG up to 10MB · auto face-crop & enhance</p>
            </div>
            <input type="file" accept="image/*" onChange={handleFile} className="hidden" disabled={processing} />
          </label>
        </div>

        {/* Adjustment pills */}
        {adjustments.length > 0 && hasNewImage && (
          <div className="flex flex-wrap gap-2">
            {adjustments.map((a, i) => (
              <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono">
                ✓ {a}
              </span>
            ))}
          </div>
        )}

        {/* Fine-tune controls */}
        {hasNewImage && !processing && (
          <div className="bg-slate-900/60 rounded-xl p-4 space-y-4 border border-slate-800">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Fine-tune</p>
              <button onClick={reprocess} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors">
                <FiRefreshCw size={12} /> Reset auto
              </button>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="flex items-center gap-1.5 text-xs text-slate-400"><FiZoomIn size={13} /> Zoom</span>
                <span className="text-xs font-mono text-cyan-400">{zoom.toFixed(2)}×</span>
              </div>
              <div className="flex items-center gap-2">
                <FiZoomOut size={12} className="text-slate-600" />
                <input type="range" min="0.8" max="2.0" step="0.05" value={zoom}
                  onChange={e => setZoom(Number(e.target.value))}
                  className="flex-1 accent-cyan-400 cursor-pointer" />
                <FiZoomIn size={12} className="text-slate-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="flex items-center gap-1.5 text-xs text-slate-400"><FiSun size={13} /> Brightness</span>
                <span className="text-xs font-mono text-cyan-400">{brightnessOffset > 0 ? `+${brightnessOffset}` : brightnessOffset}</span>
              </div>
              <input type="range" min="-60" max="80" step="5" value={brightnessOffset}
                onChange={e => setBrightnessOffset(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer" />
            </div>
          </div>
        )}

        {/* Live preview at all sizes */}
        {preview && !processing && (
          <div className="p-4 bg-slate-900/40 rounded-xl border border-slate-800 text-center">
            <p className="text-xs text-slate-500 mb-3 uppercase tracking-wider font-mono">Live Preview — as shown on portfolio</p>
            <div className="flex items-center justify-center gap-6 flex-wrap">
              {[
                { size: 120, label: "Hero" },
                { size: 72,  label: "Sidebar" },
                { size: 40,  label: "Thumb" },
              ].map(({ size, label }) => (
                <div key={size} className="flex flex-col items-center gap-1.5">
                  <div className="overflow-hidden border-2 border-cyan-400/20 shadow-md shadow-cyan-500/10"
                    style={{ width: size, height: size, borderRadius: "50%" }}>
                    <Image src={preview} alt={label} width={size} height={size}
                      className="w-full h-full object-cover object-center" unoptimized />
                  </div>
                  <span className="text-xs text-slate-600 font-mono">{label} ({size}px)</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Form fields */}
      <div className="card p-6 space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="label">Full Name *</label><input type="text" value={form.name ?? ""} onChange={f("name")} placeholder="Bhuvanesh R" className="input" /></div>
          <div><label className="label">Email *</label><input type="email" value={form.email ?? ""} onChange={f("email")} placeholder="bhuvaneshr206@gmail.com" className="input" /></div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="label">Phone</label><input type="text" value={form.phone ?? ""} onChange={f("phone")} placeholder="+91 9XXXXXXXXX" className="input" /></div>
          <div><label className="label">Location</label><input type="text" value={form.location ?? ""} onChange={f("location")} placeholder="Tamil Nadu, India" className="input" /></div>
        </div>
        <div><label className="label">Tagline</label><input type="text" value={form.tagline ?? ""} onChange={f("tagline")} placeholder="Embedded Systems & Full Stack Developer" className="input" /></div>
        <div><label className="label">Bio</label><textarea value={form.bio ?? ""} onChange={f("bio")} rows={5} placeholder="Tell visitors about yourself…" className="input resize-none" /></div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="label">GitHub URL</label><input type="url" value={form.github_url ?? ""} onChange={f("github_url")} placeholder="https://github.com/username" className="input" /></div>
          <div><label className="label">LinkedIn URL</label><input type="url" value={form.linkedin_url ?? ""} onChange={f("linkedin_url")} placeholder="https://linkedin.com/in/username" className="input" /></div>
        </div>
        <div><label className="label">Resume URL</label><input type="url" value={form.resume_url ?? ""} onChange={f("resume_url")} placeholder="https://drive.google.com/…" className="input" /></div>
      </div>

      <button onClick={handleSave} disabled={saving || processing}
        className="btn-primary disabled:opacity-60 w-full sm:w-auto justify-center">
        <FiSave size={15} />
        {saving ? "Saving…" : "Save Profile"}
      </button>
    </div>
  );
}
