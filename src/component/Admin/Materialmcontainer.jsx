import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import AddMaterial from '../Adminpages/AddMaterial';
import { useAuth } from '../../AuthContext';

export default function MaterialMainContainer() {

  // getting role for conditional rendering
  const { user } = useAuth();
  const role = user?.role;

  const [showModal, setShowModal] = useState(false);
  const [editMaterial, setEditMaterial] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [supplierList, setSupplierList] = useState([]);
  const [filters, setFilters] = useState({ supplier: '', status: '' });

  //pagination  item show in page
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchMaterials();
    fetchSuppliers();
  }, []);

  const fetchMaterials = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/raw-materials');
      setMaterials(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch materials');
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/suppliers');
      const list = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
      setSupplierList(list);
    } catch (err) {
      console.error('Failed to fetch suppliers', err);
      setSupplierList([]);
    }
  };

  const handleAdd = () => { setEditMaterial(null); setShowModal(true); };
  const handleEdit = (material) => { setEditMaterial(material); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditMaterial(null); };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this material?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/raw-materials/${id}`);
      setMaterials(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting material");
    }
  };

  const handleSaveMaterial = (material) => {
    if (editMaterial) {
      setMaterials(prev => prev.map(m => m.id === editMaterial.id ? material : m));
    } else {
      setMaterials(prev => [material, ...prev]); // new material show first
    }
    closeModal();
  };

  // Pagination
  const filteredMaterials = useMemo(() => {
    return materials.filter(m => {
      if (filters.supplier) {
        const supplierName = (m.supplier ?? m.supplier_name ?? m.company_name ?? '').toString();
        if (supplierName !== filters.supplier) return false;
      }
      if (filters.status) {
        if ((m.status ?? '').toLowerCase() !== filters.status.toLowerCase()) return false;
      }
      return true;
    });
  }, [materials, filters]);

  const totalPages = Math.max(1, Math.ceil(filteredMaterials.length / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMaterials = filteredMaterials.slice(indexOfFirstItem, indexOfLastItem);
  const goToPage = (page) => setCurrentPage(Math.min(Math.max(1, page), totalPages));

  if (loading) return <p className="p-4">Loading materials...</p>;

  // Summary
  const totalMaterials = materials.length;
  const lowStockCount = materials.filter(m => m.status === "Low Stock").length;
  const suppliersCount = [...new Set(materials.map(m => m.supplier))].length;

  return (
    <div>
      <section className="p-4 md:p-6 bg-[#eff1f9] min-h-screen">
        <div className="flex justify-between mb-4">
          <h1 className="text-2xl font-semibold text-gray-900">Raw Material Management</h1>
              {/*  Admin*/}
      {(role === "Admin") && (
          <button onClick={handleAdd} className="bg-[#6C5CE7] hover:bg-[#5949D5] text-white font-semibold py-2 px-4 rounded-md flex items-center space-x-2 text-base">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Material</span>
          </button>
      )}
        </div>

        <p className="text-gray-600 text-base mb-6">Track, View Material and Alerts</p>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div className="relative overflow-hidden rounded-lg p-6 flex flex-col justify-between bg-white shadow-md border-l-8" style={{ borderColor: "#5A4BCF" }}>
            <div className="flex justify-between items-center mb-4">
              <div className="flex flex-col items-start">
                <p className=" font-medium uppercase mb-1" style={{ color: "#5A4BCF" }}>Total Materials</p>
                <p className="text-xl font-bold">{totalMaterials}</p>
              </div>
              <img src="/asset/box-minimalistic-svgrepo-com.svg" alt="total materials" className="h-12 w-12 opacity-80" />
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg p-6 flex flex-col justify-between bg-white shadow-md border-l-8" style={{ borderColor: "#EF4444" }}>
            <div className="flex justify-between items-center mb-4">
              <div className="flex flex-col items-start">
                <p className=" font-medium uppercase mb-1" style={{ color: "#EF4444" }}>Low Stock</p>
                <p className="text-xl font-bold">{lowStockCount}</p>
              </div>
              <img src="/asset/alert-filled-svgrepo-com.svg" alt="low stock" className="h-12 w-12 opacity-80" />
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg p-6 flex flex-col justify-between bg-white shadow-md border-l-8" style={{ borderColor: "#28A745" }}>
            <div className="flex justify-between items-center mb-4">
              <div className="flex flex-col items-start">
                <p className=" font-medium uppercase mb-1" style={{ color: "#28A745" }}>Suppliers</p>
                <p className="text-xl font-bold">{suppliersCount}</p>
              </div>
              <img src="/asset/factory-svgrepo-com (1).svg" alt="suppliers" className="h-12 w-12 opacity-80" />
            </div>
          </div>
        </div>

        {/* Filters (top-right) */}
        <div className="mb-4">
          <div className="flex justify-end">
            <div className="flex items-center gap-3">
              <select
                value={filters.supplier}
                onChange={e => { setFilters(f => ({ ...f, supplier: e.target.value })); setCurrentPage(1); }}
                className="px-3 py-2 border rounded-md bg-white"
              >
                <option value="">All Suppliers</option>
                {supplierList.map(s => {
                  const name = s.supplier ?? s.supplier_name ?? s.name ?? s.company_name ?? `Supplier ${s.id}`;
                  return <option key={s.id ?? name} value={name}>{name}</option>;
                })}
              </select>

              <select
                value={filters.status}
                onChange={e => { setFilters(f => ({ ...f, status: e.target.value })); setCurrentPage(1); }}
                className="px-3 py-2 border rounded-md bg-white"
              >
                <option value="">All Status</option>
                <option value="In Stock">In Stock</option>
                <option value="Low Stock">Low Stock</option>
              </select>

              <button
                onClick={() => { setFilters({ supplier: '', status: '' }); setCurrentPage(1); }}
                className="px-3 py-2 border rounded-md bg-gray-100"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Materials Table */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-base">
            <thead className="text-white" style={{ background: 'linear-gradient(135deg, #8E7DFF, #6C5CE7)' }}>
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Material Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Stock Quantity</th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Min Required</th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Unit</th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Supplier</th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Status</th>
                {(role === "Admin") && (
                <th className="px-6 py-3 text-right text-sm font-medium uppercase tracking-wider">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentMaterials.map((material) => (
                <tr key={material.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 whitespace-nowrap">{material.material_name}</td>
                  <td className="px-6 py-3 whitespace-nowrap">{material.quantity}</td>
                  <td className="px-6 py-3 whitespace-nowrap">{material.min_required}</td>
                  <td className="px-6 py-3 whitespace-nowrap">{material.unit || '-'}</td>
                  <td className="px-6 py-3 whitespace-nowrap">{material.supplier || '-'}</td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${material.status === "In Stock" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                      {material.status || (material.quantity < material.min_required ? "Low Stock" : "In Stock")}
                    </span>
                  </td>
                  {(role === "Admin") && (
                  <td className="px-6 py-3 text-right text-base font-medium">
                    <div className="inline-flex items-center gap-2">
                      <button onClick={() => handleEdit(material)} className="p-1 rounded-full hover:bg-blue-50">
                        <img src="asset/edit.png" alt="Edit" className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(material.id)} className="p-1 rounded-full hover:bg-red-50">
                        <img src="asset/delete.png" alt="Delete" className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                  )}
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

      {/* Modal */}
      {showModal && <AddMaterial closeModal={closeModal} initialData={editMaterial} onSave={handleSaveMaterial} />}
    </div>
  );
}
