"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { FiHome, FiBox, FiUsers, FiLayers, FiBarChart, FiTrendingUp, FiLogOut,FiMenu,FileList } from "react-icons/fi";
import { signOut } from "next-auth/react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  // Lock body scroll when drawer or modal open
  useEffect(() => {
    document.body.style.overflow = open || confirmLogout ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [open, confirmLogout]);

  const navItems = [
  { name: "Dashboard", icon: <FiHome />, href: "/admin" },
  { name: "Medicines", icon: <FiBox />, href: "/admin/medicines" },
  { name: "Suppliers", icon: <FiUsers />, href: "/admin/supplier" },
  { name: "Products", icon: <FiLayers />, href: "/admin/product" },
  { name: "Report", icon: <FiBarChart />, href: "/admin/reports" },
  { name: "Sales", icon: <FiTrendingUp />, href: "/admin/sales" },
  {name:"Account", icon:<FiLayers/>,href: "/admin/account"}
  ];

  const SidebarContent = (
    <div className="h-full flex flex-col">
      {/* Logo / Header */}
      <div className="h-20 flex items-center justify-center text-2xl font-bold text-indigo-600 border-b bg-gradient-to-r from-indigo-50 to-blue-50">
        🏥 PMS Admin
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-auto">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 p-3 rounded-lg transition ${
                active
                  ? "bg-indigo-100 text-indigo-700 font-semibold"
                  : "hover:bg-indigo-50 text-gray-700"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t">
        <button
          onClick={() => setConfirmLogout(true)}
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 text-red-600 font-medium w-full"
        >
          <FiLogOut />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Topbar */}
      <div className="md:hidden w-full bg-white/0 p-3 flex items-center justify-between shadow-sm">
        <button
          aria-label="Open menu"
          onClick={() => setOpen(true)}
          className="p-2 rounded-md bg-white shadow-sm"
        >
          <FiMenu size={20} className="text-indigo-600" />
        </button>
        <div className="text-lg font-bold text-indigo-600">🏥 PMS Admin</div>
        <div className="w-8" /> {/* spacer */}
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:w-64 md:flex md:flex-col bg-white shadow-lg">
        {SidebarContent}
      </aside>

      {/* Mobile Slide-over Drawer */}
      <div
        className={`fixed inset-0 z-50 md:hidden transform ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity ${
            open ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setOpen(false)}
        />

        {/* Panel */}
        <div
          className={`absolute inset-y-0 left-0 w-72 sm:w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="h-full overflow-auto">{SidebarContent}</div>
        </div>
      </div>

      {/* Confirm Logout Modal */}
      {confirmLogout && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg p-6 w-80 max-w-sm text-center">
            <h2 className="text-xl font-bold mb-4">Confirm Logout</h2>
            <p className="mb-6">Do you really want to logout?</p>
            <div className="flex justify-between gap-4">
              <button
                className="flex-1 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                onClick={() => setConfirmLogout(false)}
              >
                No
              </button>
              <button
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                onClick={async () => {
                  try {
                    await signOut({ redirect: true, callbackUrl: "/admin-login" });
                  } catch (err) {
                    console.error("Logout failed", err);
                  }
                }}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
