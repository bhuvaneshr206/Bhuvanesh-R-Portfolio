"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { FiLock, FiEye, FiEyeOff, FiUser } from "react-icons/fi";

// Admin username → maps to Supabase email
const ADMIN_USERNAME = "bhuvaneshr206";
const ADMIN_EMAIL    = "bhuvaneshr206@gmail.com";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [show, setShow]         = useState(false);
  const [error, setError]       = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (username.trim() !== ADMIN_USERNAME) {
      setError("Invalid username or password.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);
    const { error: authErr } = await signIn(ADMIN_EMAIL, password);
    setLoading(false);

    if (authErr) {
      setError("Invalid username or password.");
      return;
    }

    toast.success("Welcome back, Bhuvanesh!");
    router.push("/admin");
    router.refresh();
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0a0c14",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <div style={{ width: "100%", maxWidth: "400px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            width: "56px", height: "56px",
            background: "rgba(34,211,238,0.1)",
            border: "1px solid rgba(34,211,238,0.2)",
            borderRadius: "16px",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px",
          }}>
            <FiLock size={24} color="#22d3ee" />
          </div>
          <h1 style={{ color: "#fff", fontSize: "24px", fontWeight: 700, margin: 0 }}>
            Admin Login
          </h1>
          <p style={{ color: "#64748b", fontSize: "14px", marginTop: "8px" }}>
            Sign in to manage your portfolio
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: "#0f1117",
          border: "1px solid #1e2a3a",
          borderRadius: "20px",
          padding: "32px",
        }}>
          {error && (
            <div style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: "10px",
              padding: "10px 14px",
              color: "#ef4444",
              fontSize: "13px",
              marginBottom: "20px",
            }}>
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            {/* Username */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{
                display: "block", color: "#94a3b8", fontSize: "11px",
                fontWeight: 600, textTransform: "uppercase",
                letterSpacing: "0.08em", marginBottom: "8px",
              }}>
                Username
              </label>
              <div style={{ position: "relative" }}>
                <FiUser size={14} color="#475569" style={{
                  position: "absolute", left: "14px",
                  top: "50%", transform: "translateY(-50%)",
                  pointerEvents: "none",
                }} />
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="bhuvaneshr206"
                  required
                  style={{
                    width: "100%", boxSizing: "border-box",
                    paddingLeft: "42px", paddingRight: "16px",
                    paddingTop: "12px", paddingBottom: "12px",
                    background: "#0a0c14",
                    border: "1px solid #1e2a3a",
                    borderRadius: "12px",
                    color: "#e2e8f0", fontSize: "14px", outline: "none",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={e => { e.target.style.borderColor = "#22d3ee"; }}
                  onBlur={e => { e.target.style.borderColor = "#1e2a3a"; }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{
                display: "block", color: "#94a3b8", fontSize: "11px",
                fontWeight: 600, textTransform: "uppercase",
                letterSpacing: "0.08em", marginBottom: "8px",
              }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <FiLock size={14} color="#475569" style={{
                  position: "absolute", left: "14px",
                  top: "50%", transform: "translateY(-50%)",
                  pointerEvents: "none",
                }} />
                <input
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{
                    width: "100%", boxSizing: "border-box",
                    paddingLeft: "42px", paddingRight: "42px",
                    paddingTop: "12px", paddingBottom: "12px",
                    background: "#0a0c14",
                    border: "1px solid #1e2a3a",
                    borderRadius: "12px",
                    color: "#e2e8f0", fontSize: "14px", outline: "none",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={e => { e.target.style.borderColor = "#22d3ee"; }}
                  onBlur={e => { e.target.style.borderColor = "#1e2a3a"; }}
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  style={{
                    position: "absolute", right: "14px",
                    top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none",
                    color: "#475569", cursor: "pointer",
                    display: "flex", alignItems: "center",
                  }}
                >
                  {show ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "13px",
                background: loading ? "#0891b2" : "#22d3ee",
                color: "#0a0c14", fontWeight: 700,
                fontSize: "14px", borderRadius: "12px",
                border: "none", cursor: loading ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center",
                justifyContent: "center", gap: "8px",
                transition: "all 0.2s",
              }}
            >
              {loading ? (
                <>
                  <span style={{
                    width: "16px", height: "16px",
                    border: "2px solid rgba(10,12,20,0.3)",
                    borderTopColor: "#0a0c14",
                    borderRadius: "50%",
                    display: "inline-block",
                    animation: "spin 0.8s linear infinite",
                  }} />
                  Signing in…
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", marginTop: "20px" }}>
          <a href="/" style={{ color: "#475569", fontSize: "13px", textDecoration: "none" }}>
            ← Back to Portfolio
          </a>
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
