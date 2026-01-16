"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { FiSearch, FiDownload } from "react-icons/fi";

export default function SalesReport() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    pharmacist: "All",
  });

  useEffect(() => {
    async function fetchSales() {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get("/api/reports", { withCredentials: true });
        setSales(res.data.items || []);
      } catch (err) {
        setError("Failed to fetch sales.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchSales();
  }, []);

  const exportToCSV = () => {
    if (filteredSales.length === 0) {
      alert("No data to export");
      return;
    }

    const headers = [
      "SN", "Sale ID", "Medicine Name", "Customer Name", 
      "Quantity", "Purchase Price", "Sell Price", "Total Amount", "Pharmacist", "Date"
    ];

    const rows = filteredSales.map((sale, idx) => [
      idx + 1,
      sale._id,
      sale.medicineName,
      sale.customerName,
      sale.quantity,
      sale.purchasePrice,
      sale.price,
      sale.totalAmount,
      sale.pharmacist,
      new Date(sale.date).toLocaleString(),
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + 
      [headers, ...rows].map(e => e.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sales_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredSales = (sales || []).filter((s) => {
    const pharmacistMatch = filters.pharmacist === "All" || s.pharmacist === filters.pharmacist;
    const searchMatch =
      (s.medicineName || "").toLowerCase().includes(search.toLowerCase()) ||
      (s.customerName || "").toLowerCase().includes(search.toLowerCase());
    return pharmacistMatch && searchMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-gray-100 p-2 sm:p-4 md:p-6 lg:p-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-indigo-700 mb-4 sm:mb-6 md:mb-8">Sales Report</h1>

      <div className="flex flex-col gap-3 mb-3 sm:mb-4 md:mb-6">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 flex-wrap">
          <select
            className="p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            value={filters.pharmacist}
            onChange={(e) => setFilters({ ...filters, pharmacist: e.target.value })}
          >
            <option value="All">All Pharmacists</option>
            {[...new Set(sales.map((s) => s.pharmacist))].map((ph, idx) => (
              <option key={`ph-${idx}`} value={ph}>{ph}</option>
            ))}
          </select>

          <div className="relative flex-1 items-center">
            <FiSearch className="absolute left-3 top-3 text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Search by medicine or customer..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="mb-3 sm:mb-4 md:mb-6 flex justify-end">
        <button onClick={exportToCSV} className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition text-sm">
          <FiDownload /> Export CSV
        </button>
      </div>

      {loading ? (
        <div className="text-center p-10">Loading...</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-indigo-100">
          <table className="w-full text-xs sm:text-sm divide-y divide-indigo-100">
            <thead className="bg-indigo-100 text-indigo-700">
              <tr>
                <th className="p-3 text-left">SN</th>
                <th className="p-3 text-left">Medicine Name</th>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-center">Qty</th>
                <th className="p-3 text-center">Purchase Price</th>
                <th className="p-3 text-center">Sell Price</th>
                <th className="p-3 text-center">Total</th>
                <th className="p-3 text-center">Pharmacist</th>
                <th className="p-3 text-center">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSales.map((sale, idx) => (
                <tr key={sale._id} className="hover:bg-indigo-50 transition">
                  <td className="p-3">{idx + 1}</td>
                  <td className="p-3 font-medium">{sale.medicineName}</td>
                  <td className="p-3">{sale.customerName}</td>
                  <td className="p-3 text-center">{sale.quantity}</td>
                  <td className="p-3 text-center text-red-600">₹{sale.purchasePrice}</td>
                  <td className="p-3 text-center text-green-600">₹{sale.price}</td>
                  <td className="p-3 text-center font-bold">₹{sale.totalAmount}</td>
                  <td className="p-3 text-center">{sale.pharmacist}</td>
                  <td className="p-3 text-center">{new Date(sale.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}