import mongoose from "mongoose";
const PurchaseItemSchema = new mongoose.Schema({
  medicine: { type: mongoose.Schema.Types.ObjectId, ref: "Medicine" },
  batch: { type: mongoose.Schema.Types.ObjectId, ref: "Batch" },
  quantity: Number,
  price: Number
});
const PurchaseSchema = new mongoose.Schema({
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier" },
  items: [PurchaseItemSchema],
  total: Number,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
},{ timestamps:true });
export default mongoose.models.Purchase || mongoose.model("Purchase", PurchaseSchema);
