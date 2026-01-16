import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  genericName: String,
  brand: String,
  category: String,
  batchNo: String,
  expiryDate: { type: Date, required: true },
  description:String,
  purchasePrice: { type: Number, required: true },
  sellPrice: { type: Number, required: true },
  quantityInStock: { type: Number, required: true },
  reorderLevel: { type: Number, default: 0 },
  supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: false },
}, { timestamps: true });

// Note the capitalized "Medicine"
export default mongoose.models.Medicine || mongoose.model("Medicine", medicineSchema);