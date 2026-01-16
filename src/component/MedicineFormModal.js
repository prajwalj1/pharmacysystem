"use client";
import { useState } from "react";
export default function MedicineFormModal({ open, onClose, editData }) {
  const [form, setForm] = useState(editData || { name:"", genericName:"", brand:"", category:"", sellPrice:0, purchasePrice:0, reorderLevel:10 });

  if (!open) return null;
  async function submit(e){
    e.preventDefault();
    const url = editData ? `/api/medicines/${editData._id}` : `/api/medicines`;
    const method = editData ? "PUT" : "POST";
    await fetch(url, { method, headers: { "Content-Type":"application/json"}, body: JSON.stringify(form) });
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <form onSubmit={submit} className="w-full max-w-2xl bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{editData? "Edit" : "Add"} Medicine</h2>
          <button type="button" onClick={onClose} className="text-gray-500">Close</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input required placeholder="Name" value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} className="px-3 py-2 border rounded" />
          <input placeholder="Generic Name" value={form.genericName} onChange={(e)=>setForm({...form, genericName:e.target.value})} className="px-3 py-2 border rounded" />
          <input placeholder="Brand" value={form.brand} onChange={(e)=>setForm({...form, brand:e.target.value})} className="px-3 py-2 border rounded" />
          <input placeholder="Category" value={form.category} onChange={(e)=>setForm({...form, category:e.target.value})} className="px-3 py-2 border rounded" />
          <input type="number" placeholder="Purchase Price" value={form.purchasePrice} onChange={(e)=>setForm({...form, purchasePrice:Number(e.target.value)})} className="px-3 py-2 border rounded" />
          <input type="number" placeholder="Sell Price" value={form.sellPrice} onChange={(e)=>setForm({...form, sellPrice:Number(e.target.value)})} className="px-3 py-2 border rounded" />
          <input type="number" placeholder="Reorder Level" value={form.reorderLevel} onChange={(e)=>setForm({...form, reorderLevel:Number(e.target.value)})} className="px-3 py-2 border rounded" />
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
        </div>
      </form>
    </div>
  );
}
