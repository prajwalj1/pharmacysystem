import mongoose from "mongoose";

const SaleSchema = new mongoose.Schema({
  patientName: String,
  patientPhone: String,
  items: [
    {
      name: String,
      price: Number,
      quantity: Number,
      total: Number,
    },
  ],
  grandTotal: Number,
  cashier: String,
  date: { type: Date, default: Date.now },
});

export default mongoose.models.Sale || mongoose.model("Sale", SaleSchema);
