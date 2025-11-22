import React, { useState } from 'react';

export default function Productioncontainer() {
  // ===== State =====
  const [batches, setBatches] = useState([
    { id: '#1234', name: 'Shirts - Blue', date: '2025-11-01' },
    { id: '#1235', name: 'Pants - Black', date: '2025-11-02' }
  ]);

  // Static task data with 2 more entries
  const [tasks, setTasks] = useState([
    {
      id: 1,
      batch: "B001",
      task: "Cutting Fabric",
      quantity: 100,
      material: "Cotton",
      materialQuantity: 50,
      assignedTo: "John Doe",
      assignDate: "2024-11-01",
      status: "On Track",
      dueDate: "2024-11-10"
    },
    {
      id: 2,
      batch: "B002",
      task: "Sewing",
      quantity: 80,
      material: "Polyester",
      materialQuantity: 40,
      assignedTo: "Jane Smith",
      assignDate: "2024-11-02",
      status: "In Progress",
      dueDate: "2024-11-12"
    },
    {
      id: 3,
      batch: "B003",
      task: "Quality Check",
      quantity: 120,
      material: "Silk",
      materialQuantity: 60,
      assignedTo: "Mike Johnson",
      assignDate: "2024-11-03",
      status: "Delayed",
      dueDate: "2024-11-15"
    },
    {
      id: 4,
      batch: "B004",
      task: "Packaging",
      quantity: 200,
      material: "Cardboard",
      materialQuantity: 100,
      assignedTo: "Sarah Wilson",
      assignDate: "2024-11-04",
      status: "On Track",
      dueDate: "2024-11-18"
    },
    {
      id: 5,
      batch: "B005",
      task: "Printing Design",
      quantity: 150,
      material: "Canvas",
      materialQuantity: 75,
      assignedTo: "David Brown",
      assignDate: "2024-11-05",
      status: "In Progress",
      dueDate: "2024-11-20"
    },
    {
      id: 6,
      batch: "B006",
      task: "Button Attachment",
      quantity: 90,
      material: "Buttons",
      materialQuantity: 180,
      assignedTo: "Lisa Garcia",
      assignDate: "2024-11-06",
      status: "On Track",
      dueDate: "2024-11-22"
    }
  ]);

  const [batchForm, setBatchForm] = useState({ batchName: '', date: '' });
  const [taskForm, setTaskForm] = useState({
    batch: '',
    task: '',
    quantity: '',
    material: '',
    materialQuantity: '',
    assignedTo: '',
    status: 'On Track',
    dueDate: ''
  });
  const [materialForm, setMaterialForm] = useState({ batch: '', material: '', quantity: '' });
  const [editTask, setEditTask] = useState(null);

  // ===== Pagination State =====
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // Changed from 5 to 4

  // Recalculate pagination when tasks change
  const totalPages = Math.ceil(tasks.length / itemsPerPage);
  if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTasks = tasks.slice(indexOfFirstItem, indexOfLastItem);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };


  // ===== Handlers =====
  const handleBatchSubmit = (e) => {
    e.preventDefault();
    const newBatch = { id: batchForm.batchName, name: batchForm.batchName, date: batchForm.date };
    setBatches(prev => [...prev, newBatch]);
    setBatchForm({ batchName: '', date: '' });
  };

  const handleTaskSubmit = (e) => {
    e.preventDefault();
    const batch = batches.find(b => b.id === taskForm.batch);
    const assignDate = batch ? batch.date : '';
    if (editTask) {
      setTasks(prev => prev.map(t => t.id === editTask.id ? { ...t, ...taskForm, assignDate } : t));
      setEditTask(null);
    } else {
      setTasks(prev => [...prev, { ...taskForm, id: Date.now().toString(), assignDate }]);
    }
    setTaskForm({
      batch: '',
      task: '',
      quantity: '',
      material: '',
      materialQuantity: '',
      assignedTo: '',
      status: 'On Track',
      dueDate: ''
    });
  };

  const handleMaterialSubmit = (e) => {
    e.preventDefault();
    if (!materialForm.batch) {
      alert('Please select a batch first!');
      return;
    }
    setTasks(prev => prev.map(t =>
      t.batch === materialForm.batch
        ? { ...t, material: materialForm.material, materialQuantity: materialForm.quantity }
        : t
    ));
    setMaterialForm({ batch: '', material: '', quantity: '' });
  };

  const handleEditTask = (task) => {
    setEditTask(task);
    setTaskForm({
      batch: task.batch,
      task: task.task,
      quantity: task.quantity,
      assignedTo: task.assignedTo,
      status: task.status,
      dueDate: task.dueDate
    });
    setMaterialForm({
      batch: task.batch,
      material: task.material || '',
      quantity: task.materialQuantity || ''
    });
  };

  const handleDeleteTask = (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setTasks(prev => prev.filter(task => task.id !== id));
    }
  };

  const buttonClass = "bg-[#6C5CE7] hover:bg-[#5949D5] text-white px-4 py-1 rounded-md font-semibold transition-colors";

  return (
    <div className="p-4 md:p-6 bg-[#eff1f9] space-y-6 min-h-screen">
      <h1 className="text-2xl font-bold text-[#000000]">Production Planning</h1>

      {/* Create Batch */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-[#000000]">Create Batch</h2>
        <form className="flex flex-col md:flex-row gap-2" onSubmit={handleBatchSubmit}>
          <input
            type="text"
            placeholder="Batch Name or ID"
            className="flex-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]"
            value={batchForm.batchName}
            onChange={(e) => setBatchForm(prev => ({ ...prev, batchName: e.target.value }))}
            required
          />
          <input
            type="date"
            className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]"
            value={batchForm.date}
            onChange={(e) => setBatchForm(prev => ({ ...prev, date: e.target.value }))}
            required
          />
          <button type="submit" className={buttonClass}>Create</button>
        </form>
      </div>

      {/* Assign Tasks */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-[#000000]">Assign Tasks</h2>
        <form className="flex flex-col md:flex-row gap-2" onSubmit={handleTaskSubmit}>
          <select
            className="flex-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]"
            value={taskForm.batch}
            onChange={e => setTaskForm(prev => ({ ...prev, batch: e.target.value }))}
            required
          >
            <option value="" disabled>Select Batch</option>
            {batches.map(batch => (
              <option key={batch.id} value={batch.id}>{batch.id} - {batch.name}</option>
            ))}
          </select>
          <select
            className="flex-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]"
            value={taskForm.task}
            onChange={e => setTaskForm(prev => ({ ...prev, task: e.target.value }))}
            required
          >
            <option value="" disabled>Select Task</option>
            <option value="Shirt">Shirt</option>
            <option value="Pant">Pant</option>
            <option value="T-shirt">T-shirt</option>
            <option value="Cutting">Cutting</option>
            <option value="Sewing">Sewing</option>
            <option value="Quality Check">Quality Check</option>
            <option value="Packing">Packing</option>
          </select>
          <input
            type="number"
            placeholder="Quantity"
            min="1"
            className="flex-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]"
            value={taskForm.quantity}
            onChange={e => setTaskForm(prev => ({ ...prev, quantity: e.target.value }))}
            required
          />
          <input
            type="date"
            className="flex-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]"
            value={taskForm.dueDate}
            onChange={e => setTaskForm(prev => ({ ...prev, dueDate: e.target.value }))}
            required
          />
          <select
            className="flex-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]"
            value={taskForm.assignedTo}
            onChange={e => setTaskForm(prev => ({ ...prev, assignedTo: e.target.value }))}
          >
            <option value="" disabled>Assign to User</option>
            <option value="John Smith">John Smith</option>
            <option value="Sarah Johnson">Sarah Johnson</option>
            <option value="Mike Davis">Mike Davis</option>
            <option value="Emma Wilson">Emma Wilson</option>
          </select>
          <button type="submit" className={buttonClass}>{editTask ? "Update" : "Assign"}</button>
        </form>
      </div>

      {/* Assign Material */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-[#000000]">Assign Material</h2>
        <form className="flex flex-col md:flex-row gap-2" onSubmit={handleMaterialSubmit}>
          <select
            className="flex-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]"
            value={materialForm.batch}
            onChange={e => setMaterialForm(prev => ({ ...prev, batch: e.target.value }))}
            required
          >
            <option value="" disabled>Select Batch</option>
            {batches.map(batch => (
              <option key={batch.id} value={batch.id}>{batch.id} - {batch.name}</option>
            ))}
          </select>
          <select
            className="flex-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]"
            value={materialForm.material}
            onChange={e => setMaterialForm(prev => ({ ...prev, material: e.target.value }))}
            required
          >
            <option value="" disabled>Select Material</option>
            <option value="Cotton Fabric">Cotton Fabric</option>
            <option value="Polyester Fabric">Polyester Fabric</option>
            <option value="Silk Threads">Silk Threads</option>
            <option value="Cotton Threads">Cotton Threads</option>
            <option value="Buttons">Buttons</option>
            <option value="Zippers">Zippers</option>
            <option value="Elastic Bands">Elastic Bands</option>
            <option value="Labels">Labels</option>
          </select>
          <input
            type="number"
            placeholder="Material Quantity"
            min="1"
            className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]"
            value={materialForm.quantity}
            onChange={e => setMaterialForm(prev => ({ ...prev, quantity: e.target.value }))}
            required
          />
          <button type="submit" className={buttonClass}>Assign</button>
        </form>
      </div>

      {/* Track Progress Table */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-[#000000]">Track Progress</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm">
            <tr className="text-white" style={{ background: 'linear-gradient(135deg, #8E7DFF, #6C5CE7)' }}>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Batch ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Task</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Material</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Material Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Assigned To</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Assign Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Due Date</th>
              <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">
                Actions
              </th>
            </tr>

            {currentTasks.length === 0 ? (
              <tr>
                <td colSpan="10" className="px-6 py-3 text-center">No tasks assigned</td>
              </tr>
            ) : currentTasks.map((task, index) => (
              <tr key={task.id} className="border-t border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-7 h-7 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mr-3 font-semibold text-xs">
                      {indexOfFirstItem + index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{task.batch}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{task.task}</td>
                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{task.quantity}</td>
                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{task.material}</td>
                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{task.materialQuantity}</td>
                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{task.assignedTo}</td>
                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{task.assignDate}</td>
                <td className="px-6 py-3 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    task.status === 'On Track' ? 'bg-green-100 text-green-800' :
                    task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {task.status}
                  </span>
                </td>
                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{task.dueDate}</td>
                <td className="px-6 py-3 text-center text-sm font-medium">
                  <div className="inline-flex items-center gap-2">
                    <button
                      onClick={() => handleEditTask(task)}
                      className="p-1 rounded-full hover:bg-blue-50"
                    >
                      <img src="asset/edit.png" alt="Edit" className="w-4 h-4"/>
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-1 rounded-full hover:bg-red-50"
                    >
                      <img src="asset/delete.png" alt="Delete" className="w-4 h-4"/>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx + 1}
              onClick={() => goToPage(idx + 1)}
              className={`px-3 py-2 rounded-md text-sm ${
                currentPage === idx + 1 ? 'bg-[#6C5CE7] text-white' : 'border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {idx + 1}
            </button>
          ))}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
