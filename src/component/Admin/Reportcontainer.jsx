import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function Reportcontainer() {
  const [reportForm, setReportForm] = useState({
    reportType: 'Production Output',
    fromDate: '',
    toDate: ''
  })

  const [activeTab, setActiveTab] = useState('production')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Dynamic data
  const [productionData, setProductionData] = useState([])
  const [materialData, setMaterialData] = useState([])
  const [inventoryData, setInventoryData] = useState([])
  const [supplierData, setSupplierData] = useState([])

  // Delete modal state
  const [deleteInfo, setDeleteInfo] = useState({ open: false, id: null, type: '' })

  // Fetch data with fields matching table headers exactly
  const fetchData = async (tab) => {
    try {
      switch(tab){
        case 'production': {
          const res = await axios.get('/productions')
          setProductionData(res.data.map(item => ({
            id: item.id ?? item.batch_id,
            product: item.task || item.product_name || 'N/A',
            quantity: item.quantity || 0,
            materialQuantity: item.material_quantity || 0,
            unit: item.unit || '-'
          })))
          break
        }
        case 'material': {
          const res = await axios.get('/materials')
          setMaterialData(res.data.map(item => ({
            id: item.id,
            material: item.material_name || item.name || 'N/A',
            used: item.quantity || 0,
            remaining: item.min_required || 0,
            unit: item.unit || '-',
            supplier: item.supplier_name
              || item.supplierName
              || item.supplier?.name
              || item.supplier
              || '-'
          })))
          break
        }
        case 'inventory': {
          const res = await axios.get('/inventory')
          setInventoryData(res.data.map(item => ({
            id: item.id,
            item: item.item_name || 'N/A',
            current: item.quantity || 0,
            min: item.minimum_required || 0,
            unit: item.unit || '-'
          })))
          break
        }
        case 'supplier': {
          const res = await axios.get('/suppliers')
          setSupplierData(res.data.map(item => ({
            id: item.id,
            supplier: item.supplier_name
              || item.supplierName
              || item.name
              || item.supplier
              || 'N/A',
            contact_person: item.contact_person || item.contactPerson || '-',
            material: item.material || item.material_name || '-',
            quantity: item.quantity || 0,
            unit: item.unit || '-'
          })))
          break
        }
        default: break
      }
    } catch(err){
      console.error('Error fetching data:', err)
    }
  }

  useEffect(()=>{ fetchData(activeTab) }, [activeTab])

  const getCurrentData = () => {
    let data = []
    switch(activeTab){
      case 'production': data = productionData; break
      case 'material': data = materialData; break
      case 'inventory': data = inventoryData; break
      case 'supplier': data = supplierData; break
      default: return []
    }
    const start = (currentPage-1)*itemsPerPage
    const end = start + itemsPerPage
    return data.slice(start, end)
  }

  const getTotalPages = () => {
    let length = 0
    switch(activeTab){
      case 'production': length = productionData.length; break
      case 'material': length = materialData.length; break
      case 'inventory': length = inventoryData.length; break
      case 'supplier': length = supplierData.length; break
      default: return 1
    }
    return Math.ceil(length / itemsPerPage)
  }

  const handlePageChange = (page) => {
    if(page>=1 && page<=getTotalPages()) setCurrentPage(page)
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setCurrentPage(1)
  }

  // Delete functions
  const deleteRow = (id, type) => {
    if(type==='production') setProductionData(prev=>prev.filter(i=>i.id!==id))
    if(type==='material') setMaterialData(prev=>prev.filter(i=>i.id!==id))
    if(type==='inventory') setInventoryData(prev=>prev.filter(i=>i.id!==id))
    if(type==='supplier') setSupplierData(prev=>prev.filter(i=>i.id!==id))
  }
  const handleDeleteClick = (id, type) => setDeleteInfo({ open:true, id, type })
  const confirmDelete = () => { deleteRow(deleteInfo.id, deleteInfo.type); setDeleteInfo({ open:false, id:null, type:'' }) }
  const cancelDelete = () => setDeleteInfo({ open:false, id:null, type:'' })

  // CSV download
  const downloadReport = () => {
    let currentData = []
    let filename = ''
    switch(activeTab){
      case 'production': currentData = productionData; filename='production_report.csv'; break
      case 'material': currentData = materialData; filename='material_report.csv'; break
      case 'inventory': currentData = inventoryData; filename='inventory_report.csv'; break
      case 'supplier': currentData = supplierData; filename='supplier_report.csv'; break
      default: return
    }
    if(currentData.length===0){ alert('No data to download'); return }
    const headers = Object.keys(currentData[0]).filter(k=>k!=='id')
    const csvContent = [ headers.join(','), ...currentData.map(r=> headers.map(h=>r[h]).join(',')) ].join('\n')
    const blob = new Blob([csvContent], {type:'text/csv'})
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleFormSubmit = (e)=>{ e.preventDefault(); console.log('Report generated:', reportForm) }
  const handleInputChange = (field,value)=> setReportForm(prev=>({...prev,[field]:value}))

  const currentData = getCurrentData()
  const totalPages = getTotalPages()
  const indexOfFirstItem = (currentPage-1)*itemsPerPage

  return (
    <div>
      <section className="p-4 md:p-6 bg-[#eff1f9] min-h-screen">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Reports & Dashboard</h1>
        <p className="text-gray-600 mb-8">View production, material, supplier, and inventory reports.</p>

        {/* Generate Custom Report */}
        <div className="bg-white rounded-lg shadow p-3 mb-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Generate Custom Report</h2>
          <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row gap-2 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
              <select 
                value={reportForm.reportType} 
                onChange={(e)=>handleInputChange('reportType',e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] text-sm">
                <option value="Production Output">Production Output</option>
                <option value="Material Usage">Material Usage</option>
                <option value="Supplier Info">Supplier Info</option>
                <option value="Inventory Status">Inventory Status</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
              <input type="date" value={reportForm.fromDate} onChange={(e)=>handleInputChange('fromDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] text-sm"/>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
              <input type="date" value={reportForm.toDate} onChange={(e)=>handleInputChange('toDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] text-sm"/>
            </div>
            <button type="submit" className="bg-[#6C5CE7] hover:bg-[#5949D5] text-white px-4 py-2 rounded-md font-semibold text-sm">Generate</button>
          </form>
        </div>

        {/* Existing Reports Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Existing Reports</h2>
          <button onClick={downloadReport} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-semibold flex items-center gap-2 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Download Report
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-4 border-b border-gray-200 bg-white rounded-t-lg">
          {['production','material','inventory','supplier'].map(tab=>(
            <button key={tab} onClick={()=>handleTabChange(tab)}
              className={`px-4 py-2 font-medium ${activeTab===tab?'bg-[#6C5CE7] border-b-2 rounded hover:bg-[#5949D5] text-white':'text-black text-sm'}`}>
              {tab==='production'?'Production Output':tab==='material'?'Material Usage':tab==='inventory'?'Inventory Status':'Supplier Info'}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="text-white" style={{background:'linear-gradient(135deg, #8E7DFF, #6C5CE7)'}}>
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">No.</th>
                {activeTab==='production' && <>
                  <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Batch ID</th>
                  <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Task</th>
                  <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Material Quantity</th>
                  <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Unit</th>
                  <th className="px-6 py-3 text-center text-sm font-medium">Actions</th>
                </>}
                {activeTab==='material' && <>
                  <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Material</th>
                  <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Stock Quantity</th>
                  <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Min Required</th>
                  <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Unit</th>
                  <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Supplier</th>
                  <th className="px-6 py-3 text-center text-sm font-medium">Actions</th>
                </>}
                {activeTab==='inventory' && <>
                  <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Item</th>
                  <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Minimum Required</th>

                  <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Unit</th>
                  <th className="px-6 py-3 text-center text-sm font-medium">Actions</th>
                </>}
                {activeTab==='supplier' && <>
                  <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Supplier</th>
                  <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Contact Person</th>
                  <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Material</th>
                  <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Unit</th>
                  <th className="px-6 py-3 text-center text-sm font-medium">Actions</th>
                </>}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentData.map((row,index)=>(
                <tr key={row.id} className="hover:bg-gray-50 text-black">
                  <td className="px-6 py-3 whitespace-nowrap">
                    <div className="w-7 h-7 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-semibold text-sm">
                      {indexOfFirstItem + index + 1}
                    </div>
                  </td>

                  {/* Production */}
                  {activeTab==='production' && <>
                    <td className="px-6 py-3 whitespace-nowrap text-base">{row.id}</td>
                    <td className="px-6 py-3 whitespace-nowrap text-base">{row.product}</td>
                    <td className="px-6 py-3 whitespace-nowrap text-base">{row.quantity}</td>
                    <td className="px-6 py-3 whitespace-nowrap text-base">{row.materialQuantity}</td>
                    <td className="px-6 py-3 whitespace-nowrap text-base">{row.unit}</td>
                    <td className="px-6 py-3 text-center text-base font-medium">
                      <button onClick={() => handleDeleteClick(row.id, activeTab)} className="text-red-600 hover:text-red-800 p-1" title="Delete">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      </button>
                    </td>
                  </>}

                  {/* Material */}
                  {activeTab==='material' && <>
                    <td className="px-6 py-3 whitespace-nowrap text-base">{row.material}</td>
                    <td className="px-6 py-3 whitespace-nowrap text-base">{row.used}</td>
                    <td className="px-6 py-3 whitespace-nowrap text-base">{row.remaining}</td>
                    <td className="px-6 py-3 whitespace-nowrap text-base">{row.unit}</td>
                    <td className="px-6 py-3 whitespace-nowrap text-base">{row.supplier}</td>
                    <td className="px-6 py-3 text-center text-base font-medium">
                      <button onClick={() => handleDeleteClick(row.id, activeTab)} className="text-red-600 hover:text-red-800 p-1" title="Delete">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      </button>
                    </td>
                  </>}

                  {/* Inventory */}
                  {activeTab==='inventory' && <>
                    <td className="px-6 py-3 whitespace-nowrap text-base">{row.item}</td>
                    <td className="px-6 py-3 whitespace-nowrap text-base">{row.current}</td>
                    <td className="px-6 py-3 whitespace-nowrap text-base">{row.min}</td>
                    <td className="px-6 py-3 whitespace-nowrap text-base">{row.unit}</td>
                    <td className="px-6 py-3 text-center text-base font-medium">
                      <button onClick={() => handleDeleteClick(row.id, activeTab)} className="text-red-600 hover:text-red-800 p-1" title="Delete">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      </button>
                    </td>
                  </>}

                  {/* Supplier */}
                  {activeTab==='supplier' && <>
                    <td className="px-6 py-3 whitespace-nowrap text-base">{row.supplier}</td>
                    <td className="px-6 py-3 whitespace-nowrap text-base">{row.contact_person}</td>
                    <td className="px-6 py-3 whitespace-nowrap text-base">{row.material}</td>
                    <td className="px-6 py-3 whitespace-nowrap text-base">{row.quantity}</td>
                    <td className="px-6 py-3 whitespace-nowrap text-base">{row.unit}</td>
                    <td className="px-6 py-3 text-center text-base font-medium">
                      <button onClick={() => handleDeleteClick(row.id, activeTab)} className="text-red-600 hover:text-red-800 p-1" title="Delete">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      </button>
                    </td>
                  </>}

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Delete Confirmation Modal */}
      {deleteInfo.open && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Confirm Delete</h3>
      <p className="text-gray-600 mb-6">Are you sure you want to delete this item?</p>

      <div className="flex justify-end gap-3">
        <button
          onClick={cancelDelete}
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md font-semibold"
        >
          Cancel
        </button>

        <button
          onClick={confirmDelete}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-semibold"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}

        {/* Pagination */}
        <div className="mt-4 flex justify-end space-x-2">
          <button onClick={()=>handlePageChange(currentPage-1)} disabled={currentPage===1}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50">Previous</button>
          {Array.from({length:totalPages},(_,i)=>(
            <button key={i+1} onClick={()=>handlePageChange(i+1)}
              className={`px-3 py-2 rounded-md text-sm ${currentPage===i+1?'bg-[#6C5CE7] text-white':'border border-gray-300 hover:bg-gray-50'}`}>{i+1}</button>
          ))}
          <button onClick={()=>handlePageChange(currentPage+1)} disabled={currentPage===totalPages}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50">Next</button>
        </div>

      </section>
    </div>
  )
}
