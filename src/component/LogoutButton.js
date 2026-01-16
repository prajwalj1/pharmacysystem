// src/components/LogoutButton.js
"use client";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ redirect: true, callbackUrl: "/login" })}
      className="px-3 py-1 bg-red-500 rounded hover:bg-red-600 text-white"
    >
      Logout
    </button>
  );
}
