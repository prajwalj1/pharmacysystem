"use client";

import React from "react";
import {
  FiDollarSign,
  FiPlusCircle,
  FiShoppingCart,
  FiPackage,
  FiFileText,
} from "react-icons/fi";
import Headers from "@/component/Headers";
import PharmacistFooter from "@/component/footer";

export default function PharmacyHome() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      {/* --- Navigation --- */}
   <div className="relative z-50">


      <Headers />

      </div>

      {/* --- Main Content --- */}
      <main className="flex-grow">
        {/* --- Hero Section --- */}
        <header className="container mx-auto px-6 md:px-8 py-20 md:py-20 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-8">
            <span className="text-emerald-600 font-bold tracking-wider uppercase text-sm">
              Pharmacist Workspace
            </span>

            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
              Smart Pharmacy <br />
              <span className="text-emerald-600">
                Management System
              </span>
            </h1>

            <p className="text-gray-600 text-base md:text-lg max-w-lg">
              Manage medicine sales, inventory, prescriptions, and customers
              efficiently with a secure and modern pharmacy system.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/sales"
                className="bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-emerald-700 transition flex items-center gap-2 justify-center"
              >
                <FiShoppingCart /> New Sale
              </a>

              <a
                href="/medicines"
                className="border-2 border-emerald-600 text-emerald-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-emerald-50 transition flex items-center gap-2 justify-center"
              >
                <FiPackage /> Manage Stock
              </a>
            </div>
          </div>

          {/* Image */}
          <div className="flex-1 relative">
            <div className="w-full h-[360px] md:h-[420px] bg-emerald-50 rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&q=80&w=1000"
                alt="Pharmacy"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            {/* Floating Card */}
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4">
              <div className="bg-emerald-100 p-3 rounded-full text-emerald-600">
                <FiPlusCircle size={24} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase">
                  Daily Sales
                </p>
                <p className="text-lg font-bold">Live Tracking</p>
              </div>
            </div>
          </div>
        </header>

        {/* --- Features Section --- */}
        <section className="bg-white py-16 md:py-20">
          <div className="container mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <Feature
              icon={<FiDollarSign size={40} />}
              title="Sales Management"
              desc="Create bills, manage payments, and track daily pharmacy revenue."
              color="emerald"
            />

            <Feature
              icon={<FiPackage size={40} />}
              title="Inventory Control"
              desc="Monitor medicine stock, expiry dates, and low stock alerts."
              color="blue"
            />

            <Feature
              icon={<FiFileText size={40} />}
              title="Prescription Handling"
              desc="Safely manage prescriptions and patient medication records."
              color="purple"
            />
          </div>
        </section>
      </main>

      {/* --- Footer (CORRECT PLACE) --- */}
      <PharmacistFooter />
    </div>
  );
}

/* Feature Card */
function Feature({ icon, title, desc, color }) {
  const colors = {
    emerald: "bg-emerald-50 border-emerald-100 text-emerald-600",
    blue: "bg-blue-50 border-blue-100 text-blue-600",
    purple: "bg-purple-50 border-purple-100 text-purple-600",
  };

  return (
    <div className={`p-8 rounded-3xl border ${colors[color]}`}>
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2 text-gray-900">
        {title}
      </h3>
      <p className="text-gray-600">{desc}</p>
    </div>
  );
}
