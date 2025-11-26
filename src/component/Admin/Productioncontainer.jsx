import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Productioncontainer() {
  // ===== State =====
  const [batches, setBatches] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [batchForm, setBatchForm] = useState({ batchName: '', date: '' });
  const [taskForm, setTaskForm] = useState({
    batch: '',
    task: '',
    quantity: '',
    assigned_user_id: '',
    assigned_to: '',
    status: 'On Track',
    dueDate: ''
  });
  const [materialForm, setMaterialForm] = useState({ batch: '', material: '', quantity: '' });
  const [editTask, setEditTask] = useState(null);
  const [loading, setLoading] = useState(true);

  // ===== Pagination =====
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // ===== Fetch data =====
  useEffect(() => {
    fetchData();
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/raw-materials');
      // API returns { id, material_name }
      setMaterials(Array.isArray(res.data) ? res.data : []);
      console.log('raw-materials response', res.data);
    } catch (err) {
      console.error('Failed to load materials', err);
    }
  };

  //fetch data function

  const fetchData = async () => {
    try {
      const [prodRes, userRes] = await Promise.all([
        axios.get('http://127.0.0.1:8000/api/productions'),
        axios.get('http://127.0.0.1:8000/api/users')
      ]);

      setUsers(userRes.data || []);

      const prods = (prodRes.data || []).map(p => ({
  id: p.id,                      
  batch: p.batch_id,             
  task: p.task || '',
  quantity: p.quantity?.toString() || '',
  material: p.material_id ? p.material_id.toString() : '',
  materialName: p.material_name ?? p.materialItem?.material_name ?? '', // <-- use p.material_name
  materialQuantity: p.material_quantity?.toString() || '',
  assigned_user_id: p.assigned_user_id || '',
  assigned_to: p.assigned_to || '', 
  assignDate: p.assign_date || '',
  status: p.status || 'On Track',
  dueDate: p.due_date || ''
}));

      setTasks(prods);

      // batches should use the batch identifier (batch_id) as 'id' so selects pass the correct value
      const uniqueBatches = prods.map(p => ({ id: p.batch, name: p.batch, date: p.assignDate }));
      setBatches(uniqueBatches);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  // ===== Pagination logic =====
  const totalPages = Math.max(1, Math.ceil(tasks.length / itemsPerPage));
  if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTasks = tasks.slice(indexOfFirstItem, indexOfLastItem);
  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // ===== Handlers =====
  const handleBatchSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/productions', {
        batch_id: batchForm.batchName,
        assign_date: batchForm.date
      });

      // backend returns production with batch_id; push batch identifier
      setBatches(prev => [...prev, { id: res.data.batch_id, name: res.data.batch_id, date: res.data.assign_date }]);
      setTasks(prev => [...prev, {
        id: res.data.id,
        batch: res.data.batch_id,
        task: res.data.task || '',
        quantity: res.data.quantity?.toString() || '',
        material: res.data.material_id ? res.data.material_id.toString() : '',
        materialName: res.data.material ?? '',
        materialQuantity: res.data.material_quantity?.toString() || '',
        assigned_user_id: res.data.assigned_user_id || '',
        assigned_to: res.data.assigned_to || '',
        assignDate: res.data.assign_date,
        status: res.data.status || 'On Track',
        dueDate: res.data.due_date || ''
      }]);

      setBatchForm({ batchName: '', date: '' });
    } catch (err) {
      console.error(err);
      alert('Failed to create batch');
    }
  };

const handleTaskSubmit = async (e) => {
  e.preventDefault();
  if (!taskForm.batch) return alert('Please select a batch');

  try {
    // note: taskForm.batch is batch identifier (batch_id string)
    const res = await axios.put(
      `http://127.0.0.1:8000/api/productions/${encodeURIComponent(taskForm.batch)}/task`,
      {
        task: taskForm.task,
        quantity: taskForm.quantity,
        assigned_user_id: taskForm.assigned_user_id || null,
        assigned_to: taskForm.assigned_to || '',
        status: taskForm.status,
        due_date: taskForm.dueDate || null
      }
    );

    setTasks(prev =>
      prev.map(t =>
        t.id === res.data.id
          ? {
              ...t,
              task: res.data.task,
              quantity: res.data.quantity?.toString() || '',
              // force assigned_user_id to string for consistent mapping
              assigned_user_id: res.data.assigned_user_id?.toString() || '',
              assigned_to: res.data.assigned_to || '',
              status: res.data.status,
              dueDate: res.data.due_date
            }
          : t
      )
    );

    // reset form
    setTaskForm({ batch: '', task: '', quantity: '', assigned_user_id: '', assigned_to: '',status: 'On Track', dueDate: '' });
    setEditTask(null);
  } catch (err) {
    console.error(err);
    alert('Failed to assign task');
  }
};


  const handleMaterialSubmit = async (e) => {
  e.preventDefault();
  if (!materialForm.batch) return alert('Please select a batch');

  try {
    const selectedMaterial = materials.find(m => m.id.toString() === materialForm.material.toString());

    const res = await axios.put(`http://127.0.0.1:8000/api/productions/${encodeURIComponent(materialForm.batch)}/material`, {
      material_id: materialForm.material,
      material_name: selectedMaterial?.material_name || '', // snake_case key
      material_quantity: materialForm.quantity
    });

    setTasks(prev => prev.map(t => t.id === res.data.id ? {
      ...t,
      material: res.data.material_id ? res.data.material_id.toString() : '',
      materialName: res.data.material_name || '-',   // UI update
      materialQuantity: res.data.material_quantity?.toString() || ''
    } : t));

    setMaterialForm({ batch: '', material: '', quantity: '' });
  } catch (err) {
    console.error(err);
    alert('Failed to assign material');
  }
};



  const handleEditTask = (task) => {
    setEditTask(task);
    setTaskForm({
      batch: task.batch,         // pass batch identifier (batch_id string)
      task: task.task,
      quantity: task.quantity,
      assigned_user_id: task.assigned_user_id,
      assigned_to: task.assigned_to || '',
      status: task.status,
      dueDate: task.dueDate
    });
    setMaterialForm({
      batch: task.batch,         // batch identifier
      material: task.material,
      quantity: task.materialQuantity
    });
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/productions/${id}`);
      setTasks(prev => prev.filter(t => t.id !== id));
      setBatches(prev => prev.filter(b => b.id !== id && b.id !== tasks.find(t => t.id === id)?.batch));
    } catch (err) {
      console.error(err);
      alert('Failed to delete task');
    }
  };

  const buttonClass = "bg-[#6C5CE7] hover:bg-[#5949D5] text-white px-4 py-1 rounded-md font-semibold transition-colors";

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-4 md:p-6 bg-[#eff1f9] space-y-6 min-h-screen">
      <h1 className="text-2xl font-bold text-[#000000]">Production Planning</h1>

      {/* Create Batch */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-[#000000]">Create Batch</h2>
        <form className="flex flex-col md:flex-row gap-2" onSubmit={handleBatchSubmit}>
          <input type="text" placeholder="Batch Name or ID" className="flex-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]" value={batchForm.batchName} onChange={e => setBatchForm({ ...batchForm, batchName: e.target.value })} required />
          <input type="date" className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]" value={batchForm.date} onChange={e => setBatchForm({ ...batchForm, date: e.target.value })} required />
          <button type="submit" className={buttonClass}>Create</button>
        </form>
      </div>

      {/* Assign Tasks */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-[#000000]">Assign Tasks</h2>
        <form className="flex flex-col md:flex-row gap-2" onSubmit={handleTaskSubmit}>
          <select className="flex-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]" value={taskForm.batch} onChange={e => setTaskForm({ ...taskForm, batch: e.target.value })} required>
            <option value="">Select Batch</option>
            {batches.map(batch => <option key={batch.id + batch.date} value={batch.id}>{batch.name}</option>)}
          </select>
          <input type="text" placeholder="Task" className="flex-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]" value={taskForm.task} onChange={e => setTaskForm({ ...taskForm, task: e.target.value })} required />
          <input type="text" placeholder="Quantity" className="flex-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]" value={taskForm.quantity} onChange={e => setTaskForm({ ...taskForm, quantity: e.target.value })} required />
          <select className="flex-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]" value={taskForm.assigned_user_id} onChange={e => setTaskForm({ ...taskForm, assigned_user_id: e.target.value })}>
            <option value="">Select User</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
          <input type="date" className="flex-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]" value={taskForm.dueDate} onChange={e => setTaskForm({ ...taskForm, dueDate: e.target.value })} />
          <button type="submit" className={buttonClass}>{editTask ? 'Update' : 'Assign'}</button>
        </form>
      </div>

      {/* Assign Material */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-[#000000]">Assign Material</h2>
        <form className="flex flex-col md:flex-row gap-2" onSubmit={handleMaterialSubmit}>
          <select className="flex-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]" value={materialForm.batch} onChange={e => setMaterialForm({ ...materialForm, batch: e.target.value })} required>
            <option value="">Select Batch</option>
            {batches.map(batch => <option key={batch.id + batch.date} value={batch.id}>{batch.name}</option>)}
          </select>
          <select className="flex-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]" value={materialForm.material} onChange={e => setMaterialForm({ ...materialForm, material: e.target.value })} required>
            <option value="">Select Material</option>
            {materials.map(m => <option key={m.id} value={m.id}>{m.material_name}</option>)}
          </select>
          <input type="text" placeholder="Quantity" className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]" value={materialForm.quantity} onChange={e => setMaterialForm({ ...materialForm, quantity: e.target.value })} required />
          <button type="submit" className={buttonClass}>Assign</button>
        </form>
      </div>

      {/* Track Progress Table */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-[#000000]">Track Progress</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-white" style={{ background: 'linear-gradient(135deg, #8E7DFF, #6C5CE7)' }}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Batch ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Task</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Material</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Material Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Assigned To</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Assign Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentTasks.length === 0 ? (
                <tr>
                  <td colSpan="10" className="px-6 py-3 text-center">No tasks assigned</td>
                </tr>
              ) : currentTasks.map(task => (
                <tr key={task.id} className="border-t border-gray-200 hover:bg-gray-50">
<td className="px-6 py-3 whitespace-nowrap">{task.batch}</td>
<td className="px-6 py-3 whitespace-nowrap">{task.task}</td>
<td className="px-6 py-3 whitespace-nowrap">{task.quantity}</td>
<td className="px-6 py-3 whitespace-nowrap">{task.materialName || '-'}</td>
<td className="px-6 py-3 whitespace-nowrap">{task.materialQuantity}</td>
 <td className="px-6 py-3 whitespace-nowrap">{task.assigned_to || '-'}</td>
<td className="px-6 py-3 whitespace-nowrap">{task.assignDate}</td>

                  <td className="px-6 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      task.status === 'On Track' ? 'bg-green-100 text-green-800' :
                      task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>{task.status}</span>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">{task.dueDate}</td>
                  <td className="px-6 py-3 text-center">
                    <div className="inline-flex items-center gap-2">
                      <button onClick={() => handleEditTask(task)} className="p-1 rounded-full hover:bg-blue-50">
                        <img src="asset/edit.png" alt="Edit" className="w-4 h-4"/>
                      </button>
                      <button onClick={() => handleDeleteTask(task.id)} className="p-1 rounded-full hover:bg-red-50">
                        <img src="asset/delete.png" alt="Delete" className="w-4 h-4"/>
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
          <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50">Previous</button>
          {[...Array(totalPages)].map((_, idx) => (
            <button key={idx + 1} onClick={() => goToPage(idx + 1)} className={`px-3 py-2 rounded-md text-sm ${currentPage === idx + 1 ? 'bg-[#6C5CE7] text-white' : 'border border-gray-300 hover:bg-gray-50'}`}>{idx + 1}</button>
          ))}
          <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>
  );
}
