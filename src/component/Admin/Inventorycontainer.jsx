import React, { useState, useEffect } from 'react';
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
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch inventory on mount
  useEffect(() => {
    fetchInventory();
  }, []);

  // Fetch inventory from API
  const fetchInventory = async () => {
    try {
      const res = await axios.get('/inventory');
      if (Array.isArray(res.data)) {
        setInventory(res.data);
        console.log('Inventory API response:', res.data);
      } else {
        console.error('Unexpected payload:', res.data);
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

  // Save or update inventory
  const handleSave = async (item) => {
    try {
      const payload = {
        item_name: item.name ?? item.item_name ?? '',
        quantity: Number(item.quantity ?? 0),
        minimum_required: Number(item.minimumRequired ?? item.minimum_required ?? 0),
        unit: 'Piece', // static per requirement
        status: item.status ?? 'In Stock',
      };

      if (item.id) {
        await axios.put(`/inventory/${item.id}`, payload);
      } else {
        await axios.post('/inventory', payload);
      }

      await fetchInventory();
      closeModal();
    } catch (error) {
      console.error('Failed to save inventory:', error);
      alert('Save failed — see console.');
    }
  };

  // Delete inventory
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      await axios.delete(`/inventory/${id}`);
      setInventory(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Failed to delete inventory:', error);
    }
  };

  // Save a production-derived row into inventories
  const handleSaveFromProduction = async (prodItem) => {
    try {
      // If the production row includes a batch_id, call server-side converter endpoint
      if (prodItem.batch_id) {
        await axios.post(`/productions/${prodItem.batch_id}/to-inventory`);
      } else {
        const payload = {
          item_name: prodItem.item_name ?? prodItem.task ?? '',
          quantity: Number(parseInt((prodItem.quantity ?? '').toString().replace(/[^0-9]/g, '')) || 0),
          minimum_required: 0,
          unit: prodItem.unit ?? 'Piece',
          status: prodItem.status ?? 'In Stock',
        };
        await axios.post('/inventory', payload);
      }

      await fetchInventory();
      alert('Saved production item to inventory');
    } catch (error) {
      console.error('Failed to save production item to inventory:', error);
      alert('Failed to save production item — see console.');
    }
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = inventory.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(inventory.length / itemsPerPage);

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
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-3 text-center">No inventory found</td>
                </tr>
              ) : currentItems.map((item, idx) => (
                <tr key={`${item.id ?? 'noid'}-${(item.item_name ?? 'item').toString().replace(/\s+/g,'_')}-${idx}`} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-3 whitespace-nowrap">{item.item_name}</td>
                  <td className="px-6 py-3 whitespace-nowrap">{item.quantity}</td>
                  <td className="px-6 py-3 whitespace-nowrap">{item.minimum_required ?? item.minimumRequired ?? '-'}</td>
                  <td className="px-6 py-3 whitespace-nowrap">Piece</td>
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
                      {/* If this row comes from production (no inventory id), show Save button */}
                      {(!item.id || item.source === 'production') ? (
                        <button onClick={() => handleSaveFromProduction(item)} className="px-3 py-1 bg-green-100 text-green-800 rounded-md text-sm">
                          Save
                        </button>
                      ) : (
                        <>
                          <button onClick={() => openModal(item)} className="p-1 rounded-full hover:bg-blue-50">
                            <img src="asset/edit.png" alt="Edit" className="w-4 h-4"/>
                          </button>
                          <button onClick={() => handleDelete(item.id)} className="p-1 rounded-full hover:bg-red-50">
                            <img src="asset/delete.png" alt="Delete" className="w-4 h-4"/>
                          </button>
                        </>
                      )}
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
      </section>
    </div>
  );
}
