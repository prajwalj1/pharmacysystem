// app/(auth)/register/page.jsx  (or wherever your register page is)
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // token phase
  const [stage, setStage] = useState("form"); // "form" | "verify"
  const [adminToken, setAdminToken] = useState("");
  const [userToken, setUserToken] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setInfoMessage("");
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      setLoading(false);
      if (!res.ok) {
        setError(data.message || "Registration failed");
        return;
      }
      setInfoMessage("Verification tokens sent. Check your email and ask admin for admin token.");
      setStage("verify");
    } catch (err) {
      setLoading(false);
      setError("Server error");
    }
  }

  async function handleVerify(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/verify-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, adminToken, userToken }),
      });
      const data = await res.json();
      setLoading(false);
      if (!res.ok) {
        setError(data.message || "Verification failed");
        return;
      }
      // success -> redirect to login
      router.push("/login");
    } catch (err) {
      setLoading(false);
      setError("Server error");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-semibold mb-4 text-center">Register</h1>

        {stage === "form" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="Username" className="w-full px-3 py-2 border rounded" required />
            <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" className="w-full px-3 py-2 border rounded" type="email" required />
            <input value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" className="w-full px-3 py-2 border rounded" type="password" required />

            {error && <p className="text-sm text-red-600">{error}</p>}
            {infoMessage && <p className="text-sm text-green-600">{infoMessage}</p>}

            <button className="w-full py-2 bg-indigo-600 text-white rounded" disabled={loading}>
              {loading ? "Processing..." : "Create account"}
            </button>
          </form>
        )}

        {stage === "verify" && (
          <form onSubmit={handleVerify} className="space-y-4">
            <p className="text-sm">Enter the tokens: your email token (sent to your email) and the admin token (sent to admin).</p>
            <input value={userToken} onChange={(e)=>setUserToken(e.target.value)} placeholder="Your email token" className="w-full px-3 py-2 border rounded" required />
            <input value={adminToken} onChange={(e)=>setAdminToken(e.target.value)} placeholder="Admin token" className="w-full px-3 py-2 border rounded" required />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button className="w-full py-2 bg-indigo-600 text-white rounded" disabled={loading}>
              {loading ? "Verifying..." : "Verify & Create Account"}
            </button>
            <div className="text-sm text-center mt-2">
              <button type="button" onClick={()=>setStage("form")} className="text-indigo-600 hover:underline">Back to form</button>
            </div>
          </form>
        )}

        <div className="mt-4 text-sm text-center">
          <Link href="/login" className="text-indigo-600 hover:underline">Already have an account? Login</Link>
        </div>
      </div>
    </div>
  );
}
