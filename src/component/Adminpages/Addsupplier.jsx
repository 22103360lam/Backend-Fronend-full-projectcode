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
    <div>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={handleOverlayClick}
      >
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {initialData ? "Edit Supplier" : "Add New Supplier"}
            </h2>
            <button
              onClick={closeModal}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div className="p-6">
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Supplier Name */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Supplier Name *</label>
                <input
                  type="text"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleInputChange}
                  placeholder="Enter supplier name"
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.supplier ? "border-red-500 bg-red-50" : "border-gray-300"
                  }`}
                />
                {errors.supplier && <p className="text-red-500 text-sm mt-1">{errors.supplier}</p>}
              </div>

              {/* Contact */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Email or Phone *</label>
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  placeholder="Enter email or phone number"
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.contact ? "border-red-500 bg-red-50" : "border-gray-300"
                  }`}
                />
                {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact}</p>}
              </div>

              {/* Material */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Material *</label>
                <input
                  type="text"
                  name="material"
                  value={formData.material}
                  onChange={handleInputChange}
                  placeholder="Enter material type"
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.material ? "border-red-500 bg-red-50" : "border-gray-300"
                  }`}
                />
                {errors.material && <p className="text-red-500 text-sm mt-1">{errors.material}</p>}
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Quantity *</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  placeholder="Enter quantity"
                  min="0"
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.quantity ? "border-red-500 bg-red-50" : "border-gray-300"
                  }`}
                />
                {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
              </div>

              {/* Unit */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Unit *</label>
                <input
                  type="text"
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  placeholder="Enter unit (e.g., pcs, kg)"
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.unit ? "border-red-500 bg-red-50" : "border-gray-300"
                  }`}
                />
                {errors.unit && <p className="text-red-500 text-sm mt-1">{errors.unit}</p>}
              </div>

              {/* Status */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Status *</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.status ? "border-red-500 bg-red-50" : "border-gray-300"
                  }`}
                >
                  <option value="">Select Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Pending">Pending</option>
                </select>
                {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {initialData ? "Update Supplier" : "Add Supplier"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
