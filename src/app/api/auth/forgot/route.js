import { NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";
import dbConnect from "@/dbconfig/dbConnect";
import User from "@/models/user";

export async function POST(req) {
  await dbConnect();

  try {
    const { email } = await req.json();

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // generate token
    const token = crypto.randomBytes(32).toString("hex");
    user.resetToken = token;
    user.resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    // transporter for PORT 587
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      requireTLS: true,
      tls: {
        ciphers: "SSLv3",
      },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password/${token}`;

    await transporter.sendMail({
      from: `"Pharmacy System" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <p>You requested a password reset.</p>
        <p>
          <a href="${resetUrl}" style="color:#10b981;font-weight:bold;">
            Reset Password
          </a>
        </p>
        <p>This link will expire in 1 hour.</p>
      `,
    });

    return NextResponse.json(
      { message: "Reset link sent to your email" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in forgot password:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
