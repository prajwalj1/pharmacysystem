import mongoose from "mongoose";

const PrescriptionSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  patientPhone: { type: String, required: true },
  doctorName: { type: String, required: true },
  medicines: [
    {
      name: String,
      dosage: String,
      quantity: Number,
      instructions: String,
    },
  ],
  notes: String,
  date: { type: Date, default: Date.now },
  pharmacist: { type: String }, // optional: who handled it
});

export default mongoose.models.Prescription ||
  mongoose.model("Prescription", PrescriptionSchema);
