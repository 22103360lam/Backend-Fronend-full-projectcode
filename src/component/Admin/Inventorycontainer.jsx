import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Addinventory from '../Adminpages/Addinventory';
import { useAuth } from '../../AuthContext';

// Axios base URL pointing to your Laravel API
axios.defaults.baseURL = 'http://localhost:8000/api';

export default function Inventorycontainer() {

  // getting role for conditional rendering
  const { user } = useAuth();
  const role = user?.role;

  const [inventory, setInventory] = useState([]);
  const [filters, setFilters] = useState({ name: '' });
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch inventory on mount
  useEffect(() => {
    fetchInventory();

    // Listen for inventory updates from production page
    const handleInventoryUpdate = () => {
      fetchInventory();
    };
    window.addEventListener('inventory-updated', handleInventoryUpdate);

    return () => {
      window.removeEventListener('inventory-updated', handleInventoryUpdate);
    };
  }, []);

  // Fetch inventory from inventory table
  const fetchInventory = async () => {
    try {
      const res = await axios.get('/inventory');
      if (Array.isArray(res.data)) {
        const items = res.data.map(item => ({
          id: item.id,
          item_name: item.item_name || '',
          quantity: item.quantity || 0,
          minimum_required: item.minimum_required || 0,
          unit: item.unit || 'Piece',
          status: Number(item.quantity || 0) <= Number(item.minimum_required || 0) && Number(item.minimum_required || 0) > 0 ? 'Low Stock' : 'In Stock',
        }));
        setInventory(items);
        console.log('Inventory data:', items);
      } else {
        setInventory([]);
      }
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
      setInventory([]);
    }
  };

  // Open / close modal
  const openModal = (item = null) => { setSelectedItem(item); setShowModal(true); };
  const closeModal = () => setShowModal(false);

  // Save or update inventory in inventory table
  const handleSave = async (item) => {
    try {
      const quantity = Number(item.quantity ?? 0);
      const minRequired = Number(item.minimumRequired ?? item.minimum_required ?? 0);

      const payload = {
        item_name: item.name ?? item.item_name ?? '',
        quantity: quantity,
        minimum_required: minRequired,
        unit: item.unit || 'Piece',
        status: quantity <= minRequired && minRequired > 0 ? 'Low Stock' : 'In Stock',
      };

      if (item.id) {
        // Update inventory record
        await axios.put(`/inventory/${item.id}`, payload);
      } else {
        // Create new inventory record
        await axios.post('/inventory', payload);
      }

      await fetchInventory();
      closeModal();
    } catch (error) {
      console.error('Failed to save inventory:', error);
      alert('Save failed — see console.');
    }
  };

  // Delete from inventory table
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      // Delete from inventory table
      await axios.delete(`/inventory/${id}`);
      await fetchInventory();
    } catch (error) {
      console.error('Failed to delete from inventory:', error);
    }
  };

  // unique item names for filter dropdown
  const uniqueNames = useMemo(() => {
    return [...new Set(inventory.map(i => (i.item_name ?? '').toString().trim()).filter(Boolean))];
  }, [inventory]);

  // filtered list used for table/pagination (table only)
  const filteredInventory = useMemo(() => {
    const filtered = !filters.name ? inventory : inventory.filter(i => (i.item_name ?? '').toString() === filters.name);
    // Sort by ID descending (newest first)
    return filtered.sort((a, b) => b.id - a.id);
  }, [inventory, filters]);

  // reset page when filter changes
  useEffect(() => { setCurrentPage(1); }, [filters.name]);

  // Pagination (apply to filteredInventory for table)
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredInventory.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredInventory.length / itemsPerPage);

  const goToPage = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  // Summary cards
  const totalItems = inventory.length;
  const inStock = inventory.filter(item => item.status === 'In Stock').length;
  const lowStock = inventory.filter(item => item.status === 'Low Stock').length;

  return (
    <div>
      <section className="p-4 md:p-6 bg-[#eff1f9] min-h-screen">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Inventory / Finished Goods</h1>
            <p className="text-gray-600 mt-1">View current inventory levels and product availability status.</p>
          </div>
          {(role === "Admin") && (
          <button
            onClick={() => openModal(null)}
            className="bg-[#6C5CE7] hover:bg-[#5949D5] text-white font-semibold py-2 px-4 rounded-md text-base flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Inventory</span>
          </button>
          )}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div className="relative overflow-hidden rounded-lg p-6 flex flex-col justify-between bg-white shadow-md border-l-4 border-[#5A4BCF] lg:border-l-8 text-gray-800">
            <div className="flex justify-between items-start mb-2">
              <div className="flex flex-col items-start">
                <p className=" font-medium text-[#5A4BCF] uppercase mb-1">Total Items</p>
                <p className="text-xl font-bold">{totalItems}</p>
              </div>
              <img src="/asset/box-minimalistic-svgrepo-com.svg" alt="total items" className="h-10 w-10 ml-4 opacity-70" />
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg p-6 flex flex-col justify-between bg-white shadow-md border-l-4 border-[#28A745] lg:border-l-8 text-gray-800">
            <div className="flex justify-between items-start mb-2">
              <div className="flex flex-col items-start">
                <p className=" font-medium text-[#28A745] uppercase mb-1">In Stock</p>
                <p className="text-xl font-bold">{inStock}</p>
              </div>
              <img src="/asset/instock (2).png" alt="in stock" className="h-10 w-10 ml-4 opacity-70" />
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg p-6 flex flex-col justify-between bg-white shadow-md border-l-4 border-[#EF4444] lg:border-l-8 text-gray-800">
            <div className="flex justify-between items-start mb-2">
              <div className="flex flex-col items-start">
                <p className=" font-medium text-[#EF4444] uppercase mb-1">Low Stock Alerts</p>
                <p className="text-xl font-bold">{lowStock}</p>
              </div>
              <img src="/asset/alert-filled-svgrepo-com.svg" alt="low stock" className="h-10 w-10 ml-4 opacity-70" />
            </div>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="flex items-center justify-end mb-2">
          <select
            className="px-3 py-2 border rounded bg-white"
            value={filters.name}
            onChange={e => setFilters({ ...filters, name: e.target.value })}
          >
            <option value="">All Items</option>
            {uniqueNames.map(name => <option key={name} value={name}>{name}</option>)}
          </select>
        </div>

        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="text-white" style={{ background: 'linear-gradient(135deg, #8E7DFF, #6C5CE7)' }}>
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Item Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Minimum Required</th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Unit</th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Status</th>
                {(role === "Admin") && (
                <th className="px-6 py-3 text-center text-sm font-medium uppercase tracking-wider">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={role === "Admin" ? "6" : "5"} className="px-6 py-3 text-center">No finished items found</td>
                </tr>
              ) : currentItems.map((item, idx) => (
                <tr key={`${item.id ?? 'noid'}-${(item.item_name ?? 'item').toString().replace(/\s+/g,'_')}-${idx}`} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-3 whitespace-nowrap">{item.item_name}</td>
                  <td className="px-6 py-3 whitespace-nowrap">{item.quantity}</td>
                  <td className="px-6 py-3 whitespace-nowrap">{item.minimum_required}</td>
                  <td className="px-6 py-3 whitespace-nowrap">{item.unit || 'Piece'}</td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      item.status === 'Low Stock' ? 'bg-red-100 text-red-800' :
                      item.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>{item.status}</span>
                  </td>
                  {(role === "Admin") && (
                  <td className="px-6 py-3 text-center">
                    <div className="inline-flex items-center gap-2">
                      <button onClick={() => openModal(item)} className="p-1 rounded-full hover:bg-blue-50">
                        <img src="asset/edit.png" alt="Edit" className="w-4 h-4"/>
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-1 rounded-full hover:bg-red-50">
                        <img src="asset/delete.png" alt="Delete" className="w-4 h-4"/>
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
        {totalPages > 1 && (
          <div className="mt-6 flex justify-end space-x-2">
            <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-2 border border-gray-300 rounded-md text-base hover:bg-gray-50 disabled:opacity-50">Previous</button>
            {[...Array(totalPages)].map((_, idx) => (
              <button key={idx + 1} onClick={() => goToPage(idx + 1)} className={`px-3 py-2 rounded-md text-base ${currentPage === idx + 1 ? 'bg-[#6C5CE7] text-white' : 'border border-gray-300 hover:bg-gray-50'}`}>{idx+1}</button>
            ))}
            <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-2 border border-gray-300 rounded-md text-base hover:bg-gray-50 disabled:opacity-50">Next</button>
          </div>
        )}

        {/* Modal */}
        {showModal && <Addinventory closeModal={closeModal} item={selectedItem} onSave={handleSave} />}

        {/* Stock Deliveries Section */}
        <StockDeliveriesSection role={role} />
      </section>
    </div>
  );
}

// Stock Deliveries Component
function StockDeliveriesSection({ role }) {
  const [stockDeliveries, setStockDeliveries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchStockDeliveries();
  }, []);

  const fetchStockDeliveries = async () => {
    try {
      const res = await axios.get('/stock-deliveries');
      console.log('Fetched stock deliveries:', res.data);
      setStockDeliveries(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Failed to fetch stock deliveries:', error);
    }
  };

  const handleSaveDelivery = async (data) => {
    try {
      console.log('Saving delivery data:', data);
      if (data.id) {
        const response = await axios.put(`/stock-deliveries/${data.id}`, data);
        console.log('Update response:', response.data);
      } else {
        const response = await axios.post('/stock-deliveries', data);
        console.log('Create response:', response.data);
      }
      await fetchStockDeliveries();
      setShowDeliveryModal(false);
    } catch (error) {
      console.error('Failed to save delivery:', error);
      alert(error.response?.data?.message || 'Failed to save delivery');
    }
  };

  const handleUpdateDeliveryStatus = async (id, newStatus) => {
    try {
      const item = stockDeliveries.find(s => s.id === id);
      if (!item) return;
      
      await axios.put(`/stock-deliveries/${id}`, {
        ...item,
        delivery_status: newStatus
      });
      await fetchStockDeliveries();
    } catch (error) {
      console.error('Failed to update delivery status:', error);
      alert('Failed to update delivery status');
    }
  };

  const handleDeleteDelivery = async (id) => {
    if (!window.confirm('Are you sure you want to delete this?')) return;
    try {
      await axios.delete(`/stock-deliveries/${id}`);
      await fetchStockDeliveries();
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // Sort by ID descending (newest first)
  const sortedDeliveries = [...stockDeliveries].sort((a, b) => b.id - a.id);
  const currentItems = sortedDeliveries.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(stockDeliveries.length / itemsPerPage);

  const goToPage = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  return (
    <div className="mt-10">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Stocks & Deliveries</h2>
          <p className="text-gray-600 mt-1">Track stock quantities and delivery status</p>
        </div>
        {role === "Admin" && (
          <button
            onClick={() => { setSelectedDelivery(null); setShowDeliveryModal(true); }}
            className="bg-[#6C5CE7] hover:bg-[#5949D5] text-white font-semibold py-2 px-4 rounded-md text-base flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Stock</span>
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="text-white" style={{ background: 'linear-gradient(135deg, #8E7DFF, #6C5CE7)' }}>
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Item Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Buyer Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Delivery Status</th>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Delivered Quantity</th>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Unit</th>
              {role === "Admin" && (
                <th className="px-6 py-3 text-center text-sm font-medium uppercase tracking-wider">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan={role === "Admin" ? "7" : "6"} className="px-6 py-3 text-center">No stock deliveries found</td>
              </tr>
            ) : currentItems.map((item) => (
              <tr key={item.id} className="border-t border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-3 whitespace-nowrap">{item.item_name}</td>
                <td className="px-6 py-3 whitespace-nowrap">{item.supplier || '-'}</td>
                <td className="px-6 py-3 whitespace-nowrap">{item.quantity - (item.delivered_quantity || 0)}</td>
                <td className="px-6 py-3 whitespace-nowrap">
                  {role === "Admin" ? (
                    item.delivery_status === 'Delivered' ? (
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Delivered
                      </span>
                    ) : (
                      <select
                        value={item.delivery_status}
                        onChange={(e) => handleUpdateDeliveryStatus(item.id, e.target.value)}
                        className={`px-3 py-1 text-xs font-semibold rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] ${
                          item.delivery_status === 'In Transit' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Transit">In Transit</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    )
                  ) : (
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      item.delivery_status === 'Delivered' ? 'bg-green-100 text-green-800' :
                      item.delivery_status === 'In Transit' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>{item.delivery_status}</span>
                  )}
                </td>
                <td className="px-6 py-3 whitespace-nowrap">{item.delivered_quantity}</td>
                <td className="px-6 py-3 whitespace-nowrap">{item.unit}</td>
                {role === "Admin" && (
                  <td className="px-6 py-3 text-center">
                    <div className="inline-flex items-center gap-2">
                      <button onClick={() => { setSelectedDelivery(item); setShowDeliveryModal(true); }} className="p-1 rounded-full hover:bg-blue-50">
                        <img src="asset/edit.png" alt="Edit" className="w-4 h-4"/>
                      </button>
                      <button onClick={() => handleDeleteDelivery(item.id)} className="p-1 rounded-full hover:bg-red-50">
                        <img src="asset/delete.png" alt="Delete" className="w-4 h-4"/>
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
      <div className="mt-6 flex justify-end space-x-2">
        <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-2 border border-gray-300 rounded-md text-base hover:bg-gray-50 disabled:opacity-50">Previous</button>
        {[...Array(totalPages)].map((_, idx) => (
          <button key={idx + 1} onClick={() => goToPage(idx + 1)} className={`px-3 py-2 rounded-md text-base ${currentPage === idx + 1 ? 'bg-[#6C5CE7] text-white' : 'border border-gray-300 hover:bg-gray-50'}`}>{idx+1}</button>
        ))}
        <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-2 border border-gray-300 rounded-md text-base hover:bg-gray-50 disabled:opacity-50">Next</button>
      </div>

      {showDeliveryModal && <DeliveryModal closeModal={() => setShowDeliveryModal(false)} item={selectedDelivery} onSave={handleSaveDelivery} />}
    </div>
  );
}

// Delivery Modal Component
function DeliveryModal({ closeModal, item, onSave }) {
  const [formData, setFormData] = useState({
    item_name: '',
    supplier: '',
    quantity: '',
    delivery_status: 'Pending',
    delivered_quantity: '',
    unit: 'Piece'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (item) {
      setFormData({
        item_name: item.item_name || '',
        supplier: item.supplier || '',
        quantity: item.quantity || '',
        delivery_status: item.delivery_status || 'Pending',
        delivered_quantity: item.delivered_quantity || '',
        unit: item.unit || 'Piece'
      });
    }
  }, [item]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    
    if (!formData.item_name.trim()) newErrors.item_name = 'Item name is required';
    if (!formData.quantity || Number(formData.quantity) < 0) newErrors.quantity = 'Valid quantity is required';
    if (Number(formData.delivered_quantity) > Number(formData.quantity)) {
      newErrors.delivered_quantity = 'Delivered quantity cannot exceed total quantity';
    }
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      onSave({
        id: item?.id,
        item_name: formData.item_name,
        supplier: formData.supplier,
        quantity: Number(formData.quantity),
        delivery_status: formData.delivery_status,
        delivered_quantity: Number(formData.delivered_quantity) || 0,
        unit: formData.unit
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={(e) => e.target === e.currentTarget && closeModal()}>
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{item ? 'Edit Stock Delivery' : 'Add Stock Delivery'}</h2>
          <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div className="p-6">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Item Name <span className="text-red-500">*</span></label>
              <input type="text" value={formData.item_name} onChange={(e) => setFormData({...formData, item_name: e.target.value})}
                disabled={!!item}
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.item_name ? 'border-red-500' : 'border-gray-300'} ${item ? 'bg-gray-100 cursor-not-allowed' : ''}`}/>
              {errors.item_name && <p className="text-red-500 text-sm mt-1">{errors.item_name}</p>}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Buyer Name</label>
              <input type="text" value={formData.supplier} onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                placeholder="Enter buyer name"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Quantity <span className="text-red-500">*</span></label>
              <input type="number" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} min="0"
                disabled={!!item}
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.quantity ? 'border-red-500' : 'border-gray-300'} ${item ? 'bg-gray-100 cursor-not-allowed' : ''}`}/>
              {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Delivery Status</label>
              <select 
                value={formData.delivery_status} 
                onChange={(e) => setFormData({...formData, delivery_status: e.target.value})}
                disabled={item && item.delivery_status === 'Delivered'}
                className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${item && item.delivery_status === 'Delivered' ? 'bg-gray-100 cursor-not-allowed' : ''}`}>
                <option value="Pending">Pending</option>
                <option value="In Transit">In Transit</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Delivered Quantity</label>
              <input 
                type="number" 
                value={formData.delivered_quantity} 
                onChange={(e) => setFormData({...formData, delivered_quantity: e.target.value})} 
                min="0"
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.delivered_quantity ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.delivered_quantity && <p className="text-red-500 text-sm mt-1">{errors.delivered_quantity}</p>}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Unit</label>
              <input 
                type="text" 
                value="Piece" 
                disabled 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-6">
              <button type="button" onClick={closeModal} className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-[#6C5CE7] text-white rounded-md hover:bg-[#5949D5]">{item ? 'Save Changes' : 'Add Item'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

