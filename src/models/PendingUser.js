// /models/PendingUser.js
import mongoose from "mongoose";

const PendingUserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // already hashed
    adminTokenHash: { type: String, required: true },
    userTokenHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.PendingUser ||
  mongoose.model("PendingUser", PendingUserSchema);
