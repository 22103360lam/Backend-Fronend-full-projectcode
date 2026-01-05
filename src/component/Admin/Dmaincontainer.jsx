import React, { useState, useEffect } from 'react';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8000/api';

export default function Dmaincontainer() {
  const [dashboardData, setDashboardData] = useState({
    totalMaterials: 0,
    lowStockMaterials: 0,
    assignedTasks: 0,
    inProgressTasks: 0,
    delayedTasks: 0,
    totalItems: 0,
    lowStockItems: 0,
    totalUsers: 0,
    activeAlerts: 0,
    recentActivities: [],
    materialDistribution: { inStock: 0, lowStock: 0, critical: 0, outOfStock: 0 }
  });

  const [deliveryData, setDeliveryData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    fetchDeliveryData();
    
    // Listen for updates
    const handleUpdate = () => {
      fetchDashboardData();
      fetchDeliveryData();
    };
    window.addEventListener('inventory-updated', handleUpdate);
    window.addEventListener('material-updated', handleUpdate);
    
    return () => {
      window.removeEventListener('inventory-updated', handleUpdate);
      window.removeEventListener('material-updated', handleUpdate);
    };
  }, []);

  const fetchDeliveryData = async () => {
    try {
      const deliveryRes = await axios.get('/stock-deliveries');
      
      const data = deliveryRes.data.map(item => ({
        id: item.id,
        itemName: item.item_name || 'N/A',
        buyerName: item.supplier || '-',
        totalQuantity: item.quantity || 0,
        quantity: item.quantity - (item.delivered_quantity || 0),
        deliveryStatus: item.delivery_status || 'Pending',
        deliveredQty: item.delivered_quantity || 0,
        unit: 'Piece',
        date: item.updated_at || item.created_at || '-'
      }));
      
      setDeliveryData(data);
    } catch(err) {
      console.error('Error fetching delivery data:', err);
    }
  };

  const fetchDashboardData = async () => {
    try {
      // Fetch all data
      const [materialsRes, inventoryRes, productionsRes, usersRes] = await Promise.all([
        axios.get('/materials'),
        axios.get('/inventory'),
        axios.get('/productions'),
        axios.get('/users')
      ]);

      const materials = materialsRes.data;
      const inventory = inventoryRes.data;
      const productions = productionsRes.data;
      const users = usersRes.data;

      // Calculate materials stats
      const totalMaterials = materials.length;
      const lowStockMaterials = materials.filter(m => 
        Number(m.quantity || 0) <= Number(m.min_required || 0) && Number(m.min_required || 0) > 0
      ).length;

      // Calculate inventory stats
      const totalItems = inventory.length;
      const lowStockItems = inventory.filter(i => 
        Number(i.quantity || 0) <= Number(i.minimum_required || 0) && Number(i.minimum_required || 0) > 0
      ).length;

      // Calculate task stats
      const totalTasks = productions.length;
      const inProgressTasks = productions.filter(p => p.task_status === 'In Progress').length;
      const delayedTasks = productions.filter(p => {
        if (p.task_status === 'Completed') return false;
        const assignDate = new Date(p.assign_date);
        const today = new Date();
        return today > assignDate;
      }).length;

      // Material distribution
      const inStock = materials.filter(m => {
        const qty = Number(m.quantity || 0);
        const min = Number(m.min_required || 0);
        if (min === 0) return false;
        return qty >= min; // Equal or more than minimum required
      }).length;
      
      const lowStock = materials.filter(m => {
        const qty = Number(m.quantity || 0);
        const min = Number(m.min_required || 0);
        if (min === 0) return false;
        const percentage = (qty / min) * 100;
        return qty < min && percentage >= 30; // Less than min but above 30%
      }).length;
      
      const critical = materials.filter(m => {
        const qty = Number(m.quantity || 0);
        const min = Number(m.min_required || 0);
        if (min === 0) return qty === 0; // If no min required, count only if qty is 0
        const percentage = (qty / min) * 100;
        return percentage < 30; // Below 30% of minimum or out of stock
      }).length;

      const outOfStock = materials.filter(m => Number(m.quantity || 0) === 0).length;

      // Create alerts for low stock and critical materials
      const lowStockMaterialsList = materials.filter(m => {
        const qty = Number(m.quantity || 0);
        const min = Number(m.min_required || 0);
        if (min === 0) return false;
        const percentage = (qty / min) * 100;
        return qty < min && percentage >= 30;
      });

      const criticalMaterialsList = materials.filter(m => {
        const qty = Number(m.quantity || 0);
        const min = Number(m.min_required || 0);
        if (min === 0) return qty === 0;
        const percentage = (qty / min) * 100;
        return percentage < 30;
      });

      // Store alerts in localStorage
      const materialAlerts = [
        ...criticalMaterialsList.map(m => ({
          id: `critical-${m.id}`,
          materialName: m.material_name || m.name || 'Unknown Material',
          status: 'critical stock',
          timestamp: new Date().toISOString()
        })),
        ...lowStockMaterialsList.map(m => ({
          id: `low-${m.id}`,
          materialName: m.material_name || m.name || 'Unknown Material',
          status: 'low stock',
          timestamp: new Date().toISOString()
        }))
      ];
      
      localStorage.setItem('materialAlerts', JSON.stringify(materialAlerts));
      window.dispatchEvent(new Event('material-alerts-updated'));

      // Calculate total users
      const totalUsers = Array.isArray(users) ? users.length : 0;

      // Recent activities (latest 3 productions)
      const recentActivities = productions
        .sort((a, b) => new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at))
        .slice(0, 3)
        .map(p => ({
          text: `${p.task_status === 'Completed' ? 'Completed' : 'Updated'} ${p.task || 'task'}`,
          time: getTimeAgo(new Date(p.updated_at || p.created_at)),
          status: p.task_status === 'Completed' ? 'completed' : 'updated'
        }));

      setDashboardData({
        totalMaterials,
        lowStockMaterials,
        assignedTasks: totalTasks,
        inProgressTasks,
        delayedTasks,
        totalItems,
        lowStockItems,
        totalUsers,
        activeAlerts: lowStockMaterials + lowStockItems,
        recentActivities,
        materialDistribution: { inStock, lowStock, critical, outOfStock }
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  return (
    <div>
      {/* Dashboard Content */}
      <div className="p-4 md:p-6 bg-[#eff1f9] ">
        {/* Dashboard Overview */}
        <section className="mb-6 md:mb-8">
          <h1 className="text-lg font-bold mb-2">Dashboard Overview</h1>
          <p className="text-sm text-gray-600 mb-4">Welcome back! Here's your current tasks and responsibilities.</p>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">

            {/* Total Materials */}
            <div className="relative overflow-hidden rounded-lg p-6 flex flex-col justify-between bg-white shadow-md border-l-4 lg:border-l-8 text-gray-800" style={{ borderColor: "#5A4BCF" }}>
              <div className="flex justify-between items-center mb-4">
                <div className="flex flex-col items-start">
                  <p className="text-sm font-medium uppercase mb-1" style={{ color: "#5A4BCF" }}>Total Materials</p>
                  <p className="text-3xl font-bold">{dashboardData.totalMaterials}</p>
                  <p className="text-sm font-medium opacity-80">{dashboardData.lowStockMaterials} Low Stock</p>
                </div>
                <img src="/asset/box-minimalistic-svgrepo-com.svg" className="h-12 w-12 ml-4 opacity-80" />
              </div>
            </div>

            {/* Assigned Tasks */}
            <div className="relative overflow-hidden rounded-lg p-6 flex flex-col justify-between bg-white shadow-md border-l-4 lg:border-l-8 text-gray-800" style={{ borderColor: "#28A745" }}>
              <div className="flex justify-between items-center mb-4">
                <div className="flex flex-col items-start">
                  <p className="text-sm font-medium uppercase mb-1" style={{ color: "#28A745" }}>Assigned Tasks</p>
                  <p className="text-3xl font-bold">{dashboardData.assignedTasks}</p>
                  <p className="text-sm font-medium opacity-80">{dashboardData.inProgressTasks} in progress, {dashboardData.delayedTasks} delayed</p>
                </div>
                <img src="/asset/factory-svgrepo-com (1).svg" className="h-12 w-12 ml-4 opacity-80" />
              </div>
            </div>

            {/* Total Items */}
            <div className="relative overflow-hidden rounded-lg p-6 flex flex-col justify-between bg-white shadow-md border-l-4 lg:border-l-8 text-gray-800" style={{ borderColor: "#17A2B8" }}>
              <div className="flex justify-between items-center mb-4">
                <div className="flex flex-col items-start">
                  <p className="text-sm font-medium uppercase mb-1" style={{ color: "#17A2B8" }}>Total Items</p>
                  <p className="text-3xl font-bold">{dashboardData.totalItems}</p>
                  <p className="text-sm font-medium opacity-80">{dashboardData.lowStockItems} Low Stock</p>
                </div>
                <img src="/asset/box-check-svgrepo-com.svg" className="h-12 w-12 ml-4 opacity-80" />
              </div>
            </div>

            {/* Total Users */}
            <div className="relative overflow-hidden rounded-lg p-6 bg-white shadow-md border-l-4 border-blue-400">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium uppercase mb-2 text-blue-400">TOTAL USERS</p>
                  <p className="text-3xl font-bold text-gray-900">{dashboardData.totalUsers}</p>
                </div>
                <img src="asset/users-svgrepo-com.svg" className="h-12 w-12 opacity-80" alt="Users" />
              </div>
            </div>

          </div>
        </section>

        {/* My Recent Activities & Material Stock Distribution */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">

          {/* My Recent Activities */}
          <div className="bg-white shadow rounded-lg p-4 md:p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
              <h3 className="font-semibold text-lg text-gray-800">My Recent Activities</h3>
            </div>
            <div className="space-y-3">
              {dashboardData.recentActivities.length === 0 ? (
                <p className="text-sm text-gray-500">No recent activities</p>
              ) : (
                dashboardData.recentActivities.map((activity, index) => (
                  <div key={index} className={`flex items-start gap-2 p-2 ${activity.status === 'completed' ? 'bg-green-50 border-l-4 border-green-400' : 'bg-blue-50 border-l-4 border-blue-400'} rounded-r-lg`}>
                    <div className={`w-6 h-6 ${activity.status === 'completed' ? 'bg-green-100' : 'bg-blue-100'} rounded-full flex items-center justify-center mt-1`}>
                      <svg className={`w-3 h-3 ${activity.status === 'completed' ? 'text-green-600' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4"></path>
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700">{activity.text}</p>
                      <p className="text-sm text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Material Stock Distribution */}
          <div className="bg-white shadow rounded-lg p-4 md:p-6">
            <h3 className="font-semibold mb-4 text-lg">Material Stock Distribution</h3>
            <div className="space-y-2">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left pb-2 font-medium text-sm text-gray-700">Stock Level</th>
                    <th className="text-right pb-2 font-medium text-sm text-gray-700">Count</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-1 flex items-center gap-2 text-base">
                      <div className="w-2 h-2 rounded-full bg-[#10B981]"></div>
                      <span className="text-gray-700">In Stock</span>
                    </td>
                    <td className="py-1 text-right text-base">
                      <span className="font-semibold text-[#10B981] text-sm">{dashboardData.materialDistribution.inStock}</span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-1 flex items-center gap-2 text-base">
                      <div className="w-2 h-2 rounded-full bg-[#F59E0B]"></div>
                      <span className="text-gray-700">Low Stock</span>
                    </td>
                    <td className="py-1 text-right text-base">
                      <span className="font-semibold text-[#F59E0B] text-sm">{dashboardData.materialDistribution.lowStock}</span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-1 flex items-center gap-2 text-base">
                      <div className="w-2 h-2 rounded-full bg-[#EF4444]"></div>
                      <span className="text-gray-700">Critical</span>
                    </td>
                    <td className="py-1 text-right text-base">
                      <span className="font-semibold text-[#EF4444] text-sm">{dashboardData.materialDistribution.critical}</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 flex items-center gap-2 text-base">
                      <div className="w-2 h-2 rounded-full bg-[#6B7280]"></div>
                      <span className="text-gray-700">Out of Stock</span>
                    </td>
                    <td className="py-1 text-right text-base">
                      <span className="font-semibold text-[#6B7280] text-sm">{dashboardData.materialDistribution.outOfStock}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </section>

        {/* Production & Delivery Charts */}
        <section className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Production & Delivery Summary
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Item-wise Production Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="text-lg font-bold text-gray-900 mb-4">Item-wise Production</h4>
            {(() => {
              // Group by item name
              const itemData = {};
              deliveryData.forEach(item => {
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
                  {items.length === 0 ? (
                    <div className="text-center text-gray-500 w-full">No production data available</div>
                  ) : (
                    items.map(([itemName, quantity], index) => (
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
                    ))
                  )}
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
              deliveryData.forEach(item => {
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
                  {items.length === 0 ? (
                    <div className="text-center text-gray-500 w-full">No delivery data available</div>
                  ) : (
                    items.map(([itemName, quantity], index) => (
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
                    ))
                  )}
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
        </section>

      </div>
    </div>
  );
}
