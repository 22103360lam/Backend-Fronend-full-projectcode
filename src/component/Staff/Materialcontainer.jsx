import React, { useState } from 'react'

export default function Material() {
  const materialRows = [
    {
      name: "Cotton Fabric",
      quantity: 15,
      min: 50,
      supplier: "Global Fabrics",
      status: "Low Stock",
      badgeClass: "bg-red-100 text-red-800"
    },
    {
      name: "Polyester Thread",
      quantity: 120,
      min: 30,
      supplier: "Thread Masters",
      status: "In Stock",
      badgeClass: "bg-green-100 text-green-800"
    },
    {
      name: "Buttons",
      quantity: 75,
      min: 100,
      supplier: "Button Corp",
      status: "Medium Stock",
      badgeClass: "bg-yellow-100 text-yellow-800"
    },
    {
      name: "Zippers",
      quantity: 8,
      min: 25,
      supplier: "Zip Solutions",
      status: "Low Stock",
      badgeClass: "bg-red-100 text-red-800"
    },
    {
      name: "Elastic Band",
      quantity: 45,
      min: 20,
      supplier: "Elastic Works",
      status: "In Stock",
      badgeClass: "bg-green-100 text-green-800"
    },
    {
      name: "Denim Fabric",
      quantity: 60,
      min: 40,
      supplier: "Denim House",
      status: "In Stock",
      badgeClass: "bg-green-100 text-green-800"
    },
    {
      name: "Velcro",
      quantity: 10,
      min: 20,
      supplier: "Velcro Ltd",
      status: "Low Stock",
      badgeClass: "bg-red-100 text-red-800"
    },
    {
      name: "Thread Spool",
      quantity: 200,
      min: 100,
      supplier: "Thread Masters",
      status: "In Stock",
      badgeClass: "bg-green-100 text-green-800"
    }
  ];

  // Pagination logic
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(materialRows.length / itemsPerPage);

  const paginatedRows = materialRows.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Functional summary cards
  const totalMaterials = materialRows.length;
  const lowStock = materialRows.filter(row => row.status === "Low Stock").length;
  const suppliers = new Set(materialRows.map(row => row.supplier)).size;

  return (
    <div>
      {/* Raw Material Management Content */}
      <section className="p-4 md:p-6 bg-[#eff1f9] min-h-screen">
        <div className="flex justify-between mb-4">
          <h1 className="text-lg font-bold text-gray-900">Raw Material Management</h1>
        </div>
        <p className="text-sm text-gray-600 mb-6">Track, View Material and Alerts</p>

        {/* Summary Cards (functional) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {/* Total Materials */}
          <div className="relative overflow-hidden rounded-lg p-6 flex flex-col justify-between bg-white shadow-md border-l-4 border-[#5A4BCF] lg:border-l-8 text-gray-800">
            <div className="flex justify-between items-start mb-2">
              <div className="flex flex-col items-start">
                <p className="text-sm font-medium text-[#5A4BCF] uppercase mb-1">Total Materials</p>
                <p className="text-3xl font-bold">{totalMaterials}</p>
              </div>
              <img src="/asset/box-minimalistic-svgrepo-com.svg" alt="total materials" className="h-10 w-10 ml-4 opacity-70" />
            </div>
          </div>

          {/* Low Stock */}
          <div className="relative overflow-hidden rounded-lg p-6 flex flex-col justify-between bg-white shadow-md border-l-4 border-[#EF4444] lg:border-l-8 text-gray-800">
            <div className="flex justify-between items-start mb-2">
              <div className="flex flex-col items-start">
                <p className="text-sm font-medium text-[#EF4444] uppercase mb-1">Low Stock</p>
                <p className="text-3xl font-bold">{lowStock}</p>
              </div>
              <img src="/asset/alert-filled-svgrepo-com.svg" alt="low stock" className="h-10 w-10 ml-4 opacity-70" />
            </div>
          </div>

          {/* Suppliers */}
          <div className="relative overflow-hidden rounded-lg p-6 flex flex-col justify-between bg-white shadow-md border-l-4 border-[#28A745] lg:border-l-8 text-gray-800">
            <div className="flex justify-between items-start mb-2">
              <div className="flex flex-col items-start">
                <p className="text-sm font-medium text-[#28A745] uppercase mb-1">Suppliers</p>
                <p className="text-3xl font-bold">{suppliers}</p>
              </div>
              <img src="/asset/factory-svgrepo-com (1).svg" alt="suppliers" className="h-10 w-10 ml-4 opacity-70" />
            </div>
          </div>
        </div>

        {/* Materials Table */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="text-white" style={{ background: 'linear-gradient(135deg, #8E7DFF, #6C5CE7)' }}>
              <tr>
                <th className="px-6 py-3 text-sm font-medium uppercase tracking-wider">Material Name</th>
                <th className="px-6 py-3 text-sm font-medium uppercase tracking-wider">Stock Quantity (kg/pieces)</th>
                <th className="px-6 py-3 text-sm font-medium uppercase tracking-wider">Minimum Required</th>
                <th className="px-6 py-3 text-sm font-medium uppercase tracking-wider">Supplier</th>
                <th className="px-6 py-3 text-sm font-medium uppercase tracking-wider">Status</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50 text-center align-middle">
                  <td className="px-6 py-4 text-base font-medium text-gray-900">{row.name}</td>
                  <td className="px-6 py-4 text-base text-gray-500">{row.quantity}</td>
                  <td className="px-6 py-4 text-base text-gray-500">{row.min}</td>
                  <td className="px-6 py-4 text-base text-gray-500">{row.supplier}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 inline-flex text-sm font-semibold rounded-full ${row.badgeClass}`}>{row.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-end">
          <div className="flex space-x-2">
            <button
              className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`px-3 py-2 rounded-md text-sm ${
                  currentPage === i + 1
                    ? "bg-[#6C5CE7] text-white"
                    : "border border-gray-300 hover:bg-gray-50"
                }`}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
