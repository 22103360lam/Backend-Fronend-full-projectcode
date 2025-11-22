import React, { useState } from 'react'
import Addmaterial from '../Adminpages/Addmaterial'

export default function Materialmaincontainer() {
  const [showModal, setShowModal] = useState(false)
  const [editMaterial, setEditMaterial] = useState(null)

  const [materials, setMaterials] = useState([
    { id: "001", name: "Cotton Fabric", stock: 15, minRequired: 50, supplier: "Global Fabrics", status: "Low Stock" },
    { id: "002", name: "Silk Fabric", stock: 100, minRequired: 50, supplier: "Silk World", status: "In Stock" },
    { id: "003", name: "Polyester Threads", stock: 75, minRequired: 30, supplier: "Thread Co.", status: "In Stock" },
    { id: "004", name: "Buttons", stock: 8, minRequired: 20, supplier: "Button Ltd.", status: "Low Stock" },
    { id: "005", name: "Zippers", stock: 45, minRequired: 25, supplier: "Zip Masters", status: "In Stock" }
  ])

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const handleAdd = () => { setEditMaterial(null); setShowModal(true) }
  const handleEdit = (material) => { setEditMaterial(material); setShowModal(true) }
  const closeModal = () => { setShowModal(false); setEditMaterial(null) }
  const handleDelete = (id) => { if (window.confirm("Are you sure you want to delete this material?")) setMaterials(prev => prev.filter(m => m.id !== id)) }

  const handleSaveMaterial = (data) => {
    if (editMaterial) setMaterials(prev => prev.map(m => m.id === editMaterial.id ? { ...m, ...data } : m))
    else setMaterials(prev => [...prev, { ...data, id: Date.now().toString(), status: data.stock < data.minRequired ? "Low Stock" : "In Stock" }])
    closeModal()
  }

  const totalMaterials = materials.length
  const lowStockCount = materials.filter(m => m.status === "Low Stock").length
  const suppliersCount = [...new Set(materials.map(m => m.supplier))].length

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentMaterials = materials.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(materials.length / itemsPerPage)
  const goToPage = (page) => setCurrentPage(page)

  return (
    <div>
      <section className="p-4 md:p-6 bg-[#eff1f9] min-h-screen">
        <div className="flex justify-between mb-4">
          <h1 className="text-3xl font-semibold text-gray-900">Raw Material Management</h1>
          <button onClick={handleAdd} className="bg-[#6C5CE7] hover:bg-[#5949D5] text-white font-semibold py-2 px-4 rounded-md flex items-center space-x-2 text-base">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Material</span>
          </button>
        </div>

        <p className="text-gray-600 text-base mb-6">Track, View Material and Alerts</p>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div className="relative overflow-hidden rounded-lg p-6 flex flex-col justify-between bg-white shadow-md border-l-8 text-gray-800" style={{ borderColor: "#5A4BCF" }}>
            <div className="flex justify-between items-center mb-4">
              <div className="flex flex-col items-start">
                <p className="text-lg font-medium uppercase mb-1" style={{ color: "#5A4BCF" }}>Total Materials</p>
                <p className="text-4xl font-bold">{totalMaterials}</p>
              </div>
              <img src="/asset/box-minimalistic-svgrepo-com.svg" alt="total materials" className="h-12 w-12 opacity-80" />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-lg p-6 flex flex-col justify-between bg-white shadow-md border-l-8 text-gray-800" style={{ borderColor: "#EF4444" }}>
            <div className="flex justify-between items-center mb-4">
              <div className="flex flex-col items-start">
                <p className="text-lg font-medium uppercase mb-1" style={{ color: "#EF4444" }}>Low Stock</p>
                <p className="text-4xl font-bold">{lowStockCount}</p>
              </div>
              <img src="/asset/alert-filled-svgrepo-com.svg" alt="low stock" className="h-12 w-12 opacity-80" />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-lg p-6 flex flex-col justify-between bg-white shadow-md border-l-8 text-gray-800" style={{ borderColor: "#28A745" }}>
            <div className="flex justify-between items-center mb-4">
              <div className="flex flex-col items-start">
                <p className="text-lg font-medium uppercase mb-1" style={{ color: "#28A745" }}>Suppliers</p>
                <p className="text-4xl font-bold">{suppliersCount}</p>
              </div>
              <img src="/asset/factory-svgrepo-com (1).svg" alt="suppliers" className="h-12 w-12 opacity-80" />
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
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Supplier</th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-sm font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentMaterials.map((material, index) => (
                <tr key={material.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-7 h-7 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mr-3 font-semibold text-sm">
                        {indexOfFirstItem + index + 1}
                      </div>
                      <div>
                        <p className="text-base font-medium text-gray-900">{material.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-base text-gray-500">{material.stock}</td>
                  <td className="px-6 py-3 whitespace-nowrap text-base text-gray-500">{material.minRequired}</td>
                  <td className="px-6 py-3 whitespace-nowrap text-base text-gray-500">{material.supplier}</td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${material.status === "In Stock" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                      {material.status}
                    </span>
                  </td>
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

      {showModal && <Addmaterial closeModal={closeModal} initialData={editMaterial} onSave={handleSaveMaterial} />}
    </div>
  )
}
