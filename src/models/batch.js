import mongoose from "mongoose";
const BatchSchema = new mongoose.Schema({
  medicine: { type: mongoose.Schema.Types.ObjectId, ref: "Medicine", index: true },
  batchNo: String,
  expiryDate: Date,
  quantity: Number,
  purchasePrice: Number,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
},{ timestamps:true });
export default mongoose.models.Batch || mongoose.model("Batch", BatchSchema);
