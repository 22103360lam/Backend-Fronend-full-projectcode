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
      // Custom headers for delivery data
      const headers = ['Item Name', 'Buyer Name', 'Total Quantity', 'Delivered', 'Remaining', 'Delivery Status', 'Unit', 'Date'];
      const rows = filtered.map(r => [
        r.itemName || '',
        r.buyerName || '',
        r.totalQuantity || 0,
        r.deliveredQty || 0,
        r.quantity || 0,
        r.deliveryStatus || '',
        r.unit || '',
        r.date !== '-' ? new Date(r.date).toLocaleDateString() : ''
      ].map(cell => String(cell).replace(/,/g, '')).join(','));
      csvContent = [headers.join(','), ...rows].join('\n');
    } else {
      // Default CSV for material
      const headers = Object.keys(filtered[0]).filter(k=>k!=='id' && k!=='usedFor')
      const csvRows = filtered.map(r=> headers.map(h=> (r[h] ?? '').toString().replace(/,/g, '')).join(','))
      csvContent = [headers.join(','), ...csvRows].join('\n')
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
        <div className="flex space-x-4 mb-4 border-b border-gray-200 bg-white rounded-t-lg">
          {['material','delivery'].map(tab=>(
            <button key={tab} onClick={()=>handleTabChange(tab)}
              className={`px-4 py-2 font-medium ${activeTab===tab?'bg-[#6C5CE7] border-b-2 rounded hover:bg-[#5949D5] text-white':'text-black text-sm'}`}>
              {tab==='material'?'Material Usage':'Stock & Delivery Summary'}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'material' ? (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="text-white" style={{background:'linear-gradient(135deg, #8E7DFF, #6C5CE7)'}}>
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">No.</th>
                  <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Material Name</th>
                  <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Total Used</th>
                  <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Unit</th>
                  <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Used For (Tasks)</th>
                  {(role === "Admin") && (
                  <th className="px-6 py-3 text-center text-sm font-medium">Actions</th>
                  )}
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
                    <td className="px-6 py-3 whitespace-nowrap text-base font-bold text-gray-900">{row.material}</td>
                    <td className="px-6 py-3 whitespace-nowrap text-base">
                      <span className="bg-purple-600 text-white px-4 py-1.5 rounded font-bold">{row.totalUsed}</span>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-base text-gray-700 font-semibold">{row.unit}</td>
                    <td className="px-4 py-3">
                      <table className="w-full text-sm border border-gray-300 rounded">
                        <thead className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-semibold">Task Name</th>
                            <th className="px-3 py-2 text-center text-xs font-semibold">Material Used</th>
                            <th className="px-3 py-2 text-center text-xs font-semibold">Items Produced</th>
                            <th className="px-3 py-2 text-right text-xs font-semibold">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {row.usedFor && row.usedFor.map((usage, idx) => (
                            <tr key={idx} className="border-b border-gray-200 hover:bg-blue-50">
                              <td className="px-3 py-2 font-medium text-gray-800">{usage.task}</td>
                              <td className="px-3 py-2 text-center">
                                <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold">{usage.materialQty} {row.unit}</span>
                              </td>
                              <td className="px-3 py-2 text-center">
                                <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">{usage.productQty} items</span>
                              </td>
                              <td className="px-3 py-2 text-right text-gray-600 text-xs">{usage.date ? new Date(usage.date).toLocaleDateString() : '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                    {(role === "Admin") && (
                    <td className="px-6 py-3 text-center text-base font-medium">
                      <button onClick={() => handleDeleteClick(row.id, activeTab)} className="text-red-600 hover:text-red-800 p-1" title="Delete">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      </button>
                    </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-2xl">📦</span> Stock & Delivery Summary
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    <div className="relative overflow-hidden rounded-lg p-6 flex flex-col justify-between bg-white shadow-md border-l-4 border-[#28A745] lg:border-l-8 text-gray-800">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex flex-col items-start">
                          <p className="font-medium text-[#28A745] uppercase mb-1">Total Produced</p>
                          <p className="text-xl font-bold">{totalProduced} Piece</p>
                        </div>
                        <img src="/asset/box-minimalistic-svgrepo-com.svg" alt="produced" className="h-10 w-10 ml-4 opacity-70" />
                      </div>
                    </div>
                    <div className="relative overflow-hidden rounded-lg p-6 flex flex-col justify-between bg-white shadow-md border-l-4 border-[#5A4BCF] lg:border-l-8 text-gray-800">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex flex-col items-start">
                          <p className="font-medium text-[#5A4BCF] uppercase mb-1">Total Delivered</p>
                          <p className="text-xl font-bold">{totalDelivered} Piece</p>
                        </div>
                        <img src="/asset/instock (2).png" alt="delivered" className="h-10 w-10 ml-4 opacity-70" />
                      </div>
                    </div>
                    <div className="relative overflow-hidden rounded-lg p-6 flex flex-col justify-between bg-white shadow-md border-l-4 border-[#FF6B35] lg:border-l-8 text-gray-800">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex flex-col items-start">
                          <p className="font-medium text-[#FF6B35] uppercase mb-1">Remaining Stock</p>
                          <p className="text-xl font-bold">{totalProduced - totalDelivered} Piece</p>
                        </div>
                        <img src="/asset/box-minimalistic-svgrepo-com.svg" alt="remaining" className="h-10 w-10 ml-4 opacity-70" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Weekly Graph */}
                  <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-4">Weekly Production & Delivery Overview</h4>
                    {(() => {
                      // Calculate weekly data
                      const weeklyData = {};
                      filtered.forEach(item => {
                        if (item.date === '-') return;
                        const date = new Date(item.date);
                        const weekStart = new Date(date);
                        weekStart.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
                        const weekKey = weekStart.toISOString().slice(0, 10);
                        
                        if (!weeklyData[weekKey]) {
                          weeklyData[weekKey] = {
                            weekLabel: `Week ${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
                            produced: 0,
                            delivered: 0
                          };
                        }
                        weeklyData[weekKey].produced += item.totalQuantity || 0;
                        weeklyData[weekKey].delivered += item.deliveredQty || 0;
                      });
                      
                      const weeks = Object.values(weeklyData).slice(-4); // Last 4 weeks
                      const maxValue = Math.max(...weeks.flatMap(w => [w.produced, w.delivered]), 1);
                      
                      return (
                        <div className="space-y-4">
                          {weeks.map((week, index) => (
                            <div key={index}>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-sm font-semibold text-gray-700">{week.weekLabel}</span>
                                <span className="text-xs text-gray-500">Produced: {week.produced} | Delivered: {week.delivered}</span>
                              </div>
                              <div className="flex gap-2">
                                <div className="flex-1">
                                  <div className="h-8 bg-gray-200 rounded overflow-hidden">
                                    <div 
                                      className="h-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-end pr-2 text-white text-xs font-bold transition-all duration-300"
                                      style={{ width: `${(week.produced / maxValue) * 100}%` }}
                                    >
                                      {week.produced > 0 && week.produced}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <div className="h-8 bg-gray-200 rounded overflow-hidden">
                                    <div 
                                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-end pr-2 text-white text-xs font-bold transition-all duration-300"
                                      style={{ width: `${(week.delivered / maxValue) * 100}%` }}
                                    >
                                      {week.delivered > 0 && week.delivered}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
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

                  {Object.entries(monthlyData).sort().reverse().map(([monthKey, monthInfo]) => (
                    <div key={monthKey} className="mb-8">
                      <div className="text-white px-4 py-2 rounded-t-lg flex justify-between items-center" style={{background:'linear-gradient(135deg, #8E7DFF, #6C5CE7)'}}>
                        <h4 className="text-lg font-bold">{monthInfo.monthName}</h4>
                        <div className="flex gap-4 text-sm">
                          <span>Produced: <strong>{monthInfo.totalProduced}</strong></span>
                          <span>Delivered: <strong>{monthInfo.totalDelivered}</strong></span>
                          <span>Remaining: <strong>{monthInfo.totalProduced - monthInfo.totalDelivered}</strong></span>
                        </div>
                      </div>
                      
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead className="text-white" style={{background:'linear-gradient(135deg, #8E7DFF, #6C5CE7)'}}>
                            <tr>
                              <th className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider">Item Name</th>
                              <th className="px-4 py-3 text-center text-sm font-medium uppercase tracking-wider">Buyer Name</th>
                              <th className="px-4 py-3 text-center text-sm font-medium uppercase tracking-wider">Total Quantity</th>
                              <th className="px-4 py-3 text-center text-sm font-medium uppercase tracking-wider">Delivered</th>
                              <th className="px-4 py-3 text-center text-sm font-medium uppercase tracking-wider">Remaining</th>
                              <th className="px-4 py-3 text-center text-sm font-medium uppercase tracking-wider">Delivery Status</th>
                              <th className="px-4 py-3 text-center text-sm font-medium uppercase tracking-wider">Unit</th>
                              <th className="px-4 py-3 text-center text-sm font-medium uppercase tracking-wider">Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {monthInfo.items.map((item, index) => {
                              return (
                                <tr key={item.id} className={`border-b ${index % 2 === 0 ? 'bg-purple-50' : 'bg-white'} hover:bg-purple-100`}>
                                  <td className="px-4 py-3 font-semibold text-gray-900">{item.itemName}</td>
                                  <td className="px-4 py-3 text-center text-gray-700">{item.buyerName}</td>
                                  <td className="px-4 py-3 text-center">
                                    <span className="bg-green-600 text-white px-3 py-1 rounded font-bold text-sm">{item.totalQuantity}</span>
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    <span className="bg-blue-600 text-white px-3 py-1 rounded font-bold text-sm">{item.deliveredQty}</span>
                                  </td>
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
                                  <td className="px-4 py-3 text-center text-gray-700 text-sm">
                                    {item.date !== '-' ? new Date(item.date).toLocaleDateString() : '-'}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                  
                  {Object.keys(monthlyData).length === 0 && (
                    <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
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
