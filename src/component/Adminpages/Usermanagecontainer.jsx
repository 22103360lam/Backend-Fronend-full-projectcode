import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function UserManageContainer({ closeModal, initialData, onSave }) {
  const [formData, setFormData] = useState({
    id: '',
    fullName: '',
    emailOrPhone: '',
    role: '',
    department: '',
    password: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id || '',
        fullName: initialData.fullName || '',
        emailOrPhone: initialData.emailOrPhone || '',
        role: initialData.role || 'Staff',
        department: initialData.department || '',
        password: '' // blank for security
      });
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        name: formData.fullName,
        email: formData.emailOrPhone.includes('@') ? formData.emailOrPhone : null,
        phone: !formData.emailOrPhone.includes('@') ? formData.emailOrPhone : null,
        role: formData.role,
        department: formData.department,
        ...(formData.password ? { password: formData.password } : {}) // only send password if filled
      };

      const response = initialData
        ? await axios.put(`http://127.0.0.1:8000/api/users/${initialData.id}`, payload)
        : await axios.post("http://127.0.0.1:8000/api/users", payload);

      alert(response.data.message);

      const userForTable = {
        id: response.data.user.id,
        fullName: response.data.user.name,
        emailOrPhone: response.data.user.email || response.data.user.phone,
        role: response.data.user.role,
        department: response.data.user.department || formData.department,
        status: "Active",
        lastActive: "Just now",
        password: '********'
      };

      onSave(userForTable);
      closeModal();
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert(error.response?.data?.message || "Error saving user");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-semibold mb-4">
          {initialData ? 'Edit User' : 'Add User'}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter full name"
              required
            />
          </div>

          {/* Email/Phone */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email or Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.emailOrPhone}
              onChange={(e) => setFormData({ ...formData, emailOrPhone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email or phone"
              required
            />
          </div>

          {/* Role */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="" disabled>
                Role
              </option>
              <option value="Staff">Staff</option>
              <option value="Manager">Manager</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          {/* Department */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="" disabled>
                Select department
              </option>
              <option value="Production">Production</option>
              <option value="Quality Control">Quality Control</option>
              <option value="Management">Management</option>
              <option value="Administration">Administration</option>
            </select>
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password {initialData ? "(leave blank to keep current)" : <span className="text-red-500">*</span>}
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password"
              minLength={initialData ? 0 : 8}
              required={!initialData}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#6C5CE7] text-white rounded-md hover:bg-[#5949D5]"
            >
              {initialData ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
