"use client";

import { useState } from "react";
import { FiEye } from "react-icons/fi";

export default function MedicineCard({ med }) {
  const [showModal, setShowModal] = useState(false);

  const lowStock = med.quantityInStock <= 10;

  return (
    <>
      <div className="bg-gradient-to-br from-indigo-50 to-white shadow-lg hover:shadow-xl transition rounded-3xl p-5 flex flex-col justify-between gap-3 border border-gray-100">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-800 hover:text-indigo-600 transition">
              {med.name}
            </h3>
            {med.category && (
              <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full font-medium">
                {med.category}
              </span>
            )}
          </div>

          {med.genericName && (
            <p className="text-sm text-gray-500 mt-1">Generic: {med.genericName}</p>
          )}
          <p className="text-sm text-gray-600 mt-1">
            Price: <span className="font-semibold text-indigo-700">₹{med.sellPrice}</span>
          </p>
          <p className="text-sm mt-1 flex items-center gap-1">
            Stock:{" "}
            <span
              className={`font-semibold ${
                lowStock ? "text-red-600" : "text-green-600"
              }`}
            >
              {med.quantityInStock}
            </span>
            {lowStock && (
              <span className="text-red-600 text-xs font-medium">Low Stock</span>
            )}
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="mt-3 w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-xl shadow-md transition"
        >
          <FiEye /> View Details
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl shadow-xl max-w-md w-full p-6 relative animate-fade-in">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 font-bold text-xl"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-2 text-indigo-700">{med.name}</h2>

            {med.genericName && <p className="text-gray-600 mb-1">Generic: {med.genericName}</p>}
            {med.brand && <p className="text-gray-600 mb-1">Brand: {med.brand}</p>}
            {med.category && <p className="text-gray-600 mb-1">Category: {med.category}</p>}
            {med.batchNo && <p className="text-gray-600 mb-1">Batch No: {med.batchNo}</p>}
            {med.expiryDate && (
              <p className="text-gray-600 mb-1">
                Expiry Date: {new Date(med.expiryDate).toLocaleDateString()}
              </p>
            )}
            {med.description && (
              <p className="text-gray-700 mt-3">{med.description}</p>
            )}

            <button
              onClick={() => setShowModal(false)}
              className="mt-6 w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
