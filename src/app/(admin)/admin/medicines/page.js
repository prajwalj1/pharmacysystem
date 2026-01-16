"use client";

import { useState } from "react";
import { 
  FiSave, FiPlusCircle, FiPackage, FiTag, 
  FiCalendar, FiDollarSign, FiLayers, FiInfo 
} from "react-icons/fi";
import axios from "axios";

export default function MedicineForm() {
  const [formData, setFormData] = useState({
    name: "",
    genericName: "",
    brand: "",
    category: "",
    batchNo: "",
    expiryDate: "",
    description: "",
    purchasePrice: "",
    sellPrice: "",
    quantityInStock: "",
    reorderLevel: "",
    supplierId: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Client-side validation function
  const validateForm = () => {
    // Required fields
    const requiredFields = [
      "name", "expiryDate", "purchasePrice", 
      "sellPrice", "quantityInStock"
    ];

    for (let field of requiredFields) {
      if (!formData[field] || formData[field].toString().trim() === "") {
        return `Field "${field}" is required.`;
      }
    }

    // Numbers validation
    const numberFields = ["purchasePrice", "sellPrice", "quantityInStock", "reorderLevel"];
    for (let field of numberFields) {
      if (formData[field] && isNaN(formData[field])) {
        return `Field "${field}" must be a valid number.`;
      }
    }

    // Expiry date must be in future
    if (formData.expiryDate) {
      const today = new Date();
      const expiry = new Date(formData.expiryDate);
      if (expiry <= today) {
        return "Expiry date must be a future date.";
      }
    }

    // Optional: Text length limits
    if (formData.name.length > 100) return "Medicine Name too long (max 100 chars)";
    if (formData.genericName.length > 100) return "Generic Name too long (max 100 chars)";
    if (formData.brand.length > 50) return "Brand too long (max 50 chars)";
    if (formData.batchNo.length > 50) return "Batch Number too long (max 50 chars)";
    if (formData.category.length > 50) return "Category too long (max 50 chars)";

    return null; // No error
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Client-side validation
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      await axios.post("/api/medicines", formData, { withCredentials: true });
      setSuccess("Medicine added to inventory successfully!");

      // Reset form
      setFormData({
        name: "", genericName: "", brand: "", category: "",
        batchNo: "", expiryDate: "", purchasePrice: "",
        sellPrice: "", quantityInStock: "", reorderLevel: "",
        supplierId: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Error adding medicine. Please check all fields.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-1px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-100">
        <div className="bg-indigo-700 p-8 text-white">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-lg">
              <FiPlusCircle className="text-3xl" />
            </div>
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight">Medicine Inventory</h2>
              <p className="text-indigo-100 mt-1">Add new stock records to the PHMS database.</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Status Messages */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 flex items-center gap-3">
              <span className="font-medium">{success}</span>
            </div>
          )}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center gap-3">
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section 1: Basic Information */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4 border-b pb-2">
                <FiInfo className="text-indigo-600" /> Basic Identification
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <CustomInput label="Medicine Name" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Paracetamol" icon={<FiPackage />} required />
                <CustomInput label="Generic Name" name="genericName" value={formData.genericName} onChange={handleChange} placeholder="e.g. Acetaminophen" icon={<FiTag />} />
                <CustomInput label="Brand / Manufacturer" name="brand" value={formData.brand} onChange={handleChange} placeholder="e.g. GSK" icon={<FiLayers />} />
                <CustomInput label="Category" name="category" value={formData.category} onChange={handleChange} placeholder="e.g. Analgesic" />
                <CustomInput label="Batch Number" name="batchNo" value={formData.batchNo} onChange={handleChange} placeholder="e.g. B-10293" />
                <CustomInput label="Expiry Date" name="expiryDate" value={formData.expiryDate} onChange={handleChange} type="date" icon={<FiCalendar />} required />
              </div>

              <div className="md:col-span-2 lg:col-span-3 flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700 ml-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Additional information about the medicine..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400 resize-none"
                  rows={4}
                ></textarea>
              </div>
            </section>

            {/* Section 2: Pricing & Stock */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4 border-b pb-2">
                <FiDollarSign className="text-indigo-600" /> Pricing & Inventory
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <CustomInput label="Purchase Price" name="purchasePrice" value={formData.purchasePrice} onChange={handleChange} type="number" placeholder="0.00" icon={<FiDollarSign />} required />
                <CustomInput label="Selling Price" name="sellPrice" value={formData.sellPrice} onChange={handleChange} type="number" placeholder="0.00" icon={<FiDollarSign />} required />
                <CustomInput label="Stock Quantity" name="quantityInStock" value={formData.quantityInStock} onChange={handleChange} type="number" placeholder="Units" icon={<FiPackage />} required />
                <CustomInput label="Reorder Level" name="reorderLevel" value={formData.reorderLevel} onChange={handleChange} type="number" placeholder="Min. Stock" />
              </div>
            </section>

            {/* Submit Area */}
            <div className="pt-6 border-t border-gray-100">
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-max px-10 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 flex items-center justify-center gap-3 transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Processing..." : "Save Medicine to Inventory"}
                <FiSave className="text-xl" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function CustomInput({ label, name, value, onChange, placeholder, type = "text", icon, required = false }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700 ml-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative group">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors">
            {icon}
          </div>
        )}
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full ${icon ? 'pl-10' : 'pl-4'} pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400`}
        />
      </div>
    </div>
  );
}
