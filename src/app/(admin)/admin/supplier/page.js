"use client";

import { useEffect, useState } from "react";
import { FiPlus, FiTrash2, FiTruck } from "react-icons/fi";

export default function SupplierPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    license: "",
  });

  // Fetch suppliers
  useEffect(() => {
    async function fetchSuppliers() {
      const res = await fetch("/api/suppliers");
      const data = await res.json();
      setSuppliers(data);
    }
    fetchSuppliers();
  }, []);

  // Validation
  function validateForm() {
    let newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Supplier name is required";
    }

    if (!form.company.trim()) {
      newErrors.company = "Company name is required";
    }

    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(form.phone)) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // Add supplier
  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateForm()) return;

    await fetch("/api/suppliers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setForm({
      name: "",
      company: "",
      phone: "",
      email: "",
      license: "",
    });
    setErrors({});

    const res = await fetch("/api/suppliers");
    setSuppliers(await res.json());
  }

  // Delete supplier
  async function deleteSupplier(id) {
    await fetch(`/api/suppliers/${id}`, { method: "DELETE" });
    const res = await fetch("/api/suppliers");
    setSuppliers(await res.json());
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600">
          <FiTruck size={26} />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">
          Supplier Management
        </h1>
      </div>

      {/* Add Supplier */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow p-6 grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div>
          <input
            placeholder="Supplier Name *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="input"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        <div>
          <input
            placeholder="Company Name *"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            className="input"
          />
          {errors.company && (
            <p className="text-red-500 text-sm">{errors.company}</p>
          )}
        </div>

        <div>
          <input
            placeholder="Phone Number *"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="input"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone}</p>
          )}
        </div>

        <input
          placeholder="Email (optional)"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="input"
        />

        <input
          placeholder="License Number (optional)"
          value={form.license}
          onChange={(e) => setForm({ ...form, license: e.target.value })}
          className="input"
        />

        <button className="md:col-span-3 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl">
          <FiPlus /> Add Supplier
        </button>
      </form>

      {/* Supplier Table */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Company</th>
              <th className="p-4 text-left">Phone</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">License</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((s) => (
              <tr key={s._id} className="border-t">
                <td className="p-4">{s.name}</td>
                <td className="p-4">{s.company}</td>
                <td className="p-4">{s.phone}</td>
                <td className="p-4">{s.email || "-"}</td>
                <td className="p-4">{s.license || "-"}</td>
                <td className="p-4 text-center">
                  <button
                    onClick={() => deleteSupplier(s._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
            {suppliers.length === 0 && (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-500">
                  No suppliers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
