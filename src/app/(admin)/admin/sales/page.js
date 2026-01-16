"use client";

import { useState, useEffect } from "react";
import { FiShoppingCart, FiDollarSign, FiUsers, FiPackage, FiTrash2, FiCalendar } from "react-icons/fi";
import axios from "axios";

export default function SalesPage() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [timeRange, setTimeRange] = useState("all");
  const [modal, setModal] = useState({ show: false, id: null, period: null });

  useEffect(() => { fetchSales(); }, []);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/sales");
      setSales(Array.isArray(res.data.items) ? res.data.items : []);
    } catch (err) {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      let url = "/api/sales";
      if (modal.id) url += `?id=${modal.id}`;
      else if (modal.period) url += `?period=${modal.period}`;

      await axios.delete(url);
      setModal({ show: false, id: null, period: null });
      fetchSales(); // Refresh
    } catch (err) {
      alert("Delete failed");
    }
  };

  const filteredSales = sales.filter((s) => {
    const matchesSearch = s.customerName.toLowerCase().includes(search.toLowerCase()) ||
                          s.medicineName.toLowerCase().includes(search.toLowerCase());
    if (timeRange === "all") return matchesSearch;
    const diff = (new Date() - new Date(s.date)) / (1000 * 60 * 60 * 24);
    return matchesSearch && diff <= parseInt(timeRange);
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8 relative">
      {/* --- CENTERED MODAL --- */}
      {modal.show && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiTrash2 size={30} />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Confirm Delete</h3>
            <p className="text-gray-500 mt-2">Are you sure you want to delete? This action is permanent.</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setModal({ show: false })} className="flex-1 py-2 bg-gray-100 rounded-xl font-semibold">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-indigo-800 mb-8">Sales Overview</h1>

        {/* Filters Row */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input 
            type="text" placeholder="Search..." 
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 shadow-sm outline-none focus:ring-2 focus:ring-indigo-500"
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex gap-2">
            <select 
              className="px-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm outline-none"
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="7">Last 7 Days</option>
              <option value="15">Last 15 Days</option>
              <option value="30">Last 30 Days</option>
            </select>
            <button 
              onClick={() => setModal({ show: true, period: timeRange })}
              disabled={timeRange === "all"}
              className="px-4 py-3 bg-red-50 text-red-600 rounded-xl font-medium disabled:opacity-50"
            >
              Delete Period
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard icon={<FiShoppingCart />} label="Orders" value={filteredSales.length} color="text-blue-600" />
            <StatCard icon={<FiDollarSign />} label="Revenue" value={`₹${filteredSales.reduce((a,b)=>a+b.totalAmount,0)}`} color="text-green-600" />
            <StatCard icon={<FiPackage />} label="Units" value={filteredSales.reduce((a,b)=>a+b.quantity,0)} color="text-orange-600" />
            <StatCard icon={<FiUsers />} label="Customers" value={new Set(filteredSales.map(s=>s.customerName)).size} color="text-purple-600" />
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
                <tr>
                  <th className="p-4">S.N</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Medicine</th>
                  <th className="p-4 text-center">Qty</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
              {filteredSales.map((sale, index) => (
  <tr key={sale.uniqueKey} className="hover:bg-indigo-50/30 transition-colors">
    {/* Descending Index: Total length minus the current index */}
    <td className="p-4 text-gray-400 font-medium">
      {filteredSales.length - index}
    </td>
    
    <td className="p-4 font-semibold text-gray-700">{sale.customerName}</td>
    <td className="p-4">{sale.medicineName}</td>
    <td className="p-4 text-center">{sale.quantity}</td>
    <td className="p-4 font-bold text-indigo-700">₹{sale.totalAmount}</td>
    <td className="p-4 text-gray-500 text-sm">{new Date(sale.date).toLocaleDateString()}</td>
    <td className="p-4 text-center">
      <button 
        onClick={() => setModal({ show: true, id: sale._id })}
        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
      >
        <FiTrash2 size={18} />
      </button>
    </td>
  </tr>
))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
      <div className={`p-4 rounded-xl bg-gray-50 ${color} text-2xl`}>{icon}</div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}