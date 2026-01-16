// app/api/auth/verify-signup/route.js
import dbConnect from "@/dbconfig/dbConnect";
import PendingUser from "@/models/PendingUser";
import User from "@/models/user";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await dbConnect();
    const { email, adminToken, userToken } = await req.json();

    if (!email || !adminToken || !userToken) {
      return new Response(JSON.stringify({ message: "Missing fields" }), { status: 400 });
    }

    const normalizedEmail = email.toLowerCase();

    const pending = await PendingUser.findOne({ email: normalizedEmail });
    if (!pending) {
      return new Response(JSON.stringify({ message: "No pending registration found" }), { status: 404 });
    }

    if (new Date() > new Date(pending.expiresAt)) {
      await PendingUser.deleteOne({ email: normalizedEmail });
      return new Response(JSON.stringify({ message: "Tokens expired. Please register again." }), { status: 410 });
    }

    const adminOk = await bcrypt.compare(adminToken, pending.adminTokenHash);
    const userOk = await bcrypt.compare(userToken, pending.userTokenHash);

    if (!adminOk || !userOk) {
      return new Response(JSON.stringify({ message: "Invalid tokens" }), { status: 401 });
    }

    // create real user
    const alreadyUser = await User.findOne({ email: normalizedEmail });
    if (alreadyUser) {
      await PendingUser.deleteOne({ email: normalizedEmail });
      return new Response(JSON.stringify({ message: "User already exists" }), { status: 400 });
    }

    const user = await User.create({
      username: pending.username,
      email: pending.email,
      password: pending.password, // already hashed
      role: "PHARMACIST",
    });

    // remove pending
    await PendingUser.deleteOne({ email: normalizedEmail });

    return new Response(JSON.stringify({ message: "User created", userId: user._id }), { status: 201 });
  } catch (err) {
    console.error("verify-signup error:", err);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}
