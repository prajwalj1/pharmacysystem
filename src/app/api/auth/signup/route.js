// app/api/auth/signup/route.js  (Next 13 app router format)
import dbConnect from "@/dbconfig/dbConnect";
import PendingUser from "@/models/PendingUser";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/lib/sendEmail";
import crypto from "crypto";

export async function POST(req) {
  try {
    await dbConnect();
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return new Response(JSON.stringify({ message: "Missing fields" }), { status: 400 });
    }

    const normalizedEmail = email.toLowerCase();

    // don't allow immediate create if a real user exists
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return new Response(JSON.stringify({ message: "User already exists" }), { status: 400 });
    }

    // if a pending user exists, replace it (or you can reject)
    await PendingUser.deleteOne({ email: normalizedEmail });

    // hash the password now (store hashed in pending)
    const hashedPassword = await bcrypt.hash(password, 10);

    // generate two short tokens (6-digit numeric)
    const adminToken = ("" + Math.floor(100000 + Math.random() * 900000));
    const userToken = ("" + Math.floor(100000 + Math.random() * 900000));

    const adminTokenHash = await bcrypt.hash(adminToken, 10);
    const userTokenHash = await bcrypt.hash(userToken, 10);

    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours

    const pending = await PendingUser.create({
      username,
      email: normalizedEmail,
      password: hashedPassword,
      adminTokenHash,
      userTokenHash,
      expiresAt,
    });

    // send email to admin
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `New pharmacist registration request: ${normalizedEmail}`,
      text: `A new pharmacist (${username}, ${normalizedEmail}) requested registration.\nAdmin token: ${adminToken}\nThis token is valid until ${expiresAt.toISOString()}`,
    });

    // send email to pharmacist email
    await sendEmail({
      to: normalizedEmail,
      subject: "Your pharmacist registration token",
      text: `Thanks for registering, ${username}.\nYour verification token: ${userToken}\nYou also must obtain the admin token and submit both tokens to complete registration. Token valid until ${expiresAt.toISOString()}`,
    });

    return new Response(JSON.stringify({ message: "Verification tokens sent to admin and your email", email: normalizedEmail }), { status: 201 });
  } catch (err) {
    console.error("signup error:", err);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}
