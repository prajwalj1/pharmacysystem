import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/dbconfig/dbConnect";
import Medicine from "@/models/medicine";
import { sendEmail } from "@/lib/sendEmail";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Admin access only" }, { status: 403 });
    }

    await dbConnect();
    const body = await req.json();

    const medicine = await Medicine.create({
      name: body.name,
      genericName: body.genericName,
      brand: body.brand,
      category: body.category,
      batchNo: body.batchNo,
      expiryDate: new Date(body.expiryDate),
      description: body.description || "",
      purchasePrice: Number(body.purchasePrice),
      sellPrice: Number(body.sellPrice),
      quantityInStock: Number(body.quantityInStock),
      reorderLevel: Number(body.reorderLevel || 0),
    });

    // Notify admin
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `New Medicine Added: ${medicine.name}`,
      html: `<p>Medicine <b>${medicine.name}</b> has been added with stock: ${medicine.quantityInStock}</p>`,
    });

    return NextResponse.json({ message: "Medicine added successfully", medicine }, { status: 201 });
  } catch (error) {
    console.error("❌ Medicine API Error:", error);
    return NextResponse.json({ message: "Failed to add medicine" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !["PHARMACIST", "ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const medicines = await Medicine.find({})
      .select("name sellPrice quantityInStock genericName brand category batchNo expiryDate description")
      .sort({ name: 1 });

    return NextResponse.json(medicines, { status: 200 });
  } catch (error) {
    console.error("❌ Medicine GET API Error:", error);
    return NextResponse.json({ message: "Failed to fetch medicines" }, { status: 500 });
  }
}
