"use client";

import { useState, useEffect } from "react";
import { FiSearch, FiUser, FiPhone, FiX } from "react-icons/fi";
import axios from "axios";

export default function CustomerPage() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch customers from API
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/customers");
      setCustomers(res.data);
    } catch (err) {
      console.error("Failed to fetch customers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Filtered customers based on search (client-side filtering after initial fetch)
  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-gray-100 py-11 sm:p-6 md:p-10 lg:p-12">
      <h1 className="text-3xl sm:text-4xl font-bold text-indigo-700 mb-6 sm:mb-8">Customers Dashboard</h1>

      {/* Search Box */}
      <div className="flex items-center mb-4 sm:mb-6 bg-white rounded-xl shadow-md p-2 sm:p-3">
        <FiSearch className="text-indigo-500 text-xl sm:text-2xl mr-2 sm:mr-3" />
        <input
          type="text"
          placeholder="Search by name or phone..."
          className="w-full bg-transparent focus:outline-none text-gray-700 placeholder-gray-400 text-sm sm:text-base"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Customer Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-x-auto border border-indigo-100">
        <table className="w-full text-sm sm:text-base divide-y divide-indigo-100">
          <thead className="bg-indigo-100 text-indigo-700">
            <tr>
              <th className="p-3 sm:p-4 text-left">SN</th>
              <th className="p-3 sm:p-4 text-left">Name</th>
              <th className="p-3 sm:p-4 text-left">Phone</th>
              <th className="p-3 sm:p-4 text-left">Last Purchase</th>
              <th className="p-3 sm:p-4 text-left">Total Spent</th>
              <th className="p-3 sm:p-4 text-center">Actions</th>
            </tr>
          </thead>
         <tbody className="divide-y divide-gray-200">
  {loading ? (
    <tr>
      <td colSpan="6" className="p-6 sm:p-8 text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-t-2 border-b-2 border-indigo-500 mb-2 sm:mb-4"></div>
          <p className="text-indigo-600 font-semibold text-base sm:text-lg">Fetching customer data...</p>
        </div>
      </td>
    </tr>
  ) : filteredCustomers.length === 0 ? (
    <tr>
      <td colSpan="6" className="p-6 sm:p-8 text-center text-gray-500 font-medium text-base sm:text-lg">
        No customers found. Try adjusting your search.
      </td>
    </tr>
  ) : (
    filteredCustomers.map((customer, idx) => (
      <tr key={idx} className="hover:bg-indigo-50 transition duration-200">
        {/* SN descending */}
        <td className="p-3 sm:p-4">{filteredCustomers.length - idx}</td>
        <td className="p-3 sm:p-4">{customer.name}</td>
        <td className="p-3 sm:p-4">{customer.phone}</td>
        <td className="p-3 sm:p-4">
          {customer.lastPurchase ? new Date(customer.lastPurchase).toLocaleDateString() : "-"}
        </td>
        <td className="p-3 sm:p-4">₹{customer.totalSpent || 0}</td>
        <td className="p-3 sm:p-4 text-center">
          <button
            className="px-3 py-1 sm:px-4 sm:py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition duration-200 text-sm sm:text-base"
            onClick={() => setSelectedCustomer(customer)}
          >
            View
          </button>
        </td>
      </tr>
    ))
  )}
</tbody>

        </table>
      </div>

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4 sm:px-0">
          <div className="bg-white w-full max-w-md sm:max-w-lg rounded-2xl p-6 sm:p-8 relative shadow-2xl">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition duration-200"
              onClick={() => setSelectedCustomer(null)}
            >
              <FiX size={24} className="sm:size-28" />
            </button>
            <h2 className="text-2xl sm:text-3xl font-bold text-indigo-700 mb-4">{selectedCustomer.name}</h2>
            <p className="mb-2 text-gray-700 flex items-center">
              <FiPhone className="inline mr-2 text-indigo-500" />
              {selectedCustomer.phone}
            </p>
            <p className="mb-4 sm:mb-6 text-gray-700">Total Spent: <span className="font-semibold text-indigo-600">₹{selectedCustomer.totalSpent || 0}</span></p>

            <h3 className="font-semibold text-lg sm:text-xl text-indigo-700 mb-2 sm:mb-3">Purchase History:</h3>
            {selectedCustomer.purchases && selectedCustomer.purchases.length > 0 ? (
              <ul className="max-h-64 overflow-y-auto space-y-3 sm:space-y-4 pr-2">
                {selectedCustomer.purchases.map((purchase, idx) => (
                  <li key={idx} className="p-3 sm:p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                    <p className="text-sm sm:text-base"><span className="font-medium">Date:</span> {new Date(purchase.date).toLocaleString()}</p>
                    <p className="text-sm sm:text-base"><span className="font-medium">Total:</span> ₹{purchase.total}</p>
                    <p className="text-sm sm:text-base"><span className="font-medium">Items:</span> {purchase.items.map((i) => i.name).join(", ")}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm sm:text-base">No purchase history available.</p>
            )}

            <button
              className="mt-4 sm:mt-6 w-full py-2 sm:py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition duration-200 font-medium text-sm sm:text-base"
              onClick={() => {
                window.location.href = `/sales/new?phone=${selectedCustomer.phone}`;
              }}
            >
              Start New Sale
            </button>
          </div>
        </div>
      )}
    </div>
  );
}