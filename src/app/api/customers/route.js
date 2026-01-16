import dbConnect from "@/dbconfig/dbConnect";
import Sale from "@/models/sale";

export async function GET() {
  try {
    await dbConnect();

    // 1️⃣ Fetch all sales sorted by most recent first
    const sales = await Sale.find({}).sort({ date: -1 }).lean();

    // 2️⃣ Group sales by patientPhone
    const grouped = sales.reduce((acc, s) => {
      const phone = s.patientPhone;

      if (!acc[phone]) {
        acc[phone] = {
          name: s.patientName,
          phone,
          purchases: [],
          totalSpent: 0,
          lastPurchase: null,
        };
      }

      acc[phone].purchases.push({
        date: s.date,
        total: s.grandTotal,
        items: s.items,
      });

      acc[phone].totalSpent += s.grandTotal;

      // Always take most recent sale info
      if (!acc[phone].lastPurchase || s.date > acc[phone].lastPurchase) {
        acc[phone].lastPurchase = s.date;
        acc[phone].name = s.patientName;
      }

      return acc;
    }, {});

    // 3️⃣ Convert to array and sort by lastPurchase descending
    const enrichedCustomers = Object.values(grouped).sort(
      (a, b) => new Date(b.lastPurchase) - new Date(a.lastPurchase)
    );

    return new Response(JSON.stringify(enrichedCustomers), { status: 200 });
  } catch (err) {
    console.error("Failed to fetch customers with sales:", err);
    return new Response(
      JSON.stringify({ message: "Failed to fetch customers" }),
      { status: 500 }
    );
  }
}
