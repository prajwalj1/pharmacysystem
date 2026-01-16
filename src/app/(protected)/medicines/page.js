"use client";

import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import MedicineCard from "@/component/MedicineCard";
import { FiSearch, FiFilter } from "react-icons/fi";

export default function Medicines() {
  const [meds, setMeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    async function fetchMeds() {
      try {
        const res = await axios.get("/api/medicines");
        setMeds(res.data || []);
      } catch (err) {
        console.error("Failed to fetch medicines", err);
      } finally {
        setLoading(false);
      }
    }
    fetchMeds();
  }, []);

  const categories = useMemo(() => {
    const set = new Set(meds.map((m) => m.category).filter(Boolean));
    return ["All", ...set];
  }, [meds]);

  const filteredMeds = useMemo(() => {
    return meds.filter((m) => {
      const matchName = m.name?.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === "All" || m.category === category;
      return matchName && matchCategory;
    });
  }, [meds, search, category]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg animate-pulse">Loading medicines...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-white px-4 sm:px-6 py-11">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-extrabold text-indigo-800">Medicine Stock</h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search medicine..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 transition shadow-sm"
            />
          </div>

          <div className="relative w-full sm:w-48">
            <FiFilter className="absolute left-3 top-3 text-gray-400" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 transition shadow-sm"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredMeds.length === 0 ? (
        <p className="text-center text-gray-500 text-lg mt-20 animate-pulse">
          No medicines found
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMeds.map((m) => (
            <MedicineCard key={m._id} med={m} />
          ))}
        </div>
      )}
    </main>
  );
}
