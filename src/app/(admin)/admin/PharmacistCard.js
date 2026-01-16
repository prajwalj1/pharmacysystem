"use client";

import { FiUsers } from "react-icons/fi";

export default function PharmacistCard({ count }) {
  return (
    <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition flex items-center gap-4">
      <FiUsers className="text-4xl text-green-500" />
      <div>
        <p className="text-2xl font-bold">{count}</p>
        <p className="text-gray-500">Pharmacists</p>
      </div>
    </div>
  );
}
