"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { FiTrash2, FiUser, FiShield } from "react-icons/fi";

export default function AdminAccountsPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/users", { withCredentials: true });
      setUsers(res.data || []);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete user
  const deleteUser = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this account?"
    );
    if (!confirm) return;

    try {
      setDeletingId(id);
      await axios.delete(`/api/users/${id}`, { withCredentials: true });
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete user");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading accounts...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">User Accounts</h1>
        <p className="text-gray-500">Manage registered system users</p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-4 text-left">User</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-center">Role</th>
              <th className="p-4 text-center">Joined</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="p-6 text-center text-gray-400"
                >
                  No registered users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                      <FiUser />
                    </div>
                    <span className="font-medium">{user.name}</span>
                  </td>

                  <td className="p-4">{user.email}</td>

                  <td className="p-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.role === "ADMIN"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td className="p-4 text-center text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>

                  <td className="p-4 text-center">
                    {user.role === "ADMIN" ? (
                      <span className="text-gray-400 text-xs flex items-center justify-center gap-1">
                        <FiShield /> Protected
                      </span>
                    ) : (
                      <button
                        onClick={() => deleteUser(user._id)}
                        disabled={deletingId === user._id}
                        className="text-red-500 hover:text-red-700 transition"
                      >
                        <FiTrash2 />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
