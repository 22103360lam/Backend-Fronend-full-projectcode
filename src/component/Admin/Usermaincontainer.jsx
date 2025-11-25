import React, { useState, useEffect } from "react";
import axios from "axios";
import UserManageContainer from "../Adminpages/Usermanagecontainer.jsx";

export default function UserMainContainer() {
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/users");
        const mappedUsers = res.data.map(u => ({
          id: u.id,
          fullName: u.name,
          emailOrPhone: u.email || u.phone || "-",
          role: u.role,
          department: u.department || "-",
          status: "Active",
          lastActive: "Just now",
          password: "********" // hide password
        }));
        setUsers(mappedUsers);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const openModal = (user = null) => {
    setEditUser(user);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditUser(null);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/users/${userId}`);
        setUsers(prev => prev.filter(u => u.id !== userId));
      } catch (err) {
        console.error(err.response?.data || err.message);
        alert(err.response?.data?.message || "Error deleting user");
      }
    }
  };

  const handleSaveUser = (newOrUpdatedUser) => {
    const exists = users.find(u => u.id === newOrUpdatedUser.id);
    if (exists) {
      setUsers(prev => prev.map(u => u.id === newOrUpdatedUser.id ? newOrUpdatedUser : u));
    } else {
      setUsers(prev => [...prev, newOrUpdatedUser]);
    }
  };

  if (loading) return <p>Loading users...</p>;

  // Summary counts
  const totalUsers = users.length;
  const totalAdmins = users.filter(u => u.role === "Admin").length;
  const departmentsCount = [...new Set(users.map(u => u.department))].length;

  return (
    <div className="p-4 md:p-6 bg-[#eff1f9] min-h-screen">
      {/* Header */}
      <div className="flex justify-between mb-4">
        <h1 className="text-3xl font-semibold text-gray-900">User Management</h1>
        <button
          onClick={() => openModal()}
          className="bg-[#6C5CE7] hover:bg-[#5949D5] text-white font-semibold py-2 px-4 rounded-md flex items-center space-x-2"
        >
          Add User
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="relative overflow-hidden rounded-lg p-6 bg-white shadow-md border-l-8 text-gray-800" style={{ borderColor: "#7db5fe" }}>
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-lg font-medium uppercase mb-1" style={{ color: "#7db5fe" }}>Total Users</p>
              <p className="text-4xl font-bold">{totalUsers}</p>
            </div>
            <img src="asset/users-svgrepo-com.svg" className="h-12 w-12 opacity-80" alt="Users" />
          </div>
        </div>

        <div className="relative overflow-hidden rounded-lg p-6 bg-white shadow-md border-l-8 text-gray-800" style={{ borderColor: "#6C5CE7" }}>
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-lg font-medium uppercase mb-1" style={{ color: "#6C5CE7" }}>Administrators</p>
              <p className="text-4xl font-bold">{totalAdmins}</p>
            </div>
            <img src="asset/shield-user-svgrepo-com.svg" className="h-12 w-12 opacity-80" alt="Admins" />
          </div>
        </div>

        <div className="relative overflow-hidden rounded-lg p-6 bg-white shadow-md border-l-8 text-gray-800" style={{ borderColor: "#fc7a30" }}>
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-lg font-medium uppercase mb-1" style={{ color: "#fc7a30" }}>Departments</p>
              <p className="text-4xl font-bold">{departmentsCount}</p>
            </div>
            <img src="asset/building-svgrepo-com.svg" className="h-12 w-12 opacity-80" alt="Departments" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-base">
          <thead className="text-white" style={{ background: "linear-gradient(135deg, #8E7DFF, #6C5CE7)" }}>
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Department</th>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Password</th>
              <th className="px-6 py-3 text-right text-sm font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-3 whitespace-nowrap">
                  <p className="text-base font-medium text-gray-900">{user.fullName}</p>
                  <p className="text-sm text-gray-500">{user.emailOrPhone}</p>
                </td>
                <td className="px-6 py-3 text-gray-500">{user.role}</td>
                <td className="px-6 py-3 text-gray-500">{user.department || '-'}</td>
                <td className="px-6 py-3 text-gray-500">{user.password}</td>
                <td className="px-6 py-3 whitespace-nowrap text-right">
                  <button onClick={() => openModal(user)} className="p-1 rounded-full hover:bg-blue-50 mr-2">
                    <img src="asset/edit.png" className="w-4 h-4" alt="Edit" />
                  </button>
                  <button onClick={() => handleDeleteUser(user.id)} className="p-1 rounded-full hover:bg-red-50">
                    <img src="asset/delete.png" className="w-4 h-4" alt="Delete" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <UserManageContainer
          key={editUser ? editUser.id : "new"}
          closeModal={closeModal}
          initialData={editUser}
          onSave={handleSaveUser}
        />
      )}
    </div>
  );
}
