import React, { useState, useEffect } from "react";
import Addsupplier from "../Adminpages/Addsupplier";
import axios from "axios";

export default function Suppliercontainer() {
  const [showModal, setShowModal] = useState(false);
  const [editSupplier, setEditSupplier] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [filterSupplier, setFilterSupplier] = useState('All');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 🔹 Fetch suppliers from backend
  const fetchSuppliers = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/suppliers");
      setSuppliers(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch suppliers");
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  // Filter by supplier name
  const filteredSuppliers = suppliers.filter(s => {
    if (filterSupplier === 'All') return true;
    return (s.supplier || '').toLowerCase() === filterSupplier.toLowerCase();
  });

  // Unique supplier names for dropdown
  const supplierOptions = ['All', ...Array.from(new Set(
    suppliers.map(s => s.supplier || '').filter(Boolean)
  ))];

  // 🔹 Pagination
  const indexOfLastSupplier = currentPage * itemsPerPage;
  const indexOfFirstSupplier = indexOfLastSupplier - itemsPerPage;
  const currentSuppliers = filteredSuppliers.slice(indexOfFirstSupplier, indexOfLastSupplier);
  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);

  const goToPage = (pageNumber) => setCurrentPage(pageNumber);

  // 🔹 Modal actions
  const handleAdd = () => {
    setEditSupplier(null);
    setShowModal(true);
  };

  const handleEdit = (supplier) => {
    setEditSupplier(supplier);
    setShowModal(true);
  };

  const handleSave = (savedSupplier) => {
    const exists = suppliers.find((s) => s.id === savedSupplier.id);
    if (exists) {
      setSuppliers((prev) =>
        prev.map((s) => (s.id === savedSupplier.id ? savedSupplier : s))
      );
    } else {
      setSuppliers((prev) => [savedSupplier, ...prev]);
    }
    setShowModal(false);
    setEditSupplier(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this supplier?")) return;

    try {
      await axios.delete(`http://localhost:8000/api/suppliers/${id}`);
      setSuppliers((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting supplier");
    }
  };

  // 🔹 Summary counts
  const totalSuppliers = suppliers.length;
  const activeSuppliers = suppliers.filter((s) => s.status === "Active").length;
  const pendingAlerts = suppliers.filter(
    (s) => s.status === "Pending" || s.status === "Inactive"
  ).length;

  return (
    <div>
      <section className="p-4 md:p-6 bg-[#eff1f9] min-h-screen">
        <div className="flex justify-between mb-4">
          <h1 className="text-2xl font-semibold text-gray-900">Supplier Management</h1>
          <button
            onClick={handleAdd}
            className="bg-[#6C5CE7] hover:bg-[#5949D5] text-white font-semibold py-2 px-4 rounded-md flex items-center space-x-2 text-base"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Supplier</span>
          </button>
        </div>

        {showModal && (
          <Addsupplier
            closeModal={() => setShowModal(false)}
            onSave={handleSave}
            initialData={editSupplier}
          />
        )}

        <p className="text-gray-600 text-base mb-6">
          Manage suppliers, track deliveries, view history, reports, and alerts.
        </p>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {/* Total */}
          <div
            className="relative overflow-hidden rounded-lg p-6 bg-white shadow-md border-l-8 text-gray-800"
            style={{ borderColor: "#7db5fe" }}
          >
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="  font-medium uppercase mb-1" style={{ color: "#7db5fe" }}>
                  Total Suppliers
                </p>
                <p className="text-xl font-bold text-gray-900">{totalSuppliers}</p>
              </div>
              <img
                src="/asset/Suppliercard.svg"
                className="h-12 w-12 opacity-80"
                alt="Suppliers"
              />
            </div>
          </div>

          {/* Active */}
          <div
            className="relative overflow-hidden rounded-lg p-6 bg-white shadow-md border-l-8 text-gray-800"
            style={{ borderColor: "#4af486" }}
          >
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className=" font-medium uppercase mb-1" style={{ color: "#4af486" }}>
                  Active Suppliers
                </p>
                <p className="text-xl font-bold text-gray-900">{activeSuppliers}</p>
              </div>
              <img
                src="/asset/active-ads-svgrepo-com.svg"
                className="h-12 w-12 opacity-80"
                alt="Active"
              />
            </div>
          </div>

          {/* Pending */}
          <div
            className="relative overflow-hidden rounded-lg p-6 bg-white shadow-md border-l-8 text-gray-800"
            style={{ borderColor: "#fe4747" }}
          >
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className=" font-medium uppercase mb-1" style={{ color: "#fe4747" }}>
                  Pending Alerts
                </p>
                <p className="text-xl font-bold text-gray-900">{pendingAlerts}</p>
              </div>
              <img
                src="/asset/alert-filled-svgrepo-com.svg"
                className="h-12 w-12 opacity-80"
                alt="Alerts"
              />
            </div>
          </div>
        </div>

        {/* Suppliers Table */}
        <div className="flex justify-end mb-3">
          <select
            value={filterSupplier}
            onChange={e => { setFilterSupplier(e.target.value); setCurrentPage(1); }}
            className="px-4 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none "
          >
            {supplierOptions.map((s, i) => (
              <option key={i} value={s}>{s === 'All' ? 'All Suppliers' : s}</option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-base">
            <thead className="text-white" style={{ background: "linear-gradient(135deg, #8E7DFF, #6C5CE7)" }}>
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                  Supplier
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                  Contact Person
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                  Material
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                  Unit
                </th> 
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-sm font-medium uppercase tracking-wider">
                  Actions
                </th>
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
                        <p className="text-base font-medium text-gray-900">{supplier.supplier}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-base text-gray-500">
                    {supplier.contact_person}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-base text-gray-500">
                    {supplier.material}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-base text-gray-500">
                    {supplier.quantity}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-base text-gray-500">
                    {supplier.unit}
                  </td> 
                  <td className="px-6 py-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                        supplier.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {supplier.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right text-base font-medium">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(supplier)}
                        className="p-1 rounded-full hover:bg-blue-50"
                      >
                        <img src="asset/edit.png" alt="Edit" className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(supplier.id)}
                        className="p-1 rounded-full hover:bg-red-50"
                      >
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
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 border border-gray-300 rounded-md text-base hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>

          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx + 1}
              onClick={() => goToPage(idx + 1)}
              className={`px-3 py-2 rounded-md text-base ${
                currentPage === idx + 1 ? "bg-[#6C5CE7] text-white" : "border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {idx + 1}
            </button>
          ))}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 border border-gray-300 rounded-md text-base hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </section>
    </div>
  );
}
