import React, { useState } from 'react';

export default function Productioncontainer() {
  // ===== State =====
  const [batches, setBatches] = useState([
    { id: '#1234', name: 'Shirts - Blue', date: '2025-11-01' },
    { id: '#1235', name: 'Pants - Black', date: '2025-11-02' }
  ]);

  const [tasks, setTasks] = useState([
    { id: 1, batch: "B001", task: "Cutting Fabric", quantity: 100, material: "Cotton", materialQuantity: 50, assignedTo: "John Doe", assignDate: "2024-11-01", status: "On Track", dueDate: "2024-11-10" },
    { id: 2, batch: "B002", task: "Sewing", quantity: 80, material: "Polyester", materialQuantity: 40, assignedTo: "Jane Smith", assignDate: "2024-11-02", status: "In Progress", dueDate: "2024-11-12" },
    { id: 3, batch: "B003", task: "Quality Check", quantity: 120, material: "Silk", materialQuantity: 60, assignedTo: "Mike Johnson", assignDate: "2024-11-03", status: "Delayed", dueDate: "2024-11-15" },
    { id: 4, batch: "B004", task: "Packaging", quantity: 200, material: "Cardboard", materialQuantity: 100, assignedTo: "Sarah Wilson", assignDate: "2024-11-04", status: "On Track", dueDate: "2024-11-18" },
    { id: 5, batch: "B005", task: "Printing Design", quantity: 150, material: "Canvas", materialQuantity: 75, assignedTo: "David Brown", assignDate: "2024-11-05", status: "In Progress", dueDate: "2024-11-20" },
    { id: 6, batch: "B006", task: "Button Attachment", quantity: 90, material: "Buttons", materialQuantity: 180, assignedTo: "Lisa Garcia", assignDate: "2024-11-06", status: "On Track", dueDate: "2024-11-22" },
    { id: 7, batch: "B007", task: "Ironing", quantity: 110, material: "Iron", materialQuantity: 10, assignedTo: "Sam Lee", assignDate: "2024-11-07", status: "On Track", dueDate: "2024-11-23" },
    { id: 8, batch: "B008", task: "Folding", quantity: 130, material: "None", materialQuantity: 0, assignedTo: "Anna Kim", assignDate: "2024-11-08", status: "In Progress", dueDate: "2024-11-24" },
    { id: 9, batch: "B009", task: "Packing", quantity: 140, material: "Box", materialQuantity: 70, assignedTo: "Tom Hanks", assignDate: "2024-11-09", status: "Delayed", dueDate: "2024-11-25" },
    { id: 10, batch: "B010", task: "Shipping", quantity: 160, material: "Truck", materialQuantity: 1, assignedTo: "Jerry Rice", assignDate: "2024-11-10", status: "On Track", dueDate: "2024-11-26" },
    { id: 11, batch: "B011", task: "Receiving", quantity: 170, material: "Dock", materialQuantity: 1, assignedTo: "Mia Wong", assignDate: "2024-11-11", status: "On Track", dueDate: "2024-11-27" }
  ]);

  // ===== Pagination =====
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Show 10 rows per page
  const totalPages = Math.ceil(tasks.length / itemsPerPage);
  if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTasks = tasks.slice(indexOfFirstItem, indexOfLastItem);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="p-4 md:p-6 bg-[#eff1f9] space-y-6 min-h-screen">
      <h1 className="text-2xl font-bold text-[#000000]">Production Planning</h1>

      {/* Track Progress Table */}
      <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-center">
          <thead className="text-white" style={{ background: 'linear-gradient(135deg, #8E7DFF, #6C5CE7)' }}>
            <tr>
              <th className="px-3 py-2 text-sm font-medium uppercase tracking-wider">Batch ID</th>
              <th className="px-3 py-2 text-sm font-medium uppercase tracking-wider">Task</th>
              <th className="px-3 py-2 text-sm font-medium uppercase tracking-wider">Quantity</th>
              <th className="px-3 py-2 text-sm font-medium uppercase tracking-wider">Material</th>
              <th className="px-3 py-2 text-sm font-medium uppercase tracking-wider">Material Qty</th>
              <th className="px-3 py-2 text-sm font-medium uppercase tracking-wider">Assigned To</th>
              <th className="px-3 py-2 text-sm font-medium uppercase tracking-wider">Assign Date</th>
              <th className="px-3 py-2 text-sm font-medium uppercase tracking-wider">Status</th>
              <th className="px-3 py-2 text-sm font-medium uppercase tracking-wider">Due Date</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {currentTasks.length === 0 ? (
              <tr>
                <td colSpan="9" className="px-3 py-4 text-center">No tasks assigned</td>
              </tr>
            ) : currentTasks.map((task) => (
              <tr key={task.id} className="hover:bg-gray-50 text-center">
                <td className="px-3 py-2 text-base font-medium text-gray-900">{task.batch}</td>
                <td className="px-3 py-2 text-base text-gray-500">{task.task}</td>
                <td className="px-3 py-2 text-base text-gray-500">{task.quantity}</td>
                <td className="px-3 py-2 text-base text-gray-500">{task.material}</td>
                <td className="px-3 py-2 text-base text-gray-500">{task.materialQuantity}</td>
                <td className="px-3 py-2 text-base text-gray-500">{task.assignedTo}</td>
                <td className="px-3 py-2 text-base text-gray-500">{task.assignDate}</td>
                <td className="px-3 py-2">
                  <span className={`px-2 py-1 text-sm font-semibold rounded-full ${
                    task.status === 'On Track' ? 'bg-green-100 text-green-800' :
                    task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {task.status}
                  </span>
                </td>
                <td className="px-3 py-2 text-base text-gray-500">{task.dueDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination (outside of table) */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-end items-center space-x-2">
          <button
            onClick={() => goToPage(currentPage-1)}
            disabled={currentPage===1}
            className="px-4 py-2 rounded-md font-medium text-base bg-gray-200 text-gray-800 disabled:opacity-50 hover:bg-gray-100"
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i+1}
              onClick={() => goToPage(i+1)}
              className={`px-4 py-2 rounded-md text-base font-medium ${
                currentPage === i+1 ? 'bg-[#6C5CE7] text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-100'
              }`}
            >
              {i+1}
            </button>
          ))}
          <button
            onClick={() => goToPage(currentPage+1)}
            disabled={currentPage===totalPages}
            className="px-4 py-2 rounded-md font-medium text-base bg-gray-200 text-gray-800 disabled:opacity-50 hover:bg-gray-100"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
