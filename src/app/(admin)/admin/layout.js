// app/(admin)/layout.jsx
"use client";

import AdminSidebar from "@/app/(admin)/admin/sidebar/AdminSidebar"; // adjust pat

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar component includes mobile topbar + desktop fixed sidebar */}
      <AdminSidebar />

      {/* Main content area:
          - Use md:pl-64 so on medium+ screens the content sits to the right of fixed 64px sidebar.
          - On mobile there's no pl so content is full width (hamburger opens drawer).
      */}
      <main className="md:pl-64">
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
