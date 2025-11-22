import React, { useState, useEffect } from 'react'

export default function Addinventory({ closeModal, item, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    minimumRequired: '',
    status: ''
  })

  const [errors, setErrors] = useState({})

  // Row info load korar jonno
  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        quantity: item.quantity || '',
        minimumRequired: item.minimumRequired || '',
        status: item.status || ''
      })
    }
  }, [item])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Item name is required'
    if (!formData.quantity) newErrors.quantity = 'Quantity is required'
    else if (formData.quantity < 1) newErrors.quantity = 'Quantity must be positive'
    if (!formData.minimumRequired) newErrors.minimumRequired = 'Minimum required is required'
    else if (formData.minimumRequired < 1) newErrors.minimumRequired = 'Minimum required must be positive'
    if (!formData.status) newErrors.status = 'Status is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onSave(formData) // <-- parent component e data pathacche
      closeModal()
    }
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) closeModal()
  }

  return (
    <div>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={handleOverlayClick}>
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
          
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">{item ? 'Edit Inventory' : 'Add New Inventory'}</h2>
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
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter item name" 
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}/>
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Quantity <span className="text-red-500">*</span></label>
                <input type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} min="1"
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.quantity ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}/>
                {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Minimum Required <span className="text-red-500">*</span></label>
                <input type="number" name="minimumRequired" value={formData.minimumRequired} onChange={handleInputChange} min="1"
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.minimumRequired ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}/>
                {errors.minimumRequired && <p className="text-red-500 text-sm mt-1">{errors.minimumRequired}</p>}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Status <span className="text-red-500">*</span></label>
                <select name="status" value={formData.status} onChange={handleInputChange}
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.status ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}>
                  <option value="">Select Status</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="In Stock">In Stock</option>
                </select>
                {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-6">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">{item ? 'Save Changes' : 'Add Item'}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
