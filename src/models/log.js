import mongoose from "mongoose";
const LogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  action: String,
  meta: Object
},{ timestamps:true });
export default mongoose.models.Log || mongoose.model("Log", LogSchema);
