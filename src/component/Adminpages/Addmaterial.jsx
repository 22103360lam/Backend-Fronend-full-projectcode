import React, { useState, useEffect } from 'react';


export default function Addmaterial({ closeModal, initialData = null, onSave }) 
{
 const [formData, setFormData] = useState({
  materialName: '',
  stockQuantity: '',
  minimumRequired: '',
  supplier: '',
  status: ''
});

useEffect(() => {
  if (initialData) {
    setFormData({
      materialName: initialData.name || '',
      stockQuantity: initialData.stock || '',
      minimumRequired: initialData.minRequired || '',
      supplier: initialData.supplier || '',
      status: initialData.status || ''
    });
  } else {
    setFormData({
      materialName: '',
      stockQuantity: '',
      minimumRequired: '',
      supplier: '',
      status: ''
    });
  }
}, [initialData]);



  const [errors, setErrors] = useState({});

  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.materialName.trim()) {
      newErrors.materialName = 'Material name is required';
    }

    if (!formData.stockQuantity) {
      newErrors.stockQuantity = 'Stock quantity is required';
    } else if (formData.stockQuantity < 0) {
      newErrors.stockQuantity = 'Stock quantity must be positive';
    }

    if (!formData.minimumRequired) {
      newErrors.minimumRequired = 'Minimum required is required';
    } else if (formData.minimumRequired < 0) {
      newErrors.minimumRequired = 'Minimum required must be positive';
    }

    if (!formData.supplier.trim()) {
      newErrors.supplier = 'Supplier is required';
    }

    if (!formData.status) {
      newErrors.status = 'Status is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
  e.preventDefault();

  if (validateForm()) {
    // Send data to parent
    onSave({
      name: formData.materialName,
      stock: Number(formData.stockQuantity),
      minRequired: Number(formData.minimumRequired),
      supplier: formData.supplier,
      status: formData.status
    });

    // Reset form
    setFormData({
      materialName: '',
      stockQuantity: '',
      minimumRequired: '',
      supplier: '',
      status: ''
    });

    // Close modal
    closeModal();
  }
};


  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };



  return (
    <div>
      {/* Modal Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={handleOverlayClick}
      >
        {/* Modal Container */}
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
          
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
          {initialData ? 'Edit Material' : 'Add New Material'}
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

          {/* Modal Body - Form */}
          <div className="p-6">
            <form 
              className="space-y-4" 
              onSubmit={handleSubmit}
            >
              
              {/* Material Name */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Material Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="materialName"
                  value={formData.materialName}
                  onChange={handleInputChange}
                  placeholder="Enter material name" 
                  required
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.materialName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {errors.materialName && (
                  <p className="text-red-500 text-sm mt-1">{errors.materialName}</p>
                )}
              </div>

              {/* Stock Quantity */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Stock Quantity <span className="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  name="stockQuantity"
                  value={formData.stockQuantity}
                  onChange={handleInputChange}
                  placeholder="Enter stock quantity" 
                  min="0"
                  required
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.stockQuantity ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {errors.stockQuantity && (
                  <p className="text-red-500 text-sm mt-1">{errors.stockQuantity}</p>
                )}
              </div>

              {/* Minimum Required */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Minimum Required <span className="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  name="minimumRequired"
                  value={formData.minimumRequired}
                  onChange={handleInputChange}
                  placeholder="Enter minimum required quantity" 
                  min="0"
                  required
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.minimumRequired ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {errors.minimumRequired && (
                  <p className="text-red-500 text-sm mt-1">{errors.minimumRequired}</p>
                )}
              </div>

              {/* Supplier */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Supplier <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleInputChange}
                  placeholder="Enter supplier name" 
                  required
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.supplier ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {errors.supplier && (
                  <p className="text-red-500 text-sm mt-1">{errors.supplier}</p>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Status <span className="text-red-500">*</span>
                </label>
                <select 
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.status ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Status</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
                {errors.status && (
                  <p className="text-red-500 text-sm mt-1">{errors.status}</p>
                )}
              </div>

              {/* Modal Footer - Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-6">
                <button 
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                {/* submit  */}
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                   {initialData ? 'Update Material' : 'Add Material'}
               </button>


              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
