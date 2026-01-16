import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/dbconfig/dbConnect";
import User from "@/models/user";

export async function DELETE(req, { params }) {
  try {
    await dbConnect();

    // ✅ FIX: You must await params before accessing properties
    const { id } = await params; 

    const session = await getServerSession(authOptions);

    // 1. Check Auth
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Prevent self-deletion
    // Make sure your session contains the user ID (usually session.user.id or session.user._id)
    if (session.user.id === id) {
      return NextResponse.json(
        { error: "You cannot delete your own account" }, 
        { status: 400 }
      );
    }

    const user = await User.findByIdAndDelete(id);
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("DELETE_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}