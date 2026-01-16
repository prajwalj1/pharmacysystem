import { NextResponse } from "next/server";
import dbConnect from "@/dbconfig/dbConnect";
import Supplier from "@/models/Supplier";

export async function DELETE(req, { params }) {
  await dbConnect();

  const { id } = params; // ✅ Correct: just destructure directly

  if (!id) {
    return NextResponse.json({ message: "Supplier ID is required" }, { status: 400 });
  }

  try {
    const deleted = await Supplier.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ message: "Supplier not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Supplier deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Delete Supplier Error:", error);
    return NextResponse.json(
      { message: "Failed to delete supplier" },
      { status: 500 }
    );
  }
}
