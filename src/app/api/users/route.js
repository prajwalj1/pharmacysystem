import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Adjust path to your authOptions
import dbConnect from "@/dbconfig/dbConnect"; // Your DB connection utility
import User from "@/models/user"; // Your User model

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // 1. Security Check: Only admins should access this
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    
    // 2. Fetch users (excluding passwords for security)
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}