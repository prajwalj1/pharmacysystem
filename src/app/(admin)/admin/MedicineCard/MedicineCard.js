"use client";

import { FiBox } from "react-icons/fi";

export default function MedicineCard({ count }) {
  return (
    <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition flex items-center gap-4">
      <FiBox className="text-4xl text-indigo-500" />
      <div>
        <p className="text-2xl font-bold">{count}</p>
        <p className="text-gray-500">Medicines</p>
      </div>
    </div>
  );
}
