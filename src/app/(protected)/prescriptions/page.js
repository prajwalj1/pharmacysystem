"use client";

import { useState, useEffect } from "react";
import { FiPlus, FiX, FiSearch ,FiTrash2 } from "react-icons/fi";
import axios from "axios";

export default function PrescriptionPage() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    patientName: "",
    patientPhone: "",
    doctorName: "",
    medicines: [{ name: "", dosage: "", quantity: 1, instructions: "" }],
    notes: "",
  });

  // Validation state
  const [errors, setErrors] = useState({});

  const fetchPrescriptions = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/prescriptions");
      setPrescriptions(res.data.prescriptions);
    } catch (err) {
      console.error("Failed to fetch prescriptions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const handleAddMedicine = () => {
    setFormData({
      ...formData,
      medicines: [...formData.medicines, { name: "", dosage: "", quantity: 1, instructions: "" }],
    });
  };

  const handleMedicineChange = (index, key, value) => {
    const updated = [...formData.medicines];
    updated[index][key] = value;
    setFormData({ ...formData, medicines: updated });
  };

  const handleRemoveMedicine = (index) => {
    const updated = [...formData.medicines];
    updated.splice(index, 1);
    setFormData({ ...formData, medicines: updated });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this prescription?")) return;

    try {
      await axios.delete(`/api/prescriptions?id=${id}`);
      alert("Prescription deleted successfully");
      fetchPrescriptions(); // Refresh the list
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete prescription");
    }
  };

  // Client-side validation
  const validateForm = () => {
    const newErrors = {};

    // Patient Name
    if (!formData.patientName.trim()) newErrors.patientName = "Patient name is required";
    else if (!/^[A-Za-z\s]+$/.test(formData.patientName)) newErrors.patientName = "Patient name must contain letters only";

    // Patient Phone
    if (!formData.patientPhone.trim()) newErrors.patientPhone = "Patient phone is required";
    else if (!/^\d{10}$/.test(formData.patientPhone)) newErrors.patientPhone = "Phone must be exactly 10 digits";

    // Doctor Name
    if (!formData.doctorName.trim()) newErrors.doctorName = "Doctor name is required";
    else if (!/^[A-Za-z\s]+$/.test(formData.doctorName)) newErrors.doctorName = "Doctor name must contain letters only";

    // Medicines
    formData.medicines.forEach((m, idx) => {
      if (!m.name.trim()) newErrors[`med_name_${idx}`] = "Medicine name is required";
      if (!m.quantity || m.quantity < 1) newErrors[`med_qty_${idx}`] = "Quantity must be at least 1";
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; // stop submission if invalid

    try {
      await axios.post("/api/prescriptions", formData);
      alert("Prescription added successfully!");
      setFormData({
        patientName: "",
        patientPhone: "",
        doctorName: "",
        medicines: [{ name: "", dosage: "", quantity: 1, instructions: "" }],
        notes: "",
      });
      setErrors({});
      setShowForm(false);
      fetchPrescriptions();
    } catch (err) {
      console.error(err);
      alert("Failed to add prescription");
    }
  };

  const filtered = prescriptions.filter(
    (p) =>
      p.patientName.toLowerCase().includes(search.toLowerCase()) ||
      p.patientPhone.includes(search) ||
      p.doctorName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-indigo-50 py-11 sm:p-6 md:p-10 lg:p-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 sm:gap-0">
        <h1 className="text-3xl sm:text-4xl font-bold text-indigo-700">Prescriptions</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
        >
          <FiPlus /> New Prescription
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center mb-4 bg-white rounded-xl shadow-md p-2 sm:p-3 w-full sm:w-1/2">
        <FiSearch className="text-indigo-500 text-xl mr-2" />
        <input
          type="text"
          placeholder="Search by patient, doctor, or phone..."
          className="w-full bg-transparent focus:outline-none text-gray-700 placeholder-gray-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-x-auto border border-indigo-100">
        <table className="w-full text-sm sm:text-base divide-y divide-indigo-100">
          <thead className="bg-indigo-100 text-indigo-700">
            <tr>
              <th className="p-3 text-left">SN</th>
              <th className="p-3 text-left">Patient</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Doctor</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="6" className="p-6 text-center">Loading...</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-500">No prescriptions found</td>
              </tr>
            ) : (
              filtered.map((p, idx) => (
                <tr key={p._id} className="hover:bg-indigo-50 transition">
                  <td className="p-3">{filtered.length - idx}</td>
                  <td className="p-3">{p.patientName}</td>
                  <td className="p-3">{p.patientPhone}</td>
                  <td className="p-3">{p.doctorName}</td>
                  <td className="p-3">{new Date(p.date).toLocaleDateString()}</td>


<td className="p-3">
  <div className="flex items-center gap-2">
    {/* View Button */}
    <button
      className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium shadow-sm"
      onClick={() => setSelectedPrescription(p)}
    >
      View
    </button>
    
    {/* Delete Button - Styled to match your theme */}
    <button
      className="px-3 py-1 bg-white border border-red-200 text-red-500 rounded-lg hover:bg-red-50 hover:border-red-300 transition text-sm font-medium shadow-sm flex items-center gap-1"
      onClick={() => handleDelete(p._id)}
    >
      <FiTrash2 size={14} />
      <span>Delete</span>
    </button>
  </div>
</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Prescription Modal */}
      {selectedPrescription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4 sm:px-0">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 sm:p-8 relative shadow-2xl overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-4 right-4 sm:top-6 sm:right-6 text-gray-500 hover:text-gray-800 rounded-full p-1 sm:p-2 bg-gray-100 hover:bg-gray-200 transition"
              onClick={() => setSelectedPrescription(null)}
            >
              <FiX size={24} />
            </button>
            <h2 className="text-2xl sm:text-3xl font-bold text-indigo-700 mb-4">{selectedPrescription.patientName}</h2>
            <p className="mb-2 text-gray-700"><span className="font-medium">Phone:</span> {selectedPrescription.patientPhone}</p>
            <p className="mb-2 text-gray-700"><span className="font-medium">Doctor:</span> {selectedPrescription.doctorName}</p>
            <p className="mb-4 text-gray-700"><span className="font-medium">Notes:</span> {selectedPrescription.notes || "-"}</p>

            <h3 className="font-semibold text-lg sm:text-xl text-indigo-700 mb-2">Medicines:</h3>
            <ul className="space-y-2 max-h-64 overflow-y-auto">
              {selectedPrescription.medicines.map((m, idx) => (
                <li key={idx} className="p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                  <p><span className="font-medium">Name:</span> {m.name}</p>
                  <p><span className="font-medium">Dosage:</span> {m.dosage}</p>
                  <p><span className="font-medium">Quantity:</span> {m.quantity}</p>
                  <p><span className="font-medium">Instructions:</span> {m.instructions}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Add Prescription Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4 sm:px-0">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 sm:p-8 relative shadow-2xl overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-4 right-4 sm:top-6 sm:right-6 text-gray-500 hover:text-gray-800 rounded-full p-1 sm:p-2 bg-gray-100 hover:bg-gray-200 transition"
              onClick={() => setShowForm(false)}
            >
              <FiX size={24} />
            </button>
            <h2 className="text-2xl sm:text-3xl font-bold text-indigo-700 mb-4">New Prescription</h2>
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Patient Name */}
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-gray-700">Patient Name</label>
                <input
                  type="text"
                  className={`w-full p-3 border rounded-xl focus:ring-2 outline-none ${errors.patientName ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-indigo-500"}`}
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                />
                {errors.patientName && <span className="text-red-500 text-sm mt-1">{errors.patientName}</span>}
              </div>

              {/* Patient Phone */}
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-gray-700">Patient Phone</label>
                <input
                  type="text"
                  className={`w-full p-3 border rounded-xl focus:ring-2 outline-none ${errors.patientPhone ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-indigo-500"}`}
                  value={formData.patientPhone}
                  onChange={(e) => setFormData({ ...formData, patientPhone: e.target.value })}
                />
                {errors.patientPhone && <span className="text-red-500 text-sm mt-1">{errors.patientPhone}</span>}
              </div>

              {/* Doctor Name */}
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-gray-700">Doctor Name</label>
                <input
                  type="text"
                  className={`w-full p-3 border rounded-xl focus:ring-2 outline-none ${errors.doctorName ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-indigo-500"}`}
                  value={formData.doctorName}
                  onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                />
                {errors.doctorName && <span className="text-red-500 text-sm mt-1">{errors.doctorName}</span>}
              </div>

              {/* Medicines */}
              <div className="space-y-3">
                {formData.medicines.map((m, idx) => (
                  <div key={idx} className="p-3 border rounded-xl bg-indigo-50 relative flex flex-col gap-2">
                    <button
                      type="button"
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700 rounded-full p-1 bg-white hover:bg-red-100 transition"
                      onClick={() => handleRemoveMedicine(idx)}
                    >
                      <FiX />
                    </button>

                    <div className="flex flex-col sm:flex-row sm:gap-2">
                      <div className="flex-1 flex flex-col">
                        <label className="text-gray-700 font-medium mb-1">Medicine Name</label>
                        <input
                          type="text"
                          className={`w-full p-2 border rounded-xl ${errors[`med_name_${idx}`] ? "border-red-500" : "border-gray-300"}`}
                          value={m.name}
                          onChange={(e) => handleMedicineChange(idx, "name", e.target.value)}
                        />
                        {errors[`med_name_${idx}`] && <span className="text-red-500 text-sm mt-1">{errors[`med_name_${idx}`]}</span>}
                      </div>
                      <div className="flex-1 flex flex-col">
                        <label className="text-gray-700 font-medium mb-1">Dosage</label>
                        <input
                          type="text"
                          className="w-full p-2 border rounded-xl border-gray-300"
                          value={m.dosage}
                          onChange={(e) => handleMedicineChange(idx, "dosage", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:gap-2">
                      <div className="flex-1 flex flex-col">
                        <label className="text-gray-700 font-medium mb-1">Quantity</label>
                        <input
                          type="number"
                          className={`w-full p-2 border rounded-xl ${errors[`med_qty_${idx}`] ? "border-red-500" : "border-gray-300"}`}
                          value={m.quantity}
                          onChange={(e) => handleMedicineChange(idx, "quantity", e.target.value)}
                          min={1}
                        />
                        {errors[`med_qty_${idx}`] && <span className="text-red-500 text-sm mt-1">{errors[`med_qty_${idx}`]}</span>}
                      </div>
                      <div className="flex-1 flex flex-col">
                        <label className="text-gray-700 font-medium mb-1">Instructions</label>
                        <input
                          type="text"
                          className="w-full p-2 border rounded-xl border-gray-300"
                          value={m.instructions}
                          onChange={(e) => handleMedicineChange(idx, "instructions", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
                  onClick={handleAddMedicine}
                >
                  <FiPlus /> Add Medicine
                </button>
              </div>

              {/* Notes */}
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-gray-700">Notes</label>
                <textarea
                  className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition font-semibold"
              >
                Save Prescription
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
