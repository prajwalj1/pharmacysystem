"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FiLogOut, FiUser, FiMenu, FiX, FiLogIn, FiSettings } from "react-icons/fi";
import { MdOutlineLocalPharmacy } from "react-icons/md";

export default function Headers() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    signOut({ redirect: true, callbackUrl: "/login" });
  };

  // Hide header for admin routes
  if (
    pathname?.startsWith("/admin") ||
    pathname === "/admin-login" ||
    session?.user?.role === "ADMIN"
  ) {
    return null;
  }

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      className="bg-white text-gray-800 fixed top-0 left-0 w-full z-50 shadow-sm border-b border-gray-100"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4 px-6 md:px-8">
        
        {/* Logo - Matches Pharmacy Theme */}
        <Link href="/" className="flex items-center gap-2 text-emerald-600 font-bold text-2xl">
          <MdOutlineLocalPharmacy size={32} />
          <span className="tracking-tight">PHMS</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 font-medium text-gray-600">
          <Link href="/dashboard/medicines" className="hover:text-emerald-600 transition">Medicines</Link>
          <Link href="/dashboard/users" className="hover:text-emerald-600 transition">Users</Link>
          <Link href="/dashboard/suppliers" className="hover:text-emerald-600 transition">Suppliers</Link>
          <Link href="/dashboard/sales" className="hover:text-emerald-600 transition">Sales</Link>

          {/* User Profile / Login */}
          {session?.user ? (
            <div className="relative border-l pl-8 flex items-center gap-4">
              <motion.div
                className="flex items-center gap-2 cursor-pointer bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full border border-emerald-100 transition"
                whileHover={{ scale: 1.02 }}
                onClick={() => setShowLogoutModal(true)}
              >
                <FiUser size={18} />
                <span className="text-sm font-bold">{session.user.name}</span>
                <FiLogOut size={16} className="ml-1 opacity-70" />
              </motion.div>

              {/* Logout Confirmation Modal */}
              <AnimatePresence>
                {showLogoutModal && (
                  <>
                    {/* Backdrop */}
                    <div className="fixed inset-0 bg-black/20" onClick={() => setShowLogoutModal(false)} />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute right-0 mt-36 w-64 bg-white text-gray-900 rounded-2xl shadow-2xl p-5 z-50 border border-gray-100"
                    >
                      <p className="text-base font-semibold mb-4">Confirm Logout?</p>
                      <div className="flex justify-end gap-2">
                        <button
                          className="px-4 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                          onClick={() => setShowLogoutModal(false)}
                        >
                          Cancel
                        </button>
                        <button
                          className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 shadow-md transition"
                          onClick={handleLogout}
                        >
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link 
              href="/login" 
              className="bg-emerald-600 text-white px-6 py-2 rounded-full font-bold hover:bg-emerald-700 shadow-md transition flex items-center gap-2"
            >
              <FiLogIn size={18} /> Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-600 focus:outline-none p-2"
          >
            {mobileMenuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="flex flex-col px-6 py-4 gap-4 font-medium text-gray-700">
              <Link href="/dashboard/medicines" onClick={() => setMobileMenuOpen(false)}>Medicines</Link>
              <Link href="/dashboard/users" onClick={() => setMobileMenuOpen(false)}>Users</Link>
              <Link href="/dashboard/suppliers" onClick={() => setMobileMenuOpen(false)}>Suppliers</Link>
              <Link href="/dashboard/sales" onClick={() => setMobileMenuOpen(false)}>Sales</Link>
              <hr />
              {session?.user ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-red-50 text-red-600 rounded-xl font-bold"
                >
                  Logout
                </button>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-emerald-600 text-white rounded-xl font-bold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}