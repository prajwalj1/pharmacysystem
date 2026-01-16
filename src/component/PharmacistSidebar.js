"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import {
  FiHome,
  FiShoppingCart,
  FiPackage,
  FiUsers,
  FiFileText,
  FiSettings,
  FiMenu,
  FiLogOut,
} from "react-icons/fi";

const menu = [
  { name: "Dashboard", href: "/dashboard", icon: FiHome },
  { name: "New Sale", href: "/sales", icon: FiShoppingCart },
  { name: "Medicines", href: "/medicines", icon: FiPackage },
  { name: "Customers", href: "/customers", icon: FiUsers },
  { name: "Prescriptions", href: "/prescriptions", icon: FiFileText },

];

export default function PharmacistSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  // Lock body scroll when drawer or modal is open
  useEffect(() => {
    document.body.style.overflow = open || confirmLogout ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, confirmLogout]);

  const SidebarContent = (
    <div className="h-full flex flex-col">
      {/* Header / Logo */}
      <div className="h-20 flex items-center justify-center text-2xl font-bold text-indigo-600 border-b bg-gradient-to-r from-indigo-50 to-blue-50">
        🏥 Pharmacist Panel
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-auto">
        {menu.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 p-3 rounded-lg transition ${
                active
                  ? "bg-indigo-100 text-indigo-700 font-semibold"
                  : "hover:bg-indigo-50 text-gray-700"
              }`}
            >
              <item.icon className="text-xl" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t">
        <button
          onClick={() => setConfirmLogout(true)}
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 text-red-600 font-medium w-full text-left"
        >
          <FiLogOut className="text-xl" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white shadow-sm">
        <div className="flex items-center justify-between h-14 px-4">
          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100"
            aria-label="Open menu"
          >
            <FiMenu size={24} className="text-indigo-600" />
          </button>

          <div className="text-lg font-bold text-indigo-700">Pharmacist</div>

          <div className="w-10" /> {/* spacer */}
        </div>
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

        {/* Drawer Panel */}
        <div
          className={`absolute inset-y-0 left-0 w-72 sm:w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="h-full overflow-auto">{SidebarContent}</div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {confirmLogout && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Confirm Logout
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to logout?
            </p>
            <div className="flex gap-4">
              <button
                className="flex-1 px-5 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                onClick={() => setConfirmLogout(false)}
              >
                Cancel
              </button>

              <button
                className="flex-1 px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                onClick={async () => {
                  setConfirmLogout(false);
                  try {
                    await signOut({
                      redirect: true,
                      callbackUrl: "/",
                    });
                  } catch (err) {
                    console.error("Logout failed:", err);
                  }
                }}
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}