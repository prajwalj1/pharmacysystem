import dbConnect from "@/lib/dbConnect";
import Batch from "@/models/batch";
import mongoose from "mongoose";

export async function getAvailableStock(medicineId) {
  await dbConnect();
  const pipeline = [
    { $match: { medicine: mongoose.Types.ObjectId(medicineId), expiryDate: { $gt: new Date() } } },
    { $group: { _id: null, total: { $sum: "$quantity" } } }
  ];
  const res = await Batch.aggregate(pipeline);
  return res[0]?.total || 0;
}

// select batches FIFO by earliest expiry
export async function selectBatchesForSale(medicineId, requiredQty) {
  await dbConnect();
  const batches = await Batch.find({ medicine: medicineId, expiryDate: { $gt: new Date() }, quantity: { $gt: 0 } })
    .sort({ expiryDate: 1, createdAt: 1 })
    .lean();

  const selection = [];
  let remain = requiredQty;
  for (const b of batches) {
    if (remain <= 0) break;
    const take = Math.min(remain, b.quantity);
    selection.push({ batchId: b._id, take });
    remain -= take;
  }
  if (remain > 0) throw new Error("Insufficient stock");
  return selection;
}
