import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/dbconfig/dbConnect";
import User from "@/models/user";

export async function POST(req) {
  await dbConnect(); // Connect to DB

  try {
    const { token, newPassword } = await req.json();

    // 1. Find user with this token and check if token hasn't expired
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() }
    });

    if (!user) {
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
    }

    // 2. Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 3. Update user and clear the token fields
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    return NextResponse.json({ message: "Password updated successfully" }, { status: 200 });

  } catch (error) {
    console.error("Error in reset password:", error);
    return NextResponse.json({ message: "Reset failed" }, { status: 500 });
  }
}