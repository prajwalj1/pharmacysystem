"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLoginForm() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle redirection ONLY if they are an admin
  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "ADMIN") {
      router.push("admin");
    }
  }, [session, status, router]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const email = e.target.email.value;
    const password = e.target.password.value;

    // Trigger NextAuth sign-in
    const res = await signIn("credentials", { // Ensure this matches your provider name
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Invalid admin credentials");
      setLoading(false);
      return;
    }

    // IMPORTANT: After signIn, we need to fetch the session to check the role
    // We can do this by refreshing or waiting for status change
    setLoading(false);
    
    // Manual check if you want immediate feedback before the useEffect redirects
    // Note: session might not be updated yet here, so we rely on the useEffect 
    // or you can check the 'res' if your backend returns role info.
  }

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
      <h1 className="text-2xl font-bold text-center mb-2 text-black">Admin Login</h1>
      <p className="text-center text-gray-500 mb-6">Pharmacy Management System</p>

      {error && (
        <p className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="email"
          type="email"
          required
          placeholder="Admin Email"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-black"
        />

        <input
          name="password"
          type="password"
          required
          placeholder="Password"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-black"
        />

        <button
          disabled={loading || status === "loading"}
          type="submit"
          className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login as Admin"}
        </button>
      </form>
    </div>
  );
}