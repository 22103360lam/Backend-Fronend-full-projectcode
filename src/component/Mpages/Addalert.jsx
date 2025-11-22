import React, { useState } from 'react'

export default function Addalert({ closeModal, addAlert }) {

  // Form state 
  const [formData, setFormData] = useState({
    alertType: '',
    priority: '',
    relatedItem: '',
    assignTo: '',
    dueDate: '',
    message: ''
  })


  // Error state
  const [errors, setErrors] = useState({})


  // Input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    // Clear error on input
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

 
  // Validate form before submissio
  const validateForm = () => {
    const newErrors = {}
    if (!formData.alertType.trim()) newErrors.alertType = 'Alert type is required'
    if (!formData.priority) newErrors.priority = 'Priority is required'
    if (!formData.message.trim()) newErrors.message = 'Alert message is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }


  // Submit handler
 
  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      // Pass the new alert to parent
      addAlert(formData)

      // Reset form
      setFormData({
        alertType: '',
        priority: '',
        relatedItem: '',
        assignTo: '',
        dueDate: '',
        message: ''
      })

      closeModal()
    }
  }

  // ==========================
  // Close modal if overlay clicked
  // ==========================
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) closeModal()
  }

  // ==========================
  // JSX
  // ==========================
  return (
    <div>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={handleOverlayClick}
      >
        {/* Modal */}
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Add New Alert</h2>
            <button
              onClick={closeModal}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          {/* Form */}
          <div className="p-6">
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Alert Type */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Alert Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="alertType"
                  value={formData.alertType}
                  onChange={handleInputChange}
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.alertType ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select alert type</option>
                  <option value="low-stock">Low Stock</option>
                  <option value="deadline">Task Deadline</option>
                  <option value="maintenance">Scheduled Maintenance</option>
                  <option value="quality">Quality Issue</option>
                  <option value="production">Production Target</option>
                  <option value="delivery">Delivery Delay</option>
                  <option value="other">Other</option>
                </select>
                {errors.alertType && <p className="text-red-500 text-sm mt-1">{errors.alertType}</p>}
              </div>

              {/* Priority */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Priority Level <span className="text-red-500">*</span>
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.priority ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select priority</option>
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                  <option value="critical">Critical</option>
                </select>
                {errors.priority && <p className="text-red-500 text-sm mt-1">{errors.priority}</p>}
              </div>

              {/* Related Item */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Related Item/Batch</label>
                <input
                  type="text"
                  name="relatedItem"
                  value={formData.relatedItem}
                  onChange={handleInputChange}
                  placeholder="e.g., Batch #1234, Cotton Fabric, Machine #5"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                />
              </div>

              {/* Assign To */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Assign To</label>
                <select
                  name="assignTo"
                  value={formData.assignTo}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  <option value="">Select user (optional)</option>
                  <option value="john-smith">John Smith</option>
                  <option value="sarah-johnson">Sarah Johnson</option>
                  <option value="mike-davis">Mike Davis</option>
                  <option value="emma-wilson">Emma Wilson</option>
                </select>
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                />
              </div>

              {/* Alert Message */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Alert Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Describe the alert details and any necessary actions..."
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.message ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                ></textarea>
                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
              </div>

              {/* Footer buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-black bg-gray-100 rounded-lg hover:bg-[#6C5CE7] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#6C5CE7] hover:bg-[#5949D5] text-white rounded-lg transition-colors"
                >
                  Create Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
