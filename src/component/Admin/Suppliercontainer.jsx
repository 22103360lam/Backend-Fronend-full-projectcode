import React, { useState } from 'react';
import Addsupplier from '../Adminpages/Addsupplier';

export default function Suppliercontainer() {
  const [dropdownOpen1, setDropdownOpen1] = useState(false);
  const [dropdownOpen2, setDropdownOpen2] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editSupplier, setEditSupplier] = useState(null);

  const [suppliers, setSuppliers] = useState([
    { id: 1, name: "Global Fabrics", contact: "samiulreza@gmail.com", material: "Cotton Fabric", quantity: 500, status: "Active" },
    { id: 2, name: "Silk World", contact: "aksh@gmail.com", material: "Silk Threads", quantity: 300, status: "Active" },
    { id: 3, name: "Thread Co.", contact: "012345678", material: "Polyester Threads", quantity: 750, status: "Active" },
    { id: 4, name: "Button Ltd.", contact: "01303323107", material: "Buttons", quantity: 1000, status: "Active" },
    { id: 5, name: "Zip Masters", contact: "samiul@gmail.com", material: "Zippers", quantity: 450, status: "Inactive" },
    { id: 6, name: "Fabric Plus", contact: "lam@gmail.com", material: "Linen", quantity: 250, status: "Active" },
    { id: 7, name: "Quality Textiles", contact: "robi@gmail.com", material: "Wool", quantity: 180, status: "Active" },
    { id: 8, name: "Cotton Mills", contact: "reza@gmail.com", material: "Cotton", quantity: 600, status: "Active" },
    { id: 9, name: "Denim Works", contact: "Mark Taylor", material: "Denim", quantity: 350, status: "Active" },
    { id: 10, name: "Lace Crafts", contact: "Sophie White", material: "Lace", quantity: 120, status: "Active" }
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(suppliers.length / itemsPerPage);
  const indexOfLastSupplier = currentPage * itemsPerPage;
  const indexOfFirstSupplier = indexOfLastSupplier - itemsPerPage;
  const currentSuppliers = suppliers.slice(indexOfFirstSupplier, indexOfLastSupplier);

  const goToPage = (pageNumber) => setCurrentPage(pageNumber);
  const handleAdd = () => { setEditSupplier(null); setShowModal(true); };
  const handleEdit = (supplier) => { setEditSupplier(supplier); setShowModal(true); };
  const handleSave = (data) => {
    if (editSupplier) setSuppliers(prev => prev.map(sup => sup.id === editSupplier.id ? { ...sup, ...data } : sup));
    else setSuppliers(prev => [...prev, { id: Date.now(), ...data, status: "Active" }]);
    setShowModal(false);
    setEditSupplier(null);
  };
  const handleDelete = (id) => { if (window.confirm("Are you sure you want to delete this supplier?")) setSuppliers(prev => prev.filter(sup => sup.id !== id)); };
  const activeSuppliers = suppliers.filter(s => s.status === "Active").length;

  return (
    <div>
      <section className="p-4 md:p-6 bg-[#eff1f9] min-h-screen">
        <div className="flex justify-between mb-4">
          <h1 className="text-3xl font-semibold text-gray-900">Supplier Management</h1>
          <button onClick={handleAdd} className="bg-[#6C5CE7] hover:bg-[#5949D5] text-white font-semibold py-2 px-4 rounded-md flex items-center space-x-2 text-base">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Supplier</span>
          </button>
        </div>

        {showModal && <Addsupplier closeModal={() => setShowModal(false)} onSave={handleSave} initialData={editSupplier} />}

        <p className="text-gray-600 text-base mb-6">Manage suppliers, track deliveries, view history, reports, and alerts.</p>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div className="relative overflow-hidden rounded-lg p-6 flex flex-col justify-between bg-white shadow-md border-l-8" style={{ borderColor: "#7db5fe" }}>
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="text-lg font-medium uppercase mb-1" style={{ color: "#7db5fe" }}>Total Suppliers</p>
                <p className="text-4xl font-bold text-gray-900">{suppliers.length}</p>
              </div>
              <img src="/asset/building-svgrepo-com.svg" className="h-12 w-12 opacity-80" alt="Suppliers"/>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg p-6 flex flex-col justify-between bg-white shadow-md border-l-8" style={{ borderColor: "#4af486" }}>
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="text-lg font-medium uppercase mb-1" style={{ color: "#4af486" }}>Active Suppliers</p>
                <p className="text-4xl font-bold text-gray-900">{activeSuppliers}</p>
              </div>
              <img src="/asset/check-circle-svgrepo-com.svg" className="h-12 w-12 opacity-80" alt="Active"/>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg p-6 flex flex-col justify-between bg-white shadow-md border-l-8" style={{ borderColor: "#fe4747" }}>
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="text-lg font-medium uppercase mb-1" style={{ color: "#fe4747" }}>Pending Alerts</p>
                <p className="text-4xl font-bold text-gray-900">3</p>
              </div>
              <img src="/asset/alert-triangle-svgrepo-com.svg" className="h-12 w-12 opacity-80" alt="Alerts"/>
            </div>
          </div>
        </div>

        {/* Suppliers Table */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-base">
            <thead className="text-white" style={{ background: 'linear-gradient(135deg, #8E7DFF, #6C5CE7)' }}>
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Supplier</th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Contact Person</th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Material</th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-sm font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentSuppliers.map((supplier, index) => (
                <tr key={supplier.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-7 h-7 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mr-3 font-semibold text-sm">
                        {indexOfFirstSupplier + index + 1}
                      </div>
                      <div>
                        <p className="text-base font-medium text-gray-900">{supplier.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-base text-gray-500">{supplier.contact}</td>
                  <td className="px-6 py-3 whitespace-nowrap text-base text-gray-500">{supplier.material}</td>
                  <td className="px-6 py-3 whitespace-nowrap text-base text-gray-500">{supplier.quantity}</td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${supplier.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                      {supplier.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right text-base font-medium">
                    <div className="inline-flex items-center gap-2">
                      <button onClick={() => handleEdit(supplier)} className="p-1 rounded-full hover:bg-blue-50">
                        <img src="asset/edit.png" alt="Edit" className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(supplier.id)} className="p-1 rounded-full hover:bg-red-50">
                        <img src="asset/delete.png" alt="Delete" className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex justify-end space-x-2">
          <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-2 border border-gray-300 rounded-md text-base hover:bg-gray-50 disabled:opacity-50">Previous</button>
          {[...Array(totalPages)].map((_, idx) => (
            <button key={idx + 1} onClick={() => goToPage(idx + 1)} className={`px-3 py-2 rounded-md text-base ${currentPage === idx + 1 ? 'bg-[#6C5CE7] text-white' : 'border border-gray-300 hover:bg-gray-50'}`}>{idx + 1}</button>
          ))}
          <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-2 border border-gray-300 rounded-md text-base hover:bg-gray-50 disabled:opacity-50">Next</button>
        </div>

      </section>
    </div>
  );
}
