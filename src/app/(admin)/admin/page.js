"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  FiDollarSign,
  FiUsers,
  FiPackage,
  FiActivity,
} from "react-icons/fi";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#6366f1", "#22c55e", "#f97316", "#ec4899", "#eab308"];

export default function AdminDashboard() {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    axios.get("/api/sales", { withCredentials: true }).then((res) => {
      setSales(res.data.items || []);
    });
  }, []);

  /* =====================
      Stats
  ====================== */
  const revenue = sales.reduce((a, b) => a + b.totalAmount, 0);
  const itemsSold = sales.reduce((a, b) => a + b.quantity, 0);
  const customers = new Set(sales.map((s) => s.customerName)).size;

  // Today’s sales
  const today = new Date().toDateString();
  const todaysSalesItems = sales.filter(
    (s) => new Date(s.date).toDateString() === today
  ).length;

  const todaysRevenue = sales
    .filter((s) => new Date(s.date).toDateString() === today)
    .reduce((a, b) => a + b.totalAmount, 0);

  /* =====================
      Top Medicines
  ====================== */
  const medicineData = Object.values(
    sales.reduce((acc, s) => {
      acc[s.medicineName] = acc[s.medicineName] || {
        name: s.medicineName,
        value: 0,
      };
      acc[s.medicineName].value += s.quantity;
      return acc;
    }, {})
  ).slice(0, 5);

  /* =====================
      Sales by Pharmacist
  ====================== */
  const pharmacistData = Object.values(
    sales.reduce((acc, s) => {
      acc[s.pharmacist] = acc[s.pharmacist] || {
        name: s.pharmacist,
        value: 0,
      };
      acc[s.pharmacist].value += s.totalAmount;
      return acc;
    }, {})
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-gray-900 text-white p-6 lg:p-10">
      <h1 className="text-4xl font-extrabold mb-8">
        🏥 Pharmacy Admin Dashboard
      </h1>

      {/* =====================
          STAT CARDS
      ====================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 mb-10">
        <Stat icon={<FiDollarSign />} label="Total Revenue" value={`₹${revenue}`} />
        <Stat icon={<FiPackage />} label="Items Sold" value={itemsSold} />
        <Stat icon={<FiUsers />} label="Customers" value={customers} />
        <Stat icon={<FiActivity />} label="Total Sales" value={sales.length} />
        <Stat
          icon={<FiActivity />}
          label="Today’s Sales"
          value={todaysSalesItems}
        />
        <Stat
          icon={<FiDollarSign />}
          label="Today’s Revenue"
          value={`₹${todaysRevenue}`}
        />
      </div>

      {/* =====================
          CHARTS (NEW)
      ====================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Medicines */}
        <Card title="💊 Top Selling Medicines">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={medicineData}
                dataKey="value"
                nameKey="name"
                innerRadius={50}
                outerRadius={90}
              >
                {medicineData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Sales by Pharmacist */}
        <Card title="👨‍⚕️ Sales by Pharmacist">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={pharmacistData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
              >
                {pharmacistData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* =====================
          RECENT SALES
      ====================== */}
      <div className="mt-10 bg-white/10 backdrop-blur-xl rounded-2xl">
        <h2 className="text-xl font-bold p-6 border-b border-white/20">
          🧾 Recent Transactions
        </h2>
        <table className="w-full text-sm">
          <thead className="bg-white/10">
            <tr>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3">Medicine</th>
              <th className="p-3">Qty</th>
              <th className="p-3">Total</th>
            </tr>
          </thead>
          <tbody>
            {sales.slice(0, 6).map((s) => (
              <tr key={s._id} className="border-b border-white/10">
                <td className="p-3">{s.customerName}</td>
                <td className="p-3">{s.medicineName}</td>
                <td className="p-3 text-center">{s.quantity}</td>
                <td className="p-3 text-center font-semibold">
                  ₹{s.totalAmount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* =====================
    COMPONENTS
===================== */
function Stat({ icon, label, value }) {
  return (
<div className="
  bg-white/10 backdrop-blur-xl rounded-2xl 
  p-4 
  shadow-xl 
  flex flex-col justify-center items-start gap-3
  min-h-[140px]             // ← increased minimum height
  h-auto
">

     <div className="flex items-center gap-4 w-full">
    <div className="text-indigo-400 text-4xl flex-shrink-0">
      {icon}
    </div>
   
  </div>

      <div className="flex-1 min-w-0 space-y-1">
        <p className="text-sm opacity-70 truncate font-medium">
          {label}
        </p>
        <p className="font-black truncate
                      bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent"
           title={String(value)}>  {/* full value on hover */}
          {value}
        </p>
      </div>
    </div>
  );
}



function Card({ title, children }) {
  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
      <h2 className="text-lg font-bold mb-4">{title}</h2>
      {children}
    </div>
  );
}
