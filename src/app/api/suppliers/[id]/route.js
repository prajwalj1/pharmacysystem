
import { NextResponse } from "next/server";
import dbConnect from "@/dbconfig/dbConnect";
import Supplier from "@/models/Supplier";

export async function DELETE(req, { params }) {
  await dbConnect();

  const { id } = await params; // ✅ IMPORTANT FIX

  await Supplier.findByIdAndDelete(id);

  return NextResponse.json(
    { message: "Supplier deleted successfully" },
    { status: 200 }
  );
}
