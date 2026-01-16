"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { FiEdit, FiTrash2, FiBell, FiX, FiSave, FiAlertTriangle, FiLoader } from "react-icons/fi";

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [alerts, setAlerts] = useState([]);
  const [showAlerts, setShowAlerts] = useState(false);
  const [filters, setFilters] = useState({ category: "All", status: "All" });

  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => { fetchProducts(); }, []);

  async function fetchProducts() {
    setLoading(true);
    try {
      const res = await axios.get("/api/medicines");
      const data = res.data;
      const stockAlerts = data
        .filter((p) => p.quantityInStock <= 150)
        .map((p) => ({
          productId: p._id,
          name: p.name,
          status: p.quantityInStock === 0 ? "Empty" : "Low Stock",
          quantity: p.quantityInStock,
        }));
      setAlerts(stockAlerts);
      setProducts(data);
    } catch (err) {
      setError("Failed to fetch products.");
    } finally {
      setLoading(false);
    }
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      // This call now triggers the Status Change Email on the server
      await axios.put(`/api/medicines/${editingProduct._id}`, editingProduct);
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      alert("Update failed");
    } finally {
      setUpdating(false);
    }
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`/api/medicines/${deletingId}`);
      setProducts(products.filter((p) => p._id !== deletingId));
      setDeletingId(null);
    } catch (err) {
      alert("Failed to delete product");
    }
  };

  const filteredProducts = products.filter((p) => {
    const categoryMatch = filters.category === "All" || p.category === filters.category;
    const statusMatch =
      filters.status === "All" ||
      (filters.status === "Available" && p.quantityInStock > 150) ||
      (filters.status === "Low Stock" && p.quantityInStock > 0 && p.quantityInStock <= 150) ||
      (filters.status === "Empty" && p.quantityInStock === 0);
    return categoryMatch && statusMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6 relative">
      
      {/* --- EDIT MODAL --- */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="bg-indigo-600 p-6 flex justify-between items-center text-white">
              <h2 className="text-xl font-bold">Edit Product</h2>
              <button onClick={() => setEditingProduct(null)}><FiX size={24} /></button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-8 space-y-5">
              <div>
                <label className="text-sm font-bold text-gray-600">Medicine Name</label>
                <input 
                  className="w-full mt-1 p-3 bg-gray-50 border rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-gray-600">Price (₹)</label>
                  <input 
                    type="number"
                    className="w-full mt-1 p-3 bg-gray-50 border rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500"
                    value={editingProduct.sellPrice}
                    onChange={(e) => setEditingProduct({...editingProduct, sellPrice: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-600">Stock Qty</label>
                  <input 
                    type="number"
                    className="w-full mt-1 p-3 bg-gray-50 border rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500"
                    value={editingProduct.quantityInStock}
                    onChange={(e) => setEditingProduct({...editingProduct, quantityInStock: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setEditingProduct(null)} className="flex-1 py-3 bg-gray-100 rounded-2xl font-bold">Cancel</button>
                <button type="submit" disabled={updating} className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2">
                  {updating ? <FiLoader className="animate-spin" /> : <FiSave />} Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- DELETE CONFIRMATION --- */}
      {deletingId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-3xl max-w-sm w-full text-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiAlertTriangle size={30} />
            </div>
            <h3 className="text-xl font-bold">Delete Product?</h3>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setDeletingId(null)} className="flex-1 py-3 bg-gray-100 rounded-2xl font-bold text-gray-600">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 py-3 bg-red-600 text-white rounded-2xl font-bold">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-indigo-900">Inventory</h1>
        <div className="relative">
          <button onClick={() => setShowAlerts(!showAlerts)} className="p-3 bg-white rounded-2xl shadow-sm hover:shadow-md transition">
            <FiBell className="text-2xl text-indigo-600" />
            {alerts.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] h-5 w-5 flex items-center justify-center rounded-full animate-pulse font-bold">
                {alerts.length}
              </span>
            )}
          </button>
          {showAlerts && alerts.length > 0 && (
            <div className="absolute right-0 mt-4 w-72 bg-white rounded-3xl shadow-2xl z-50 overflow-hidden border">
              <h3 className="font-bold p-4 bg-indigo-50 text-indigo-800">Stock Alerts</h3>
              <ul className="max-h-60 overflow-y-auto">
                {alerts.map((alert) => (
                  <li key={alert.productId} className="p-4 border-b hover:bg-gray-50">
                    <p className="font-bold text-sm">{alert.name}</p>
                    <span className={`text-[10px] font-bold ${alert.status === 'Empty' ? 'text-red-500' : 'text-orange-500'}`}>{alert.status} ({alert.quantity})</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-3xl shadow-sm border flex gap-4 mb-8">
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="p-2 bg-gray-50 rounded-xl text-sm font-bold border-none outline-none"
          >
            <option value="All">All Categories</option>
            {[...new Set(products.map((p) => p.category))].map((cat, i) => <option key={i} value={cat}>{cat}</option>)}
          </select>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="p-2 bg-gray-50 rounded-xl text-sm font-bold border-none outline-none"
          >
            <option value="All">All Status</option>
            <option value="Available">Available</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Empty">Empty</option>
          </select>
      </div>

      {/* Table */}
      <div className="bg-white shadow-xl rounded-[32px] overflow-hidden border">
        <table className="w-full">
          <thead className="bg-indigo-50/50">
            <tr>
              <th className="p-5 text-left text-xs font-black text-indigo-900 uppercase">Product</th>
              <th className="p-5 text-left text-xs font-black text-indigo-900 uppercase">Category</th>
              <th className="p-5 text-center text-xs font-black text-indigo-900 uppercase">Stock</th>
              <th className="p-5 text-center text-xs font-black text-indigo-900 uppercase">Status</th>
              <th className="p-5 text-center text-xs font-black text-indigo-900 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredProducts.map((product) => (
              <tr key={product._id} className="hover:bg-indigo-50/20 transition-all">
                <td className="p-5">
                  <p className="font-bold text-gray-800">{product.name}</p>
                  <p className="text-[9px] text-gray-400 font-mono uppercase">{product._id}</p>
                </td>
                <td className="p-5">
                  <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">{product.category}</span>
                </td>
                <td className="p-5 text-center font-black text-gray-700">{product.quantityInStock}</td>
                <td className="p-5 text-center"><StatusBadge qty={product.quantityInStock} /></td>
                <td className="p-5">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => setEditingProduct(product)} className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all"><FiEdit size={16} /></button>
                    <button onClick={() => setDeletingId(product._id)} className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all"><FiTrash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ qty }) {
  if (qty === 0) return <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-[10px] font-black uppercase">Empty</span>;
  if (qty <= 150) return <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-[10px] font-black uppercase">Low Stock</span>;
  return <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-[10px] font-black uppercase">Available</span>;
}