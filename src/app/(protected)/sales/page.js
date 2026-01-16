"use client";

import { useState, useEffect } from "react";
import {
  FiShoppingCart,
  FiUser,
  FiPhone,
  FiPlus,
  FiTrash2,
  FiCheckCircle,
  FiAlertTriangle,
} from "react-icons/fi";
import axios from "axios";

export default function NewSalePage() {
  const [patient, setPatient] = useState({ name: "", phone: "" });
  const [medicine, setMedicine] = useState({
    medicineId: "",
    name: "",
    price: 0,
    quantity: 1,
  });
  const [cart, setCart] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  // Validation errors
  const [errors, setErrors] = useState({ name: "", phone: "" });

  const inputClass =
    "w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all";

  useEffect(() => {
    async function fetchMedicines() {
      try {
        const res = await axios.get("/api/medicines", { withCredentials: true });
        setMedicines(res.data || []);
      } catch (err) {
        console.error("Failed to fetch medicines:", err);
        showToast("Failed to load medicines list", "error");
      }
    }
    fetchMedicines();
  }, []);

  const handleMedicineSelect = (id) => {
    const med = medicines.find((m) => m._id === id);
    if (!med) return;

    setMedicine({
      medicineId: med._id,
      name: med.name,
      price: med.sellPrice || 0,
      quantity: 1,
      maxQuantity: med.quantityInStock || 0,
    });
  };

  const addToCart = () => {
    if (!medicine.medicineId || !medicine.name || !medicine.price) {
      showToast("Please select a medicine first", "error");
      return;
    }

    if (medicine.quantity <= 0) {
      showToast("Quantity must be at least 1", "error");
      return;
    }

    if (medicine.quantity > medicine.maxQuantity) {
      showToast(
        `Only ${medicine.maxQuantity} units available in stock`,
        "error"
      );
      return;
    }

    setCart([
      ...cart,
      {
        ...medicine,
        total: medicine.price * medicine.quantity,
      },
    ]);

    setMedicine({
      medicineId: "",
      name: "",
      price: 0,
      quantity: 1,
      maxQuantity: 0,
    });
  };

  const removeItem = (index) => setCart(cart.filter((_, i) => i !== index));

  const grandTotal = cart.reduce((sum, item) => sum + item.total, 0);

  const validatePatient = () => {
    let valid = true;
    let errs = { name: "", phone: "" };

    if (!patient.name.trim()) {
      errs.name = "Patient name is required";
      valid = false;
    } else if (!/^[A-Za-z\s]+$/.test(patient.name.trim())) {
      errs.name = "Name should contain letters only";
      valid = false;
    }

    if (!patient.phone.trim()) {
      errs.phone = "Phone number is required";
      valid = false;
    } else if (!/^\d{10}$/.test(patient.phone.trim())) {
      errs.phone = "Phone must be exactly 10 digits";
      valid = false;
    }

    setErrors(errs);
    return valid;
  };

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 4500);
  };

  const completeSale = async () => {
    if (!validatePatient()) return;
    if (cart.length === 0) {
      showToast("Cart cannot be empty", "error");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        patientName: patient.name.trim(),
        patientPhone: patient.phone.trim(),
        items: cart.map((item) => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          total: item.total,
        })),
        grandTotal: Number(grandTotal.toFixed(2)),
      };

      await axios.post("/api/sales", payload, { withCredentials: true });

      // Generate bill
      const billContent = `
        <html>
          <head>
            <title>PharmaCare Bill</title>
            <style>
              body { font-family: 'Segoe UI', sans-serif; margin: 20px; color: #111; }
              .logo { width: 80px; height: 80px; display: block; margin: 0 auto 10px; object-fit: contain; }
              h2 { text-align: center; color: #4F46E5; margin: 5px 0; }
              .pharmacy-info { text-align: center; font-size: 14px; margin-bottom: 20px; }
              .patient-info { margin-bottom: 20px; font-size: 14px; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
              th, td { border: 1px solid #999; padding: 8px; text-align: left; }
              th { background-color: #4F46E5; color: white; }
              tfoot td { font-weight: bold; }
              .footer { text-align: center; font-size: 12px; margin-top: 30px; }
            </style>
          </head>
          <body>
            <img src="/logo/logo.png" class="logo" alt="PharmaCare Logo" />
            <h2>PharmaCare Pharmacy</h2>
            <div class="pharmacy-info">
              Mechinagar-7, Jhapa, Nepal<br/>
              Phone: 9815790091 | Email: info@pharmacare.com
            </div>

            <div class="patient-info">
              <strong>Patient Details:</strong><br/>
              Name: ${patient.name}<br/>
              Phone: ${patient.phone}<br/>
              Date: ${new Date().toLocaleString()}
            </div>

            <table>
              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>Qty</th>
                  <th>Price (₹)</th>
                  <th>Total (₹)</th>
                </tr>
              </thead>
              <tbody>
                ${cart
                  .map(
                    (item) => `
                  <tr>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>₹${item.price.toFixed(2)}</td>
                    <td>₹${item.total.toFixed(2)}</td>
                  </tr>`
                  )
                  .join("")}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3">Grand Total</td>
                  <td>₹${grandTotal.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>

            <div class="footer">
              Thank you for visiting PharmaCare Pharmacy!<br/>
              Please consult your doctor for proper usage of medicines.
            </div>

            <script>
              window.onload = function() { window.print(); }
            </script>
          </body>
        </html>`;

      const printWindow = window.open("", "_blank", "width=800,height=900");
      printWindow.document.open();
      printWindow.document.write(billContent);
      printWindow.document.close();

      // Reset form
      setPatient({ name: "", phone: "" });
      setCart([]);
      setErrors({ name: "", phone: "" });
      setMedicine({ medicineId: "", name: "", price: 0, quantity: 1, maxQuantity: 0 });

      showToast("Sale completed successfully! Bill generated.", "success");
    } catch (err) {
      console.error("Sale error:", err);

      let errorMessage = "Failed to complete sale";

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.status === 400) {
        errorMessage = "Invalid request - check stock or data format";
      } else if (err.response?.status === 403) {
        errorMessage = "You don't have permission to complete sales";
      } else if (err.response?.status === 404) {
        errorMessage = "One or more medicines not found";
      } else if (err.response?.status >= 500) {
        errorMessage = "Server error - please try again later";
      } else if (!err.response) {
        errorMessage = "Cannot reach the server - check your connection";
      }

      showToast(`❌ ${errorMessage}`, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-8 md:p-8 relative">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-indigo-600 text-white p-6 flex items-center gap-3">
          <FiShoppingCart className="text-3xl" />
          <div>
            <h1 className="text-2xl font-bold">New Sale</h1>
            <p className="text-indigo-100 text-sm">Sell medicines to patients</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          {/* LEFT - Form & Cart */}
          <div className="md:col-span-2 space-y-6">
            {/* Patient Info */}
            <section className="bg-slate-50 p-5 rounded-xl border">
              <h2 className="font-semibold flex items-center gap-2 mb-4 text-lg">
                <FiUser /> Patient Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    placeholder="Patient Name *"
                    className={inputClass}
                    value={patient.name}
                    onChange={(e) => setPatient({ ...patient, name: e.target.value })}
                  />
                  {errors.name && (
                    <p className="text-red-600 mt-1 text-sm">{errors.name}</p>
                  )}
                </div>
                <div>
                  <input
                    placeholder="Contact Number *"
                    className={inputClass}
                    value={patient.phone}
                    onChange={(e) => setPatient({ ...patient, phone: e.target.value })}
                  />
                  {errors.phone && (
                    <p className="text-red-600 mt-1 text-sm">{errors.phone}</p>
                  )}
                </div>
              </div>
            </section>

            {/* Add Medicine */}
            <section className="bg-slate-50 p-5 rounded-xl border">
              <h2 className="font-semibold flex items-center gap-2 mb-4 text-lg">
                <FiPlus /> Add Medicine
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <select
                  className={`${inputClass} md:col-span-2`}
                  value={medicine.medicineId}
                  onChange={(e) => handleMedicineSelect(e.target.value)}
                >
                  <option value="">Select Medicine</option>
                  {medicines.map((med) => (
                    <option key={med._id} value={med._id}>
                      {med.name} ({med.brand}) – ₹{med.sellPrice}
                      {med.quantityInStock <= 0
                        ? " • OUT OF STOCK"
                        : ` • ${med.quantityInStock} left`}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  placeholder="Price"
                  className={inputClass}
                  value={medicine.price}
                  disabled
                />

                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max={medicine.maxQuantity || 9999}
                    placeholder="Quantity"
                    className={`${inputClass} ${
                      medicine.maxQuantity === 0 ? "border-red-400 bg-red-50" : ""
                    }`}
                    value={medicine.quantity}
                    onChange={(e) =>
                      setMedicine({
                        ...medicine,
                        quantity: Math.max(1, Math.min(Number(e.target.value), medicine.maxQuantity || 9999)),
                      })
                    }
                  />
                  {medicine.maxQuantity > 0 && medicine.quantity > 0 && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                      / {medicine.maxQuantity}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={addToCart}
                className="mt-5 flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition shadow-sm"
                disabled={!medicine.medicineId}
              >
                <FiPlus /> Add to Cart
              </button>
            </section>

            {/* Cart Table */}
            <section className="bg-white rounded-xl border overflow-x-auto shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="p-4 text-left">Medicine</th>
                    <th className="p-4 text-center">Qty</th>
                    <th className="p-4 text-center">Price</th>
                    <th className="p-4 text-center">Total</th>
                    <th className="p-4 w-12"></th>
                  </tr>
                </thead>
                <tbody>
                  {cart.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center p-10 text-gray-400 italic">
                        No medicines added yet...
                      </td>
                    </tr>
                  ) : (
                    cart.map((item, index) => (
                      <tr key={index} className="border-t hover:bg-slate-50">
                        <td className="p-4">{item.name}</td>
                        <td className="p-4 text-center">{item.quantity}</td>
                        <td className="p-4 text-center">₹{item.price.toFixed(2)}</td>
                        <td className="p-4 text-center font-medium">₹{item.total.toFixed(2)}</td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => removeItem(index)}
                            className="text-red-500 hover:text-red-700 transition p-1 rounded hover:bg-red-50"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </section>
          </div>

          {/* RIGHT - Summary */}
          <div className="bg-indigo-50 p-6 rounded-xl border space-y-6">
            <div className="flex flex-col items-center space-y-3">
              <img src="/logo/logo.png" alt="Pharmacy Logo" className="w-20 h-20 object-contain" />
              <h3 className="text-xl font-bold text-indigo-700">PharmaCare</h3>
              <div className="text-center text-sm text-gray-700">
                {patient.name || "Patient Name"}<br />
                {patient.phone || "Phone Number"}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-200">
                  <tr>
                    <th className="p-3 text-left">Medicine</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-center p-6 text-gray-400">
                        No items added
                      </td>
                    </tr>
                  ) : (
                    cart.map((item, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="p-3">{item.name}</td>
                        <td className="p-3 text-center">{item.quantity}</td>
                        <td className="p-3 text-right font-medium">₹{item.total.toFixed(2)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
                <tfoot className="font-bold">
                  <tr>
                    <td colSpan={2} className="p-3 text-right">
                      Grand Total
                    </td>
                    <td className="p-3 text-right text-lg">₹{grandTotal.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <button
              onClick={completeSale}
              disabled={loading || cart.length === 0}
              className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all shadow-lg
                ${loading || cart.length === 0
                  ? "bg-green-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 active:bg-green-800"}`}
            >
              {loading ? "Processing..." : "Complete Sale"}
              {!loading && <FiCheckCircle size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md">
          <div
            className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl text-white font-medium
              ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}
          >
            {toast.type === "success" ? (
              <FiCheckCircle className="text-2xl flex-shrink-0" />
            ) : (
              <FiAlertTriangle className="text-2xl flex-shrink-0" />
            )}
            <span className="truncate">{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}