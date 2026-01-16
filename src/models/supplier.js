import mongoose from "mongoose";
const SupplierSchema = new mongoose.Schema({
  name: String,
  contact: String,
  email: String,
  address: String
},{ timestamps:true });
export default mongoose.models.Supplier || mongoose.model("Supplier", SupplierSchema);
