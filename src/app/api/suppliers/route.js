import { NextResponse } from "next/server";
import dbConnect from "@/dbconfig/dbConnect";
import Supplier from "@/models/Supplier";

// GET: Fetch all suppliers
export async function GET() {
  try {
    await dbConnect();
    const suppliers = await Supplier.find().sort({ createdAt: -1 });
    return NextResponse.json(suppliers, { status: 200 });
  } catch (error) {
    console.error("❌ GET Suppliers Error:", error);
    return NextResponse.json(
      { message: "Failed to fetch suppliers" },
      { status: 500 }
    );
  }
}

// POST: Add a new supplier
export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    // Simple validation
    if (!body.name || !body.contact) {
      return NextResponse.json(
        { message: "Supplier name and contact are required" },
        { status: 400 }
      );
    }

    const supplier = await Supplier.create(body);
    return NextResponse.json(supplier, { status: 201 });
  } catch (error) {
    console.error("❌ POST Supplier Error:", error);
    return NextResponse.json(
      { message: "Failed to add supplier" },
      { status: 500 }
    );
  }
}
