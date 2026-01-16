import { NextResponse } from "next/server";
import dbConnect from "@/dbconfig/dbConnect";
import Sale from "@/models/sale";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !["ADMIN", "PHARMACIST"].includes(session.user.role)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const sales = await Sale.find();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

    let totalRevenue = 0;
    let todayRevenue = 0;
    let thisMonthRevenue = 0;
    let lastMonthRevenue = 0;

    sales.forEach((sale) => {
      totalRevenue += sale.grandTotal;

      if (sale.date >= today) {
        todayRevenue += sale.grandTotal;
      }

      if (sale.date >= startOfMonth) {
        thisMonthRevenue += sale.grandTotal;
      }

      if (sale.date >= startOfLastMonth && sale.date <= endOfLastMonth) {
        lastMonthRevenue += sale.grandTotal;
      }
    });

    const growth =
      lastMonthRevenue === 0
        ? 0
        : Math.round(
            ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
          );

    return NextResponse.json({
      totalRevenue,
      todayRevenue,
      growth,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Failed to load summary" },
      { status: 500 }
    );
  }
}
