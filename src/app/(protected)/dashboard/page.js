"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import {
  FiShoppingCart,
  FiPackage,
  FiAlertTriangle,
  FiTrendingUp,
  FiFileText,
  FiUsers,
} from "react-icons/fi";
import { MdOutlineLocalPharmacy } from "react-icons/md";

export default function PharmacyDashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    salesToday: 0,
    totalMedicines: 0,
    lowStock: 0,
    growth: 0,
  });

  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);

        // ✅ Fetch medicines
        const medicineRes = await axios.get("/api/medicines");
        const medicines = medicineRes.data || [];

        // ✅ FIX: use quantityInStock
        const lowStock = medicines.filter(
          (m) => m.quantityInStock <= 10
        );

        setLowStockItems(lowStock.slice(0, 5));

        // Fetch sales summary
        const salesSummary = await axios.get("/api/sales/summary");
        const { totalRevenue, todayRevenue, growth } = salesSummary.data;

        setStats({
          totalRevenue,
          salesToday: todayRevenue,
          totalMedicines: medicines.length,
          lowStock: lowStock.length,
          growth,
        });
      } catch (err) {
        console.error("Dashboard fetch failed", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 sm:px-6 py-11">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Pharmacist Dashboard
          </h1>
          <p className="text-gray-500">Live pharmacy overview</p>
        </div>
        <div className="flex items-center gap-2 text-emerald-600 font-bold">
          <MdOutlineLocalPharmacy size={26} />
          Pharmacy Panel
        </div>
      </div>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard
          title="Total Revenue"
          value={`Rs. ${stats.totalRevenue}`}
          icon={<FiTrendingUp />}
          color="emerald"
        />
        <StatCard
          title="Today's Sales"
          value={`Rs. ${stats.salesToday}`}
          icon={<FiShoppingCart />}
          color="blue"
        />
        <StatCard
          title="Total Medicines"
          value={stats.totalMedicines}
          icon={<FiPackage />}
          color="purple"
        />
        <StatCard
          title="Low Stock"
          value={stats.lowStock}
          icon={<FiAlertTriangle />}
          color="yellow"
        />
      </section>

      {/* Quick Actions */}
      <section className="bg-white rounded-3xl shadow p-6 mb-10">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickAction title="New Sale" href="/sales" icon={<FiShoppingCart />} />
          <QuickAction title="Medicines" href="/medicines" icon={<FiPackage />} />
          <QuickAction title="Prescriptions" href="/prescriptions" icon={<FiFileText />} />
          <QuickAction title="Customers" href="/customers" icon={<FiUsers />} />
        </div>
      </section>

      {/* Alerts */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl shadow p-6">
          <h3 className="font-bold mb-4">Low Stock Alerts</h3>

          {lowStockItems.length === 0 ? (
            <p className="text-gray-500 text-sm">
              All medicines sufficiently stocked.
            </p>
          ) : (
            <ul className="space-y-3">
              {lowStockItems.map((m) => (
                <li
                  key={m._id}
                  className="flex justify-between bg-red-50 border border-red-100 px-4 py-2 rounded-xl"
                >
                  <span>{m.name}</span>
                  <span className="text-red-600 font-bold text-sm">
                    {m.quantityInStock} left
                  </span>
                </li>
              ))}
            </ul>
          )}

          <Link
            href="/medicines"
            className="inline-block mt-4 text-emerald-600 font-medium"
          >
            View inventory →
          </Link>
        </div>

        <div className="bg-gradient-to-br from-emerald-600 to-sky-500 text-white rounded-3xl p-6">
          <h3 className="font-bold mb-4">System Status</h3>
          <ul className="space-y-2 text-sm">
            <li>✔ Inventory connected</li>
            <li>✔ Sales tracking active</li>
            <li>✔ Prescriptions enabled</li>
            <li>✔ Customer records synced</li>
          </ul>
        </div>
      </section>
    </main>
  );
}

/* ---------- Components ---------- */

function StatCard({ title, value, icon, color }) {
  const map = {
    emerald: "bg-emerald-100 text-emerald-700",
    blue: "bg-blue-100 text-blue-700",
    yellow: "bg-yellow-100 text-yellow-700",
    purple: "bg-purple-100 text-purple-700",
  };

  return (
    <div className="bg-white rounded-3xl shadow p-6 flex gap-4 items-center">
      <div className={`p-4 rounded-xl ${map[color]} text-xl`}>{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
}

function QuickAction({ title, href, icon }) {
  return (
    <Link
      href={href}
      className="bg-gray-50 hover:bg-gray-100 border rounded-2xl p-4 flex flex-col items-center gap-2 transition"
    >
      <div className="text-xl text-emerald-600">{icon}</div>
      <span className="font-semibold text-sm">{title}</span>
    </Link>
  );
}
