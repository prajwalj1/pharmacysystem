"use client";

import { useEffect, useState } from "react";
import { FiTruck, FiPlus, FiPhone, FiMail } from "react-icons/fi";

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    contactPerson: "",
    phone: "",
    email: "",
    address: "",
  });

  // FETCH SUPPLIERS
  const fetchSuppliers = async () => {
    const res = await fetch("/api/admin/suppliers");
    const data = await res.json();
    setSuppliers(data);
  };

//   useEffect(() => {
//     fetchSuppliers();
//   }, []);

  // ADD SUPPLIER
  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("/api/admin/suppliers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setForm({
      name: "",
      contactPerson: "",
      phone: "",
      email: "",
      address: "",
    });

    fetchSuppliers();
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-indigo-700 flex items-center gap-2">
          <FiTruck /> Suppliers
        </h1>
      </div>

      {/* ADD SUPPLIER CARD */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FiPlus /> Add Supplier
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            placeholder="Supplier Name"
            className="input"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            placeholder="Contact Person"
            className="input"
            value={form.contactPerson}
            onChange={(e) =>
              setForm({ ...form, contactPerson: e.target.value })
            }
            required
          />
          <input
            placeholder="Phone"
            className="input"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
          />
          <input
            placeholder="Email"
            className="input"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <textarea
            placeholder="Address"
            className="input md:col-span-2"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />

          <button className="md:col-span-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl font-semibold transition">
            Save Supplier
          </button>
        </form>
      </div>

      {/* SUPPLIERS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {suppliers.map((s) => (
          <div
            key={s._id}
            className="bg-gradient-to-br from-indigo-50 to-white rounded-2xl shadow hover:shadow-lg transition p-6"
          >
            <h3 className="text-lg font-bold text-indigo-700">
              {s.name}
            </h3>
            <p className="text-gray-600">{s.contactPerson}</p>

            <div className="mt-3 space-y-2 text-sm text-gray-700">
              <p className="flex items-center gap-2">
                <FiPhone /> {s.phone}
              </p>
              {s.email && (
                <p className="flex items-center gap-2">
                  <FiMail /> {s.email}
                </p>
              )}
            </div>

            <span
              className={`inline-block mt-4 px-3 py-1 text-xs rounded-full ${
                s.isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {s.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
