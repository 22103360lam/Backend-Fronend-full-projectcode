import React, { useState } from 'react'

export default function Mreportcontainer () {
  const [reportForm, setReportForm] = useState({
    reportType: 'Production Output',
    fromDate: '',
    toDate: ''
  })

  const [activeTab, setActiveTab] = useState('production')

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Sample data arrays
  const [productionData, setProductionData] = useState([
    { id: '#1234', product: 'Blue Shirts', quantity: 150, status: 'Completed' },
    { id: '#1235', product: 'Black Pants', quantity: 200, status: 'In Progress' },
    { id: '#1236', product: 'Red Dresses', quantity: 120, status: 'Completed' },
    { id: '#1237', product: 'Green Skirts', quantity: 80, status: 'Pending' },
    { id: '#1238', product: 'Yellow Jackets', quantity: 60, status: 'Completed' },
    { id: '#1239', product: 'White Shirts', quantity: 90, status: 'In Progress' },
  ])

  const [materialData, setMaterialData] = useState([
    { id: 1, material: 'Cotton Fabric', used: '85 kg', remaining: '15 kg', status: 'Low Stock' },
    { id: 2, material: 'Silk Threads', used: '40 units', remaining: '60 units', status: 'Good' },
    { id: 3, material: 'Buttons', used: '120 pcs', remaining: '280 pcs', status: 'Good' },
    { id: 4, material: 'Wool Yarn', used: '35 kg', remaining: '65 kg', status: 'Good' },
    { id: 5, material: 'Zippers', used: '80 pcs', remaining: '120 pcs', status: 'Good' },
    { id: 6, material: 'Leather', used: '25 sq ft', remaining: '5 sq ft', status: 'Low Stock' },
    { id: 7, material: 'Polyester', used: '90 kg', remaining: '10 kg', status: 'Low Stock' },
    { id: 8, material: 'Elastic Bands', used: '150 m', remaining: '50 m', status: 'Good' },
  ])

  const [inventoryData, setInventoryData] = useState([
    { id: 1, item: 'Blue Shirts', current: 120, min: 50, status: 'In Stock' },
    { id: 2, item: 'Black Pants', current: 85, min: 40, status: 'In Stock' },
    { id: 3, item: 'Red Dresses', current: 12, min: 30, status: 'Low Stock' },
    { id: 4, item: 'Green Skirts', current: 200, min: 100, status: 'In Stock' },
    { id: 5, item: 'Yellow Jackets', current: 25, min: 20, status: 'In Stock' },
    { id: 6, item: 'White Shirts', current: 8, min: 15, status: 'Low Stock' },
    { id: 7, item: 'Purple Hoodies', current: 150, min: 75, status: 'In Stock' },
    { id: 8, item: 'Orange Caps', current: 300, min: 150, status: 'In Stock' },
  ])

  const [supplierData, setSupplierData] = useState([
    { id: 1, supplier: 'Global Fabrics', material: 'Cotton', quantity: '98 kg', status: 'Active' },
    { id: 2, supplier: 'GX Ltd', material: 'Silk', quantity: '90 units', status: 'Active' },
    { id: 3, supplier: 'Button Co.', material: 'Buttons', quantity: '500 pcs', status: 'Pending' },
    { id: 4, supplier: 'Wool Masters', material: 'Wool', quantity: '120 kg', status: 'Active' },
    { id: 5, supplier: 'Zip Solutions', material: 'Zippers', quantity: '300 pcs', status: 'Active' },
    { id: 6, supplier: 'Leather Works', material: 'Leather', quantity: '50 sq ft', status: 'Pending' },
    { id: 7, supplier: 'Poly Industries', material: 'Polyester', quantity: '200 kg', status: 'Active' },
    { id: 8, supplier: 'Elastic Pro', material: 'Elastic', quantity: '500 m', status: 'Active' },
  ])

  // Pagination helpers
  const getCurrentData = () => {
    let data = []
    switch(activeTab) {
      case 'production': data = productionData; break
      case 'material': data = materialData; break
      case 'inventory': data = inventoryData; break
      case 'supplier': data = supplierData; break
      default: return []
    }
    const start = (currentPage - 1) * itemsPerPage
    const end = start + itemsPerPage
    return data.slice(start, end)
  }

  const getTotalPages = () => {
    let length = 0
    switch(activeTab) {
      case 'production': length = productionData.length; break
      case 'material': length = materialData.length; break
      case 'inventory': length = inventoryData.length; break
      case 'supplier': length = supplierData.length; break
      default: return 1
    }
    return Math.ceil(length / itemsPerPage)
  }

  const handlePageChange = (page) => {
    if (page >= 1 && page <= getTotalPages()) {
      setCurrentPage(page)
    }
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setCurrentPage(1)
  }

  const downloadReport = () => {
    let currentData = []
    let filename = ''
    switch(activeTab) {
      case 'production': currentData = productionData; filename = 'production_report.csv'; break
      case 'material': currentData = materialData; filename = 'material_report.csv'; break
      case 'inventory': currentData = inventoryData; filename = 'inventory_report.csv'; break
      case 'supplier': currentData = supplierData; filename = 'supplier_report.csv'; break
      default: return
    }
    if (currentData.length === 0) { alert('No data to download'); return }
    const headers = Object.keys(currentData[0]).filter(k => k !== 'id')
    const csvContent = [headers.join(','), ...currentData.map(r => headers.map(h => r[h]).join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const currentData = getCurrentData()
  const totalPages = getTotalPages()

  return (
    <div>
      <section className="p-4 md:p-6 bg-[#eff1f9] min-h-screen">
        <h1 className="text-xl font-semibold text-gray-900 mb-6">Reports & Dashboard</h1>
        <p className="text-base text-gray-600 mb-8">View production, material, supplier, and inventory reports.</p>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[#000000]">Existing Reports</h2>
          <button 
            onClick={downloadReport}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-semibold flex items-center gap-2 text-base"
          >
            Download Report
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-4 border-b border-gray-200 bg-[#ffffff]">
          {['production','material','inventory','supplier'].map(tab => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-4 py-2 font-medium text-base ${
                activeTab===tab ? 'bg-[#6C5CE7] border-b-2 rounded hover:bg-[#5949D5] text-white' : 'text-black'
              }`}
            >
              {tab==='production' ? 'Production Output' :
               tab==='material' ? 'Material Usage' :
               tab==='inventory' ? 'Inventory Status' :
               'Supplier Info'}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
          <table className="min-w-full text-base divide-y divide-gray-200 text-center rounded-lg">
            <thead>
              <tr className="text-white" style={{ background: 'linear-gradient(135deg, #8E7DFF, #6C5CE7)' }}>
                {activeTab==='production' && <>
                  <th className="px-3 py-2 text-sm font-medium">Batch ID</th>
                  <th className="px-3 py-2 text-sm font-medium">Product</th>
                  <th className="px-3 py-2 text-sm font-medium">Quantity</th>
                  <th className="px-3 py-2 text-sm font-medium">Status</th>
                </>}
                {activeTab==='material' && <>
                  <th className="px-3 py-2 text-sm font-medium">Material</th>
                  <th className="px-3 py-2 text-sm font-medium">Used</th>
                  <th className="px-3 py-2 text-sm font-medium">Remaining</th>
                  <th className="px-3 py-2 text-sm font-medium">Status</th>
                </>}
                {activeTab==='inventory' && <>
                  <th className="px-3 py-2 text-sm font-medium">Item</th>
                  <th className="px-3 py-2 text-sm font-medium">Current Stock</th>
                  <th className="px-3 py-2 text-sm font-medium">Min Level</th>
                  <th className="px-3 py-2 text-sm font-medium">Status</th>
                </>}
                {activeTab==='supplier' && <>
                  <th className="px-3 py-2 text-sm font-medium">Supplier</th>
                  <th className="px-3 py-2 text-sm font-medium">Material</th>
                  <th className="px-3 py-2 text-sm font-medium">Quantity</th>
                  <th className="px-3 py-2 text-sm font-medium">Status</th>
                </>}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {currentData.map(row => (
                <tr key={row.id}>
                  {activeTab==='production' && <>
                    <td className="px-3 py-2 text-base">{row.id}</td>
                    <td className="px-3 py-2 text-base">{row.product}</td>
                    <td className="px-3 py-2 text-base">{row.quantity}</td>
                    <td className="px-3 py-2">
                      <span className={`px-2 py-1 text-sm font-semibold rounded-full ${
                        row.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        row.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  </>}
                  {activeTab==='material' && <>
                    <td className="px-3 py-2 text-base">{row.material}</td>
                    <td className="px-3 py-2 text-base">{row.used}</td>
                    <td className="px-3 py-2 text-base">{row.remaining}</td>
                    <td className="px-3 py-2">
                      <span className={`px-2 py-1 text-sm font-semibold rounded-full ${
                        row.status === 'Good' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  </>}
                  {activeTab==='inventory' && <>
                    <td className="px-3 py-2 text-base">{row.item}</td>
                    <td className="px-3 py-2 text-base">{row.current}</td>
                    <td className="px-3 py-2 text-base">{row.min}</td>
                    <td className="px-3 py-2">
                      <span className={`px-2 py-1 text-sm font-semibold rounded-full ${
                        row.status === 'In Stock' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  </>}
                  {activeTab==='supplier' && <>
                    <td className="px-3 py-2 text-base">{row.supplier}</td>
                    <td className="px-3 py-2 text-base">{row.material}</td>
                    <td className="px-3 py-2 text-base">{row.quantity}</td>
                    <td className="px-3 py-2">
                      <span className={`px-2 py-1 text-sm font-semibold rounded-full ${
                        row.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  </>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination - outside table */}
        {totalPages > 1 && (
          <div className="flex justify-end items-center mt-4 space-x-2">
            <button
              onClick={() => handlePageChange(currentPage-1)}
              disabled={currentPage===1}
              className="px-4 py-2 rounded-md font-medium bg-gray-200 text-gray-800 text-base disabled:opacity-50"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i+1}
                onClick={() => handlePageChange(i+1)}
                className={`px-4 py-2 rounded-md font-medium text-base ${
                  currentPage === i+1 ? 'bg-[#6C5CE7] text-white' : 'bg-gray-200 text-gray-800'
                }`}
              >
                {i+1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage+1)}
              disabled={currentPage===totalPages}
              className="px-4 py-2 rounded-md font-medium bg-gray-200 text-gray-800 text-base disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </section>
    </div>
  )
}
