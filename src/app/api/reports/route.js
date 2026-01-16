import { NextResponse } from "next/server";
import dbConnect from "@/dbconfig/dbConnect";
import Sale from "@/models/sale";
import Medicine from "@/models/medicine"; // Import Medicine model
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ items: [], message: "Access denied" }, { status: 403 });
    }

    await dbConnect();
    
    // Fetch all sales and all medicines to map purchase prices
    const [sales, medicines] = await Promise.all([
      Sale.find().sort({ date: -1 }),
      Medicine.find().select("name purchasePrice")
    ]);

    // Create a lookup map for purchase prices
    const priceMap = {};
    medicines.forEach(m => {
      priceMap[m.name] = m.purchasePrice;
    });

    const items = sales.flatMap((sale) =>
      sale.items.map((item) => ({
        _id: `${sale._id}-${item.name}`,
        customerName: sale.patientName,
        medicineName: item.name,
        quantity: item.quantity,
        price: item.price,
        // Get purchase price from map, default to 0 if not found
        purchasePrice: priceMap[item.name] || 0, 
        totalAmount: item.total,
        pharmacist: sale.cashier,
        date: sale.date,
      }))
    );

    return NextResponse.json({ items }, { status: 200 });
  } catch (err) {
    console.error("GET /api/reports error:", err);
    return NextResponse.json({ items: [], message: "Failed to fetch" }, { status: 500 });
  }
}