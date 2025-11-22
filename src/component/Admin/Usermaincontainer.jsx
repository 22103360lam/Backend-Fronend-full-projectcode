import React, { useState } from "react";
import Usermanagecontainer from "../Adminpages/Usermanagecontainer";

export default function Usermaincontainer() {
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const [users, setUsers] = useState([
    { id: "001", fullName: "Shamiul REZA Lam", emailOrPhone: "samiul@gmail.com", role: "Admin", department: "Management", status: "Active", lastActive: "2 minutes ago", password: "123456" },
    { id: "002", fullName: "Salman Rahman", emailOrPhone: "salman@example.com", role: "Manager", department: "Production", status: "Active", lastActive: "10 minutes ago", password: "abcd1234" },
    { id: "003", fullName: "Ahmed Hassan", emailOrPhone: "ahmed@company.com", role: "Staff", department: "Quality Control", status: "Active", lastActive: "1 hour ago", password: "pass123" },
    { id: "004", fullName: "Fatima Khan", emailOrPhone: "fatima@example.com", role: "Manager", department: "HR", status: "Inactive", lastActive: "2 days ago", password: "secure456" },
    { id: "005", fullName: "Omar Ali", emailOrPhone: "omar@company.com", role: "Staff", department: "Production", status: "Active", lastActive: "30 minutes ago", password: "mypass789" },
    { id: "006", fullName: "Nadia Ahmed", emailOrPhone: "nadia@example.com", role: "Admin", department: "IT", status: "Active", lastActive: "5 minutes ago", password: "admin2024" },
    { id: "007", fullName: "Karim Uddin", emailOrPhone: "karim@company.com", role: "Staff", department: "Warehouse", status: "Active", lastActive: "1 hour ago", password: "warehouse123" },
    { id: "008", fullName: "Rashida Begum", emailOrPhone: "rashida@example.com", role: "Manager", department: "Finance", status: "Active", lastActive: "15 minutes ago", password: "finance2024" },
  ]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser).map(u => ({ ...u }));
  const goToPage = (p) => setCurrentPage(p);

  const openModal = (user = null) => {
    setEditUser(user);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setEditUser(null);
  };
  // handle delete
  const handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(prev => prev.filter(u => u.id !== userId));
    }
  };
 // Summary counts
  const totalUsers = users.length;
  const totalAdmins = users.filter(u => u.role === "Admin").length;
  const departmentsCount = [...new Set(users.map(u => u.department))].length;

  return (
    <div>
      <section className="p-4 md:p-6 bg-[#eff1f9] min-h-screen">
        {/* Header */}
        <div className="flex justify-between mb-4">
          <h1 className="text-3xl font-semibold text-gray-900">User Management</h1>
          <button
            onClick={() => openModal()}
            className="bg-[#6C5CE7] hover:bg-[#5949D5] text-white font-semibold py-2 px-4 rounded-md flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 4v16m8-8H4" />
            </svg>
            <span>Add User</span>
          </button>
        </div>
        <p className="text-gray-600 text-base mb-6">Manage users, assign roles, and reset passwords.</p>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div className="relative overflow-hidden rounded-lg p-6 bg-white shadow-md border-l-8 text-gray-800" style={{ borderColor: "#7db5fe" }}>
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-lg font-medium uppercase mb-1" style={{ color: "#7db5fe" }}>Total Users</p>
                <p className="text-4xl font-bold">{totalUsers}</p>
              </div>
              <img src="asset/users-svgrepo-com.svg" className="h-12 w-12 opacity-80" />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-lg p-6 bg-white shadow-md border-l-8 text-gray-800" style={{ borderColor: "#6C5CE7" }}>
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-lg font-medium uppercase mb-1" style={{ color: "#6C5CE7" }}>Administrators</p>
                <p className="text-4xl font-bold">{totalAdmins}</p>
              </div>
              <img src="asset/shield-user-svgrepo-com.svg" className="h-12 w-12 opacity-80" />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-lg p-6 bg-white shadow-md border-l-8 text-gray-800" style={{ borderColor: "#fc7a30" }}>
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-lg font-medium uppercase mb-1" style={{ color: "#fc7a30" }}>Departments</p>
                <p className="text-4xl font-bold">{departmentsCount}</p>
              </div>
              <img src="asset/building-svgrepo-com.svg" className="h-12 w-12 opacity-80" />
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
              {currentUsers.map((user, index) => (
                <tr key={user.id + user.lastActive} className="hover:bg-gray-50">
                  <td className="px-6 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-7 h-7 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mr-3 font-semibold text-sm">
                        {indexOfFirstUser + index + 1}
                      </div>
                      <div>
                        <p className="text-base font-medium text-gray-900">{user.fullName}</p>
                        <p className="text-sm text-gray-500">{user.emailOrPhone}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-3 text-gray-500">{user.role}</td>
                  <td className="px-6 py-3 text-gray-500">{user.department}</td>
                  <td className="px-6 py-3 text-gray-500">{"•".repeat(user.password?.length || 0)}</td>

                  <td className="px-6 py-3 whitespace-nowrap text-base font-medium text-right">
                    <div className="inline-flex items-center gap-2">
                      <button onClick={() => openModal(user)} className="p-1 rounded-full hover:bg-blue-50">
                        <img src="asset/edit.png" className="w-4 h-4" alt="Edit" />
                      </button>

                      <button onClick={() => handleDeleteUser(user.id)} className="p-1 rounded-full hover:bg-red-50">
                        <img src="asset/delete.png" className="w-4 h-4" alt="Delete" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 border border-gray-300 rounded-md text-base hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => goToPage(i + 1)}
              className={`px-3 py-2 rounded-md text-base ${currentPage === i + 1 ? "bg-[#6C5CE7] text-white" : "border border-gray-300 hover:bg-gray-50"}`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 border border-gray-300 rounded-md text-base hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </section>

      {/* Modal */}
      {showModal && (
        <Usermanagecontainer
          key={editUser ? editUser.id : "new"}
          closeModal={closeModal}
          initialData={editUser ? { ...editUser } : null}
          onSave={(data) => {
            if (editUser) {
              setUsers(prev => prev.map(u => u.id === editUser.id ? { ...u, ...data, lastActive: "Just now" } : u));
            } else {
              const newUser = { ...data, id: Date.now().toString(), status: "Active", lastActive: "Just now" };
              setUsers(prev => [...prev, newUser]);
            }
            setCurrentPage(1);
            closeModal();
          }}
        />
      )}
    </div>
  );
}
