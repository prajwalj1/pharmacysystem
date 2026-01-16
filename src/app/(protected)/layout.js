import PharmacistSidebar from "@/component/PharmacistSidebar";

export default function ProtectedLayout({ children }) {
  return (
   <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <PharmacistSidebar />

      <main className="md:pl-64">
        <div className="p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
