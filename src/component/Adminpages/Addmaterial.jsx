import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AddMaterial({ closeModal, initialData = null, onSave }) {
  const [formData, setFormData] = useState({
    material_name: '',
    quantity: '',
    min_required: '',
    supplier: '',
    status: '',
    unit: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        material_name: initialData.material_name || '',
        quantity: initialData.quantity || '',
        min_required: initialData.min_required || '',
        supplier: initialData.supplier || '',
        status: initialData.status || '',
        unit: initialData.unit || ''
      });
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.material_name.trim()) newErrors.material_name = 'Material name is required';
    if (!formData.quantity) newErrors.quantity = 'Stock quantity is required';
    if (!formData.min_required) newErrors.min_required = 'Minimum required is required';
    if (!formData.supplier.trim()) newErrors.supplier = 'Supplier is required';
    if (!formData.status) newErrors.status = 'Status is required';
    if (!formData.unit.trim()) newErrors.unit = 'Unit is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const payload = {
        ...formData,
        quantity: Number(formData.quantity),
        min_required: Number(formData.min_required)
      };

      let response;
      if (initialData) {
        response = await axios.put(`http://127.0.0.1:8000/api/raw-materials/${initialData.id}`, payload);
      } else {
        response = await axios.post('http://127.0.0.1:8000/api/raw-materials', payload);
      }

      onSave(response.data.material); // Important: send material object directly
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error saving material");
    } finally {
      setLoading(false);
      closeModal();
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) closeModal();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={handleOverlayClick}>
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{initialData ? 'Edit Material' : 'Add New Material'}</h2>
          <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div className="p-6 pb-0">
          <form id="material-form" className="space-y-5" onSubmit={handleSubmit}>
            {["material_name","quantity","min_required","supplier","unit"].map(field => (
              <div key={field} className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.replace("_"," ").replace(/\b\w/g, l => l.toUpperCase())} <span className="text-red-500">*</span>
                </label>

                {field === "unit" ? (
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base ${errors.unit ? 'border-red-500 bg-red-50' : ''}`}
                    required
                  >
                    <option value="">Select Unit</option>
                    <option value="Kg">Kg</option>
                    <option value="Yard">Yard</option>
                    <option value="Meter">Meter</option>
                    <option value="Dozen">Dozen</option>
                    <option value="Gross">Gross</option>
                    <option value="Piece">Piece</option>
                  </select>
                ) : (
                  <input
                    type={field === "quantity" || field === "min_required" ? "number" : "text"}
                    name={field}
                    value={formData[field]}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base ${errors[field] ? 'border-red-500 bg-red-50' : ''}`}
                  />
                )}

                {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
              </div>
            ))}

            {/* Status */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base ${errors.status ? 'border-red-500 bg-red-50' : ''}`}
                required
              >
                <option value="">Select Status</option>
                <option value="Low Stock">Low Stock</option>
                <option value="In Stock">In Stock</option>
              </select>
              {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status}</p>}
            </div>
          </form>
        </div>

        <div className="sticky bottom-0 left-0 bg-white px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={closeModal}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="material-form"
            disabled={loading}
            className="px-4 py-2 bg-[#6C5CE7] text-white rounded-md hover:bg-[#5949D5]"
          >
            {initialData ? 'Update Material' : 'Add Material'}
          </button>
        </div>
      </div>
    </div>
  );
}
