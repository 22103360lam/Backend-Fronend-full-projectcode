import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Addsupplier({ closeModal, onSave, initialData }) {
  const [formData, setFormData] = useState({
    supplier: "",
    contact: "",
    material: "",
    quantity: "",
    unit: "pcs",
    status: "Active",
  });

  const [errors, setErrors] = useState({});

  // If editing → auto-fill form
  useEffect(() => {
    if (initialData) {
      setFormData({
        supplier: initialData.supplier,
        contact: initialData.contact_person,
        material: initialData.material,
        quantity: initialData.quantity,
        unit: initialData.unit || "pcs",
        status: initialData.status,
      });
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.supplier.trim()) newErrors.supplier = "Supplier name is required";
    if (!formData.contact.trim()) newErrors.contact = "Email or phone is required";
    else {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phonePattern = /^[\+]?[0-9\-\s\(\)]{7,20}$/;
      if (!emailPattern.test(formData.contact) && !phonePattern.test(formData.contact)) {
        newErrors.contact = "Please enter valid email or phone number";
      }
    }
    if (!formData.material.trim()) newErrors.material = "Material is required";
    if (!formData.quantity) newErrors.quantity = "Quantity is required";
    else if (formData.quantity < 0) newErrors.quantity = "Quantity must be positive";
    if (!formData.unit.trim()) newErrors.unit = "Unit is required";
    if (!formData.status) newErrors.status = "Status is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const dataToSend = {
      supplier: formData.supplier,
      contact_person: formData.contact,
      material: formData.material,
      quantity: formData.quantity,
      unit: formData.unit,
      status: formData.status,
    };

    try {
      let res;
      if (initialData) {
        // Update supplier
        res = await axios.put(`http://localhost:8000/api/suppliers/${initialData.id}`, dataToSend);
      } else {
        // Add supplier
        res = await axios.post("http://localhost:8000/api/suppliers", dataToSend);
      }
      onSave(res.data.supplier);
      closeModal();
    } catch (err) {
      console.error(err.response || err.message);
      alert("Error saving supplier");
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) closeModal();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={handleOverlayClick}>
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{initialData ? 'Edit Supplier' : 'Add New Supplier'}</h2>
          <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div className="p-6 pb-0">
          <form id="supplier-form" className="space-y-5" onSubmit={handleSubmit}>
            {/* Supplier Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Supplier Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="supplier"
                value={formData.supplier}
                onChange={handleInputChange}
                placeholder="Enter supplier name"
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base ${errors.supplier ? 'border-red-500 bg-red-50' : ''}`}
              />
              {errors.supplier && <p className="text-red-500 text-xs mt-1">{errors.supplier}</p>}
            </div>

            {/* Contact */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email or Phone <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleInputChange}
                placeholder="Enter email or phone number"
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base ${errors.contact ? 'border-red-500 bg-red-50' : ''}`}
              />
              {errors.contact && <p className="text-red-500 text-xs mt-1">{errors.contact}</p>}
            </div>

            {/* Material */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Material <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="material"
                value={formData.material}
                onChange={handleInputChange}
                placeholder="Enter material type"
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base ${errors.material ? 'border-red-500 bg-red-50' : ''}`}
              />
              {errors.material && <p className="text-red-500 text-xs mt-1">{errors.material}</p>}
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity <span className="text-red-500">*</span></label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                placeholder="Enter quantity"
                min="0"
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base ${errors.quantity ? 'border-red-500 bg-red-50' : ''}`}
              />
              {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
            </div>

            {/* Unit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit <span className="text-red-500">*</span></label>
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
              {errors.unit && <p className="text-red-500 text-xs mt-1">{errors.unit}</p>}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status <span className="text-red-500">*</span></label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base ${errors.status ? 'border-red-500 bg-red-50' : ''}`}
                required
              >
                <option value="">Select Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
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
            form="supplier-form"
            className="px-4 py-2 bg-[#6C5CE7] text-white rounded-md hover:bg-[#5949D5]"
          >
            {initialData ? 'Update Supplier' : 'Add Supplier'}
          </button>
        </div>
      </div>
    </div>
  );
}
