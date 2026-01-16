"use client";

import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiShield,
  FiHeart,
} from "react-icons/fi";
import { MdOutlineLocalPharmacy } from "react-icons/md";

export default function PharmacistFooter() {
  return (
    <footer className="bg-white border-t mt-10">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-emerald-600">
            <MdOutlineLocalPharmacy size={28} />
            <span className="text-xl font-bold">Pharmacy Panel</span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            A secure and modern pharmacy management system designed to help
            pharmacists manage medicines, sales, and inventory efficiently.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="hover:text-emerald-600 cursor-pointer">
              Medicines
            </li>
            <li className="hover:text-emerald-600 cursor-pointer">
              New Sale
            </li>
            <li className="hover:text-emerald-600 cursor-pointer">
              Prescriptions
            </li>
  
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-3">Support</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <FiPhone className="text-emerald-600" />
              +977 9815010413
            </li>
            <li className="flex items-center gap-2">
              <FiMail className="text-emerald-600" />
              prajwal.gautam2727@gmail.com
            </li>
            <li className="flex items-center gap-2">
              <FiMapPin className="text-emerald-600" />
              Nepal
            </li>
          </ul>
        </div>

        {/* Trust */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-3">Trusted System</h4>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <FiShield className="text-emerald-600" />
            Secure & HIPAA Friendly
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600 mt-2">
            <FiHeart className="text-emerald-600" />
            Built for Pharmacists
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-gray-500">
          <p>
            © {new Date().getFullYear()} Pharmacy Management System. All rights
            reserved.
          </p>
          <p className="flex items-center gap-1">
            Made with <FiHeart className="text-red-500" /> for Healthcare
          </p>
        </div>
      </div>
    </footer>
  );
}
