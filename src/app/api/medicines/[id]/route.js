import { NextResponse } from "next/server";
import dbConnect from "@/dbconfig/dbConnect";
import Medicine from "@/models/medicine";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { sendEmail } from "@/lib/stockEmail";

// ------------------ DELETE ------------------
export async function DELETE(req, context) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN")
      return NextResponse.json({ message: "Admin only" }, { status: 403 });

    await dbConnect();

    // 🔹 Await params because it's a promise
    const params = await context.params;
    const id = params.id;

    const deleted = await Medicine.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ message: "Not found" }, { status: 404 });

    // Notify admin
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `Medicine Deleted: ${deleted.name}`,
      html: `<p>Medicine <b>${deleted.name}</b> has been deleted from inventory.</p>`,
    });

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Delete failed" }, { status: 500 });
  }
}

// ------------------ PUT ------------------
export async function PUT(req, context) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN")
      return NextResponse.json({ message: "Admin only" }, { status: 403 });

    await dbConnect();

    // 🔹 Await params here as well
    const params = await context.params;
    const id = params.id;

    const body = await req.json();

    const oldMedicine = await Medicine.findById(id);
    if (!oldMedicine)
      return NextResponse.json({ message: "Medicine not found" }, { status: 404 });

    const updated = await Medicine.findByIdAndUpdate(id, body, { new: true });

    // Notify if stock changed
    if (oldMedicine.quantityInStock !== updated.quantityInStock) {
      await sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: `Stock Updated: ${updated.name}`,
        html: `<p>Medicine <b>${updated.name}</b> stock changed from <b>${oldMedicine.quantityInStock}</b> to <b>${updated.quantityInStock}</b></p>`,
      });
    }

    return NextResponse.json({ message: "Updated", updated });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Update failed" }, { status: 500 });
  }
}
