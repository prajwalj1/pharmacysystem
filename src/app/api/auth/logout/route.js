import { NextResponse } from "next/server";
import { getServerSession, signOut } from "next-auth/next";
import { authOptions } from "../[...nextauth]/route";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "No active session" }, { status: 401 });
    }

    // Destroy the session
    return NextResponse.redirect("/login", { status: 307 });
  } catch (err) {
    console.error("Logout error:", err);
    return NextResponse.json({ message: "Logout failed" }, { status: 500 });
  }
}
