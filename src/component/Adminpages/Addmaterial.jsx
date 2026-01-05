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
  const [supplierList, setSupplierList] = useState([]);

  // Load suppliers from API
  useEffect(() => {
    const loadSuppliers = async () => {
      try {
        // unify with Suppliercontainer endpoint
        const res = await axios.get('http://localhost:8000/api/suppliers')
        const list = Array.isArray(res.data) ? res.data : res.data?.data ?? res.data?.suppliers ?? []
        setSupplierList(list)
      } catch (e) {
        console.error('Failed to load suppliers', e)
        setSupplierList([])
      }
    }
    loadSuppliers()
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        material_name: initialData.material_name || '',
        quantity: initialData.quantity || '',
        min_required: initialData.min_required || '',
        supplier: initialData.supplier || '', // name or id string
        status: initialData.status || '',
        unit: initialData.unit || ''
      });
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target
    // prevent negatives for numeric fields
    let v = value
    if (name === 'quantity' || name === 'min_required') {
      if (v !== '') {
        const n = Number(v)
        v = String(Math.max(0, isNaN(n) ? 0 : n))
      }
    }
    setFormData(prev => ({ ...prev, [name]: v }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  };

  const validateForm = () => {
    const newErrors = {}
    if (!formData.material_name.trim()) newErrors.material_name = 'Material name is required'
    const q = Number(formData.quantity)
    if (formData.quantity === '' || isNaN(q) || q < 0) newErrors.quantity = 'Stock quantity must be 0 or greater'
    const mr = Number(formData.min_required)
    if (formData.min_required === '' || isNaN(mr) || mr < 0) newErrors.min_required = 'Minimum required must be 0 or greater'
    if (!formData.supplier) newErrors.supplier = 'Supplier is required'
    if (!formData.status) newErrors.status = 'Status is required'
    if (!formData.unit.trim()) newErrors.unit = 'Unit is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      setLoading(true)

      // normalize payload to match API — include both common keys ('quantity') and 'stock_quantity'
      const qty = Math.max(0, Number(formData.quantity))
      const minReq = Math.max(0, Number(formData.min_required))
      const payload = {
        material_name: formData.material_name,
        // include both names so server accepts whichever it expects
        quantity: qty,
        stock_quantity: qty,
        min_required: minReq,
        unit: formData.unit,
        supplier: formData.supplier,
        status: formData.status
      }

      let response
      if (initialData) {
        // editing existing item — send normalized payload
        response = await axios.put(`http://127.0.0.1:8000/api/raw-materials/${initialData.id}`, payload)
      } else {
        // try to merge with existing material (by name)
        const listRes = await axios.get('http://127.0.0.1:8000/api/raw-materials')
        const list = Array.isArray(listRes.data) ? listRes.data : listRes.data?.data ?? []
        const existing = list.find(m =>
          String(m.material_name ?? m.name ?? '').trim().toLowerCase() === String(payload.material_name).trim().toLowerCase()
        )

        if (existing) {
          const existingStock = Number(existing.stock_quantity ?? existing.quantity ?? existing.stock ?? 0)
          const newStock = existingStock + qty
          const updatePayload = {
            ...existing,
            material_name: existing.material_name ?? payload.material_name,
            quantity: newStock,
            stock_quantity: newStock,
            min_required: minReq,
            unit: payload.unit,
            supplier: payload.supplier,
            status: payload.status
          }
          response = await axios.put(`http://127.0.0.1:8000/api/raw-materials/${existing.id}`, updatePayload)
        } else {
          response = await axios.post('http://127.0.0.1:8000/api/raw-materials', payload)
        }
      }

      onSave(response.data.material ?? response.data)
      
      // Dispatch event to notify other components (e.g., dashboard)
      window.dispatchEvent(new Event('material-updated'))
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.message || 'Error saving material')
    } finally {
      setLoading(false)
      closeModal()
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
                ) : field === "supplier" ? (
                  <select
                    name="supplier"
                    value={formData.supplier}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base ${errors.supplier ? 'border-red-500 bg-red-50' : ''}`}
                    required
                  >
                    <option value="">
                      {supplierList.length ? 'Select Supplier' : 'No suppliers found'}
                    </option>
                    {supplierList.map((s) => {
                      // match Suppliercontainer fields
                      const label = s.supplier ?? s.supplier_name ?? s.name ?? s.company_name ?? `Supplier #${s.id ?? ''}`
                      return (
                        <option key={s.id ?? label} value={label}>
                          {label}
                        </option>
                      )
                    })}
                  </select>
                ) : (
                  <input
                    type={field === "quantity" || field === "min_required" ? "number" : "text"}
                    // enforce non-negative on the input element too
                    {...(field === "quantity" || field === "min_required" ? { min: 0, step: 1 } : {})}
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
          <button type="button" onClick={closeModal} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">
            Cancel
          </button>
          <button type="submit" form="material-form" disabled={loading} className="px-4 py-2 bg-[#6C5CE7] text-white rounded-md hover:bg-[#5949D5]">
            {initialData ? 'Update Material' : 'Add Material'}
          </button>
        </div>
      </div>
    </div>
  );
}
