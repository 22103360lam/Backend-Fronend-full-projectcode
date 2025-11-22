import React, { useState } from 'react'
import Addinventory from '../Adminpages/Addinventory'

export default function Inventorycontainer() {
  const [inventory, setInventory] = useState([
    { id: 1, name: 'Blue Cotton Shirt', quantity: 120, minimumRequired: 50, status: 'In Stock' },
    { id: 2, name: 'Black Formal Pants', quantity: 85, minimumRequired: 40, status: 'In Stock' },
    { id: 3, name: 'Red Summer Dress', quantity: 12, minimumRequired: 30, status: 'Low Stock' },
    { id: 4, name: 'White T-Shirt', quantity: 67, minimumRequired: 35, status: 'In Stock' },
    { id: 5, name: 'Blue Denim Jeans', quantity: 34, minimumRequired: 25, status: 'Medium Stock' },
    { id: 6, name: 'Green Polo Shirt', quantity: 8, minimumRequired: 20, status: 'Low Stock' },
    { id: 7, name: 'Black Leather Jacket', quantity: 15, minimumRequired: 10, status: 'Medium Stock' },
    { id: 8, name: 'Gray Hoodie', quantity: 92, minimumRequired: 45, status: 'In Stock' },
  ])

  const [showModal, setShowModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const openModal = (item = null) => { setSelectedItem(item); setShowModal(true) }
  const closeModal = () => setShowModal(false)

  const handleSave = (item) => {
    if (item.id) {
      setInventory(prev => prev.map(i => i.id === item.id ? item : i))
    } else {
      const newItem = { ...item, id: Date.now() }
      setInventory(prev => [...prev, newItem])
    }
    closeModal()
  }

  const totalItems = inventory.length
  const inStock = inventory.filter(item => item.status === 'In Stock').length
  const lowStock = inventory.filter(item => item.status === 'Low Stock').length

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = inventory.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(inventory.length / itemsPerPage)

  const goToPage = (pageNumber) => setCurrentPage(pageNumber)

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setInventory(prev => prev.filter(item => item.id !== id))
    }
  }

  return (
    <div>
      <section className="p-4 md:p-6 bg-[#eff1f9] min-h-screen">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Inventory / Finished Goods</h1>
            <p className="text-gray-600 mt-1">View current inventory levels and product availability status.</p>
          </div>
          <button
            onClick={openModal}
            className="bg-[#6C5CE7] hover:bg-[#5949D5] text-white font-semibold py-2 px-4 rounded-md text-base flex items-center space-x-2"
          >
            <span>Add Material</span>
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div className="relative overflow-hidden rounded-lg p-6 flex flex-col justify-between bg-white shadow-md border-l-4 border-[#5A4BCF] lg:border-l-8 text-gray-800">
            <div className="flex justify-between items-start mb-2">
              <div className="flex flex-col items-start">
                <p className="text-lg font-medium text-[#5A4BCF] uppercase mb-1">Total Items</p>
                <p className="text-4xl font-bold">{totalItems}</p>
              </div>
              <img src="/asset/box-minimalistic-svgrepo-com.svg" alt="total items" className="h-10 w-10 ml-4 opacity-70" />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-lg p-6 flex flex-col justify-between bg-white shadow-md border-l-4 border-[#28A745] lg:border-l-8 text-gray-800">
            <div className="flex justify-between items-start mb-2">
              <div className="flex flex-col items-start">
                <p className="text-lg font-medium text-[#28A745] uppercase mb-1">In Stock</p>
                <p className="text-4xl font-bold">{inStock}</p>
              </div>
              <img src="/asset/check-mark-svgrepo-com.svg" alt="in stock" className="h-10 w-10 ml-4 opacity-70" />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-lg p-6 flex flex-col justify-between bg-white shadow-md border-l-4 border-[#EF4444] lg:border-l-8 text-gray-800">
            <div className="flex justify-between items-start mb-2">
              <div className="flex flex-col items-start">
                <p className="text-lg font-medium text-[#EF4444] uppercase mb-1">Low Stock Alerts</p>
                <p className="text-4xl font-bold">{lowStock}</p>
              </div>
              <img src="/asset/alert-filled-svgrepo-com.svg" alt="low stock" className="h-10 w-10 ml-4 opacity-70" />
            </div>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="text-white" style={{ background: 'linear-gradient(135deg, #8E7DFF, #6C5CE7)' }}>
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Item Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Minimum Required</th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-900">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500">{item.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500">{item.minimumRequired}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-sm leading-5 font-semibold rounded-full ${
                      item.status === 'Low Stock' ? 'bg-red-100 text-red-800' :
                      item.status === 'Medium Stock' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>{item.status}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-base font-medium">
                    <div className="flex space-x-2">
                      <button onClick={() => openModal(item)} className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50" title="Edit">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50" title="Delete">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-end space-x-2">
          <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-2 border border-gray-300 rounded-md text-base hover:bg-gray-50 disabled:opacity-50">
            Previous
          </button>
          {[...Array(totalPages)].map((_, idx) => (
            <button key={idx + 1} onClick={() => goToPage(idx + 1)} className={`px-3 py-2 rounded-md text-base ${currentPage === idx + 1 ? 'bg-[#6C5CE7] text-white' : 'border border-gray-300 hover:bg-gray-50'}`}>
              {idx + 1}
            </button>
          ))}
          <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-2 border border-gray-300 rounded-md text-base hover:bg-gray-50 disabled:opacity-50">
            Next
          </button>
        </div>

        {/* Modal */}
        {showModal && <Addinventory closeModal={closeModal} item={selectedItem} onSave={handleSave} />}
      </section>
    </div>
  )
}
