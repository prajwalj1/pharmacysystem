import { NextResponse } from "next/server";
import dbConnect from "@/dbconfig/dbConnect";
import Prescription from "@/models/prescription";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !["PHARMACIST", "ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    await dbConnect();

    const body = await req.json();
    const { patientName, patientPhone, doctorName, medicines } = body;

    // ✅ Server-side validation

    // Patient Name: letters and spaces only
    if (!/^[A-Za-z\s]+$/.test(patientName)) {
      return NextResponse.json({ message: "Patient name must contain letters only" }, { status: 400 });
    }

    // Patient Phone: exactly 10 digits
    if (!/^\d{10}$/.test(patientPhone)) {
      return NextResponse.json({ message: "Patient phone must be exactly 10 digits" }, { status: 400 });
    }

    // Doctor Name: letters and spaces only
    if (!/^[A-Za-z\s]+$/.test(doctorName)) {
      return NextResponse.json({ message: "Doctor name must contain letters only" }, { status: 400 });
    }

    // Medicines array validation
    if (!Array.isArray(medicines) || medicines.length === 0) {
      return NextResponse.json({ message: "At least one medicine is required" }, { status: 400 });
    }

    for (let i = 0; i < medicines.length; i++) {
      const m = medicines[i];
      if (!m.name || typeof m.name !== "string") {
        return NextResponse.json({ message: `Medicine name at index ${i + 1} is required` }, { status: 400 });
      }
      if (!m.quantity || Number(m.quantity) < 1) {
        return NextResponse.json({ message: `Medicine quantity at index ${i + 1} must be at least 1` }, { status: 400 });
      }
      if (m.dosage && typeof m.dosage !== "string") {
        return NextResponse.json({ message: `Dosage at index ${i + 1} must be text` }, { status: 400 });
      }
      if (m.instructions && typeof m.instructions !== "string") {
        return NextResponse.json({ message: `Instructions at index ${i + 1} must be text` }, { status: 400 });
      }
    }

    // Save prescription
    const prescription = await Prescription.create({
      ...body,
      pharmacist: session.user.name,
    });

    return NextResponse.json(
      { message: "Prescription added", prescription },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/prescriptions error:", err);
    return NextResponse.json(
      { message: "Failed to add prescription" },
      { status: 500 }
    );
  }
}

// GET: Fetch all prescriptions
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !["PHARMACIST", "ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ message: "Access denied", prescriptions: [] }, { status: 403 });
    }

    await dbConnect();

    const prescriptions = await Prescription.find()
      .sort({ date: -1 }) // latest first
      .lean();

    return NextResponse.json({ prescriptions }, { status: 200 });
  } catch (err) {
    console.error("GET /api/prescriptions error:", err);
    return NextResponse.json({ message: "Failed to fetch prescriptions", prescriptions: [] }, { status: 500 });
  }
}


export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !["PHARMACIST", "ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    await dbConnect();
    const deletedPrescription = await Prescription.findByIdAndDelete(id);

    if (!deletedPrescription) {
      return NextResponse.json({ message: "Prescription not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Prescription deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error("DELETE /api/prescriptions error:", err);
    return NextResponse.json({ message: "Failed to delete prescription" }, { status: 500 });
  }
}