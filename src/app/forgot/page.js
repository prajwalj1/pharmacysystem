"use client";

import { useState } from "react";
import Link from "next/link";
import { FiMail, FiShield } from "react-icons/fi";

export default function ForgotPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/auth/forgot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setMessage(data.message || "User not found");
      return;
    }

    // Success: Show message that email has been sent
    setSuccess(true);
    setMessage("A password reset link has been sent to your email.");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center mb-8">
          <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
            <FiShield size={30} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Forgot Password</h1>
          <p className="text-gray-500 text-sm mt-2">Enter your email to receive a reset link</p>
        </div>

        {!success ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-3.5 text-gray-400" />
                <input 
                  type="email" 
                  required 
                  placeholder="admin@pharmacy.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition"
                />
              </div>
            </div>
            <button 
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg transition"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        ) : (
          <div className="space-y-6 animate-in fade-in zoom-in duration-300">
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-center">
              <p className="text-emerald-800 font-medium text-sm">{message}</p>
            </div>
          </div>
        )}

        {message && !success && (
          <p className="text-red-500 text-sm text-center mt-4">{message}</p>
        )}

        <div className="mt-8 text-center">
          <Link href="/login" className="text-sm text-gray-500 hover:text-emerald-600 font-medium">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}