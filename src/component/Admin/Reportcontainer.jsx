import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../../AuthContext'

export default function Reportcontainer() {
  
    // getting role for conditional rendering
     const { user } = useAuth();
     const role = user?.role;
   

  const [reportForm, setReportForm] = useState({
    reportType: 'Production Output',
    fromDate: '',
    toDate: ''
  })

  const [activeTab, setActiveTab] = useState('material')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Dynamic data
  const [materialData, setMaterialData] = useState([])
  const [stockData, setStockData] = useState([])
  const [deliveryData, setDeliveryData] = useState([])

  // Delete modal state
  const [deleteInfo, setDeleteInfo] = useState({ open: false, id: null, type: '' })

  // Fetch data with fields matching table headers exactly
  const fetchData = async (tab) => {
    try {
      switch(tab){
        case 'material': {
          const prodRes = await axios.get('/productions')
          const materialUsageMap = prodRes.data.reduce((acc, item) => {
            if (item.material_name && item.material_quantity) {
              const key = item.material_name;
              if (!acc[key]) {
                acc[key] = {
                  materialName: item.material_name,
                  totalUsed: 0,
                  usedFor: [],
                  unit: item.unit || '-'
                };
              }
              acc[key].totalUsed += Number(item.material_quantity || 0);
              acc[key].usedFor.push({
                task: item.task || 'Unknown Task',
                materialQty: item.material_quantity,
                productQty: item.quantity || 0,
                date: item.assign_date || item.created_at
              });
            }
            return acc;
          }, {});

          setMaterialData(Object.entries(materialUsageMap).map(([key, value], index) => ({
            id: index + 1,
            material: value.materialName,
            totalUsed: value.totalUsed,
            unit: value.unit,
            usedFor: value.usedFor
          })));
          break
        }
        case 'delivery': {
          // Fetch delivery data from stock-deliveries table
          const deliveryRes = await axios.get('/stock-deliveries');
          
          setDeliveryData(deliveryRes.data.map(item => ({
            id: item.id,
            itemName: item.item_name || 'N/A',
            buyerName: item.supplier || '-',
            totalQuantity: item.quantity || 0, // Total ordered/produced
            quantity: item.quantity - (item.delivered_quantity || 0), // Remaining quantity
            deliveryStatus: item.delivery_status || 'Pending',
            deliveredQty: item.delivered_quantity || 0,
            unit: 'Piece',
            date: item.updated_at || item.created_at || '-'
          })));
          
          // Listen for inventory updates
          const handleInventoryUpdate = () => {
            fetchData('delivery');
          };
          window.addEventListener('inventory-updated', handleInventoryUpdate);
          
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
      case 'material': data = materialData; break
      case 'delivery': data = deliveryData; break
      default: return []
    }
    const start = (currentPage-1)*itemsPerPage
    const end = start + itemsPerPage
    return data.slice(start, end)
  }

  const getTotalPages = () => {
    let length = 0
    switch(activeTab){
      case 'material': length = materialData.length; break
      case 'delivery': length = deliveryData.length; break
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
    if(type==='material') setMaterialData(prev=>prev.filter(i=>i.id!==id))
    if(type==='delivery') setDeliveryData(prev=>prev.filter(i=>i.id!==id))
  }
  const handleDeleteClick = (id, type) => setDeleteInfo({ open:true, id, type })
  const confirmDelete = () => { deleteRow(deleteInfo.id, deleteInfo.type); setDeleteInfo({ open:false, id:null, type:'' }) }
  const cancelDelete = () => setDeleteInfo({ open:false, id:null, type:'' })

  // CSV download
  const downloadReport = () => {
    let currentData = []
    let filename = ''
    switch(activeTab){
      case 'material': 
        currentData = materialData; 
        filename='material_report.csv'; 
        break
      case 'delivery': 
        currentData = deliveryData; 
        filename='delivery_report.csv'; 
        break
      default: return
    }
    if(currentData.length===0){ alert('No data to download'); return }

    // apply date range filter if provided
    const from = reportForm.fromDate || ''
    const to = reportForm.toDate || ''
    let filtered = currentData
    
    if(activeTab === 'delivery' && (from || to)){
      filtered = currentData.filter(r => {
        if (r.date === '-') return false;
        const itemDate = new Date(r.date).toISOString().slice(0, 10);
        if(from && to) return itemDate >= from && itemDate <= to
        if(from) return itemDate >= from
        return itemDate <= to
      })
    } else if(activeTab === 'material' && (from || to)){
      filtered = currentData.filter(r => {
        const d = (r.date || '').toString().slice(0,10)
        if(!d) return false
        if(from && to) return d >= from && d <= to
        if(from) return d >= from
        return d <= to
      })
    }
    
    if(filtered.length===0){ alert('No data in selected date range'); return }

    // Prepare CSV data based on tab
    let csvContent = '';
    if(activeTab === 'delivery'){
      // Add tab header
      const tabHeader = 'Stock & Delivery Summary';
      const filterInfo = (from || to) 
        ? `Date Filter: From ${from || 'start'} to ${to || 'today'}` 
        : 'Date Filter: All Records';
      
      // Custom headers for delivery data
      const headers = ['Date', 'Item Name', 'Delivered Quantity', 'Supplier/Buyer', 'Remaining', 'Status', 'Unit'];
      const rows = filtered.sort((a, b) => new Date(b.date) - new Date(a.date)).map(r => [
        r.date !== '-' ? new Date(r.date).toLocaleDateString() : '',
        r.itemName || '',
        r.deliveredQty || 0,
        r.buyerName || '',
        r.quantity || 0,
        r.deliveryStatus || '',
        r.unit || ''
      ].map(cell => String(cell).replace(/,/g, '')).join(','));
      
      csvContent = [tabHeader, filterInfo, '', headers.join(','), ...rows].join('\n');
    } else {
      // Add tab header for material
      const tabHeader = 'Material Usage Report';
      const filterInfo = (from || to) 
        ? `Date Filter: From ${from || 'start'} to ${to || 'today'}` 
        : 'Date Filter: All Records';
      
      // Material usage CSV with task details
      const headers = ['Material Name', 'Task Name', 'Material Used', 'Items Produced', 'Date', 'Unit'];
      const csvRows = [];
      
      filtered.forEach(material => {
        if (material.usedFor && material.usedFor.length > 0) {
          material.usedFor.forEach(usage => {
            csvRows.push([
              material.material || '',
              usage.task || '',
              usage.materialQty || 0,
              usage.productQty || 0,
              usage.date ? new Date(usage.date).toLocaleDateString() : '-',
              material.unit || ''
            ].map(cell => String(cell).replace(/,/g, '')).join(','));
          });
        }
      });
      
      csvContent = [tabHeader, filterInfo, '', headers.join(','), ...csvRows].join('\n');
    }
    
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


        {/* Existing Reports Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Existing Reports</h2>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700">From</label>
            <input type="date" value={reportForm.fromDate} onChange={e=>handleInputChange('fromDate', e.target.value)}
              className="px-2 py-1 border border-gray-300 rounded-md" />

            <label className="text-sm text-gray-700">To</label>
            <input type="date" value={reportForm.toDate} onChange={e=>handleInputChange('toDate', e.target.value)}
              className="px-2 py-1 border border-gray-300 rounded-md" />

            <button onClick={downloadReport} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-semibold flex items-center gap-2 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Download Report
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-4">
          {['material','delivery'].map(tab=>(
            <button key={tab} onClick={()=>handleTabChange(tab)}
              className={`px-4 py-2 font-medium rounded ${activeTab===tab?'bg-[#6C5CE7] text-white hover:bg-[#5949D5]':'bg-white text-black text-sm border border-gray-200'}`}>
              {tab==='material'?'Material Usage':'Stock & Delivery Summary'}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'material' ? (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Material Usage</h3>
            <div className="space-y-4">
              {currentData.map((row, index) => (
                <div key={row.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-lg font-bold text-purple-700">{row.material}</h4>
                    <span className="bg-purple-600 text-white px-3 py-1 rounded font-bold text-sm">
                      Total: {row.totalUsed} {row.unit}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    {row.usedFor && row.usedFor.map((usage, idx) => (
                      <div key={idx} className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border-l-4 border-purple-500">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Task Name</p>
                            <p className="text-sm font-bold text-gray-800">{usage.task}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Material Used</p>
                            <span className="inline-block bg-blue-600 text-white px-3 py-1 rounded text-sm font-bold">
                              {usage.materialQty} {row.unit}
                            </span>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Items Produced</p>
                            <span className="inline-block bg-green-600 text-white px-3 py-1 rounded text-sm font-bold">
                              {usage.productQty} items
                            </span>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Date</p>
                            <p className="text-sm font-medium text-gray-700">
                              {usage.date ? new Date(usage.date).toLocaleDateString() : '-'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Stock & Delivery Summary
            </h3>
            
            {(() => {
              // Filter data by date range if provided
              const from = reportForm.fromDate || '';
              const to = reportForm.toDate || '';
              let filtered = deliveryData;
              
              if (from || to) {
                filtered = deliveryData.filter(item => {
                  if (item.date === '-') return false;
                  const itemDate = new Date(item.date).toISOString().slice(0, 10);
                  if (from && to) return itemDate >= from && itemDate <= to;
                  if (from) return itemDate >= from;
                  return itemDate <= to;
                });
              }
              
              // Group by month
              const monthlyData = {};
              filtered.forEach(item => {
                const date = new Date(item.date);
                const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                const monthName = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
                
                if (!monthlyData[monthYear]) {
                  monthlyData[monthYear] = {
                    monthName,
                    totalProduced: 0,
                    totalDelivered: 0,
                    items: []
                  };
                }
                monthlyData[monthYear].totalProduced += item.totalQuantity || 0;
                monthlyData[monthYear].totalDelivered += item.deliveredQty || 0;
                monthlyData[monthYear].items.push(item);
              });
              
              // Calculate totals
              const totalProduced = filtered.reduce((sum, item) => sum + (item.totalQuantity || 0), 0);
              const totalDelivered = filtered.reduce((sum, item) => sum + (item.deliveredQty || 0), 0);
              
              return (
                <>
                  {/* Charts Side by Side */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Item-wise Production Chart */}
                    <div className="bg-white rounded-lg shadow p-6">
                      <h4 className="text-lg font-bold text-gray-900 mb-4">Item-wise Production</h4>
                      {(() => {
                        // Group by item name
                        const itemData = {};
                        filtered.forEach(item => {
                          const itemName = item.itemName;
                          if (!itemData[itemName]) {
                            itemData[itemName] = 0;
                          }
                          itemData[itemName] += item.totalQuantity || 0;
                        });
                        
                        const items = Object.entries(itemData).sort((a, b) => b[1] - a[1]); // Sort by quantity desc
                        const maxValue = Math.max(...items.map(i => i[1]), 1);
                        
                        return (
                          <div className="flex items-end justify-around h-72 border-b-2 border-l-2 border-gray-300 p-4 overflow-x-auto">
                            {items.map(([itemName, quantity], index) => (
                              <div key={index} className="flex flex-col items-center min-w-[80px] mx-2">
                                <div className="flex items-end justify-center h-56 w-full">
                                  <div className="relative flex flex-col items-center w-full">
                                    <div 
                                      className="w-14 bg-gradient-to-t from-green-600 to-green-400 rounded-t hover:opacity-80 transition-all shadow-md"
                                      style={{ height: `${(quantity / maxValue) * 200}px`, minHeight: '20px' }}
                                    >
                                      <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-green-700 text-white text-xs px-2 py-1 rounded font-bold whitespace-nowrap shadow">
                                        {quantity}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <p className="text-xs font-semibold text-gray-700 mt-2 text-center max-w-[80px] break-words">{itemName}</p>
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                      <div className="flex justify-center mt-4">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-gradient-to-t from-green-600 to-green-400 rounded"></div>
                          <span className="text-sm font-medium text-gray-700">Production Quantity</span>
                        </div>
                      </div>
                    </div>

                    {/* Item-wise Delivery Chart */}
                    <div className="bg-white rounded-lg shadow p-6">
                      <h4 className="text-lg font-bold text-gray-900 mb-4">Item-wise Deliveries</h4>
                      {(() => {
                        // Group by item name
                        const itemData = {};
                        filtered.forEach(item => {
                          const itemName = item.itemName;
                          if (!itemData[itemName]) {
                            itemData[itemName] = 0;
                          }
                          itemData[itemName] += item.deliveredQty || 0;
                        });
                        
                        const items = Object.entries(itemData).sort((a, b) => b[1] - a[1]); // Sort by quantity desc
                        const maxValue = Math.max(...items.map(i => i[1]), 1);
                        
                        return (
                          <div className="flex items-end justify-around h-72 border-b-2 border-l-2 border-gray-300 p-4 overflow-x-auto">
                            {items.map(([itemName, quantity], index) => (
                              <div key={index} className="flex flex-col items-center min-w-[80px] mx-2">
                                <div className="flex items-end justify-center h-56 w-full">
                                  <div className="relative flex flex-col items-center w-full">
                                    <div 
                                      className="w-14 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t hover:opacity-80 transition-all shadow-md"
                                      style={{ height: `${(quantity / maxValue) * 200}px`, minHeight: '20px' }}
                                    >
                                      <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-blue-700 text-white text-xs px-2 py-1 rounded font-bold whitespace-nowrap shadow">
                                        {quantity}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <p className="text-xs font-semibold text-gray-700 mt-2 text-center max-w-[80px] break-words">{itemName}</p>
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                      <div className="flex justify-center mt-4">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-gradient-to-t from-blue-600 to-blue-400 rounded"></div>
                          <span className="text-sm font-medium text-gray-700">Delivered Quantity</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4 text-sm">
                    {from || to ? (
                      <span className="font-semibold text-purple-700">
                        Showing data from {from || 'start'} to {to || 'today'} • {filtered.length} Records
                      </span>
                    ) : (
                      <span>
                        Overview of stock quantities and delivery status for all items.
                        <span className="font-semibold text-purple-700 ml-2">{filtered.length} Records</span>
                      </span>
                    )}
                  </p>

                  {/* Date-wise Delivery Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse bg-white rounded-lg shadow">
                      <thead className="text-white" style={{background:'linear-gradient(135deg, #8E7DFF, #6C5CE7)'}}>
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider">Date</th>
                          <th className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider">Item Name</th>
                          <th className="px-4 py-3 text-center text-sm font-medium uppercase tracking-wider">Delivered Quantity</th>
                          <th className="px-4 py-3 text-center text-sm font-medium uppercase tracking-wider">Supplier/Buyer</th>
                          <th className="px-4 py-3 text-center text-sm font-medium uppercase tracking-wider">Remaining</th>
                          <th className="px-4 py-3 text-center text-sm font-medium uppercase tracking-wider">Status</th>
                          <th className="px-4 py-3 text-center text-sm font-medium uppercase tracking-wider">Unit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.sort((a, b) => new Date(b.date) - new Date(a.date)).map((item, index) => (
                          <tr key={item.id} className={`border-b ${index % 2 === 0 ? 'bg-purple-50' : 'bg-white'} hover:bg-purple-100`}>
                            <td className="px-4 py-3 text-gray-700 font-medium">
                              {item.date !== '-' ? new Date(item.date).toLocaleDateString() : '-'}
                            </td>
                            <td className="px-4 py-3 font-semibold text-gray-900">{item.itemName}</td>
                            <td className="px-4 py-3 text-center">
                              <span className="bg-blue-600 text-white px-3 py-1 rounded font-bold text-sm">{item.deliveredQty}</span>
                            </td>
                            <td className="px-4 py-3 text-center text-gray-700 font-medium">{item.buyerName}</td>
                            <td className="px-4 py-3 text-center">
                              <span className="bg-indigo-600 text-white px-3 py-1 rounded font-bold text-sm">{item.quantity}</span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              {item.deliveryStatus === 'Delivered' ? (
                                <span className="bg-green-600 text-white px-3 py-1 rounded-full font-bold text-xs">Delivered</span>
                              ) : item.deliveryStatus === 'In Transit' ? (
                                <span className="bg-yellow-600 text-white px-3 py-1 rounded-full font-bold text-xs">In Transit</span>
                              ) : (
                                <span className="bg-gray-600 text-white px-3 py-1 rounded-full font-bold text-xs">Pending</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-center text-gray-700 text-sm font-semibold">{item.unit}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {filtered.length === 0 && (
                    <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500 mt-4">
                      No data available for selected date range
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        )}

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
