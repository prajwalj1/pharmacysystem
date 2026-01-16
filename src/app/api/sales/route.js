import { NextResponse } from "next/server";
import dbConnect from "@/dbconfig/dbConnect";
import Sale from "@/models/sale";
import Medicine from "@/models/medicine";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { sendEmail } from "@/lib/sendEmail"; // ✅ optional notification

// 🔹 Helper to match frontend filter logic
function getStockStatus(qty) {
  if (qty === 0) return "EMPTY";
  if (qty > 0 && qty <= 150) return "LOW";
  return "AVAILABLE";
}

// ================= POST =================
// ================= POST =================
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["PHARMACIST", "ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    await dbConnect();

    const { patientName, patientPhone, items, grandTotal } = await req.json();

    // 1. Update stock for each item
    for (const item of items) {
      const med = await Medicine.findOne({ name: item.name });
      if (!med) {
        return NextResponse.json(
          { message: `Medicine "${item.name}" not found in inventory` },
          { status: 404 }
        );
      }

      if (med.quantityInStock < item.quantity) {
        return NextResponse.json(
          {
            message: `Insufficient stock for "${item.name}"! Requested: ${item.quantity}, Available: ${med.quantityInStock}`,
            availableStock: med.quantityInStock,
          },
          { status: 400 }
        );
      }

      const oldQty = med.quantityInStock;
      const oldStatus = getStockStatus(oldQty);

      // Update stock
      med.quantityInStock -= item.quantity;
      await med.save();

      const newQty = med.quantityInStock;
      const newStatus = getStockStatus(newQty);

      // Send email ONLY when status changes to LOW or EMPTY
      if (
        oldStatus !== newStatus &&
        (newStatus === "LOW" || newStatus === "EMPTY")
      ) {
        await sendEmail({
          to: process.env.ADMIN_EMAIL,
          subject:
            newStatus === "EMPTY"
              ? `❌ Stock Empty: ${med.name}`
              : `⚠️ Low Stock Alert: ${med.name}`,
          html: `
            <p><b>${med.name}</b> stock status changed.</p>
            <p>
              Previous Qty: <b>${oldQty}</b><br/>
              Current Qty: <b>${newQty}</b>
            </p>
            <p>Status: <b>${newStatus}</b></p>
          `,
        });
      }
    }

    // 2. Create sale record (only if all stock updates succeeded)
    const sale = await Sale.create({
      patientName,
      patientPhone,
      items,
      grandTotal,
      cashier: session.user.name,
      date: new Date(),
    });

    return NextResponse.json(
      { message: "Sale completed & stock updated", sale },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/sales error:", err);
    return NextResponse.json(
      { message: "Failed to complete sale" },
      { status: 500 }
    );
  }
}

// ================= GET =================
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { items: [], message: "Access denied" },
        { status: 403 }
      );
    }

    await dbConnect();
    const sales = await Sale.find().sort({ date: -1 });

    const items = sales.flatMap((sale) =>
      sale.items.map((item) => ({
        _id: sale._id,
        uniqueKey: `${sale._id}-${item.name}`,
        customerName: sale.patientName,
        medicineName: item.name,
        quantity: item.quantity,
        price: item.price,
        totalAmount: item.total,
        pharmacist: sale.cashier,
        date: sale.date,
      }))
    );

    return NextResponse.json({ items }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { items: [], message: "Error" },
      { status: 500 }
    );
  }
}

// ================= DELETE =================
export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const period = searchParams.get("period");

    if (id) {
      await Sale.findByIdAndDelete(id);
      return NextResponse.json({ message: "Sale deleted" });
    }

    if (period) {
      const days = parseInt(period);
      if (isNaN(days)) {
        return NextResponse.json(
          { message: "Invalid period format" },
          { status: 400 }
        );
      }

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const result = await Sale.deleteMany({
        date: { $gte: startDate },
      });

      return NextResponse.json({
        message: `Successfully deleted ${result.deletedCount} records`,
      });
    }

    return NextResponse.json(
      { message: "Missing ID or Period" },
      { status: 400 }
    );
  } catch (err) {
    console.error("Delete Error:", err);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
