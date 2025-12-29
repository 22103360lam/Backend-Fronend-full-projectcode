import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../AuthContext';

export default function Productioncontainer() {
   // getting role for conditional rendering
    const { user } = useAuth();
    const role = user?.role;

  // ===== State =====
  const [filterStatus, setFilterStatus] = useState("All"); // FILTER STATE (ONLY NEW)
  const [filterDate, setFilterDate] = useState(''); // date filter
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
  const [materialForm, setMaterialForm] = useState({ batch: '', material: '', quantity: '', unit: '', stock: '' });
  const [editTask, setEditTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openStatusMenu, setOpenStatusMenu] = useState(null); // for 3-dot menu

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
      setMaterials(Array.isArray(res.data) ? res.data : []);
      console.log('raw-materials response', res.data);
    } catch (err) {
      console.error('Failed to load materials', err);
    }
  };

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
        materialName: p.material_name ?? p.materialItem?.material_name ?? '',
        materialQuantity: p.material_quantity?.toString() || '',
        unit: p.unit || '',  // <-- added unit
        assigned_user_id: p.assigned_user_id || '',
        assigned_to: p.assigned_to || '', 
        assignDate: p.assign_date || '',
        status: p.status || 'On Track',
        dueDate: p.due_date || ''
      }));

      setTasks(prods);

      const uniqueBatches = prods.map(p => ({ id: p.batch, name: p.batch, date: p.assignDate }));
      setBatches(uniqueBatches);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  //  FILTER LOGIC (ONLY NEW)
const filteredTasks = tasks.filter(t => {
  if (filterStatus === "All") return true;
  if (filterStatus === "Unused") return t.task.toLowerCase() === 'pending';   // only pending
  if (filterStatus === "Used") return t.task && t.task.toLowerCase() !== 'pending'; // anything else
  if (filterStatus === 'ByDate') {
    if (!filterDate) return true; // no date chosen -> show all
    // compare only the date portion (YYYY-MM-DD)
    return (t.assignDate || '').toString().slice(0, 10) === filterDate;
  }
  return t.status === filterStatus; // On Track / In Progress / Delayed
});


// ===== Pagination logic =====
const totalPages = Math.max(1, Math.ceil(filteredTasks.length / itemsPerPage));

useEffect(() => {
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages);
  }
}, [currentPage, totalPages]);

const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const currentTasks = filteredTasks.slice(indexOfFirstItem, indexOfLastItem);


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

      setBatches(prev => [...prev, { id: res.data.batch_id, name: res.data.batch_id, date: res.data.assign_date }]);
      setTasks(prev => [...prev, {
        id: res.data.id,
        batch: res.data.batch_id,
        task: res.data.task || '',
        quantity: res.data.quantity?.toString() || '',
        material: res.data.material_id ? res.data.material_id.toString() : '',
        materialName: res.data.material ?? '',
        materialQuantity: res.data.material_quantity?.toString() || '',
        unit: res.data.unit || '',  // <-- added unit
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
                assigned_user_id: res.data.assigned_user_id?.toString() || '',
                assigned_to: res.data.assigned_to || '',
                status: res.data.status,
                dueDate: res.data.due_date
              }
            : t
        )
      );

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

      // validate against stock (allow equal or less)
      const stockVal = Number(selectedMaterial?.stock ?? selectedMaterial?.quantity ?? 0);
      const assignQty = Number(materialForm.quantity);
      if (isNaN(assignQty) || assignQty <= 0) return alert('Please enter a valid assign quantity');
      if (assignQty > stockVal) return alert(`Assign quantity (${assignQty}) cannot exceed stock (${stockVal})`);

      const res = await axios.put(`http://127.0.0.1:8000/api/productions/${encodeURIComponent(materialForm.batch)}/material`, {
        material_id: materialForm.material,
        material_name: selectedMaterial?.material_name || '',
        material_quantity: materialForm.quantity,
        unit: materialForm.unit // <-- send unit
      });

      // update production task in UI
      setTasks(prev => prev.map(t => t.id === res.data.id ? {
        ...t,
        material: res.data.material_id ? res.data.material_id.toString() : '',
        materialName: res.data.material_name || '-',
        materialQuantity: res.data.material_quantity?.toString() || '',
        unit: res.data.unit || '' // <-- update unit
      } : t));

      // decrement raw-material stock on server (and update local materials list)
      try {
        const newStock = stockVal - assignQty;
        // send both common keys in case backend expects one of them
        const updatePayload = { quantity: newStock, stock_quantity: newStock, stock: newStock };
        await axios.put(`http://127.0.0.1:8000/api/raw-materials/${selectedMaterial.id}`, updatePayload);

        setMaterials(prev => prev.map(m => m.id === selectedMaterial.id ? { ...m, quantity: newStock, stock: newStock } : m));

        // notify other pages/components (raw material page) about update
        window.dispatchEvent(new CustomEvent('raw-material-updated', {
          detail: { id: selectedMaterial.id, newStock }
        }));
      } catch (matErr) {
        console.error('Failed to update raw-material stock', matErr);
        // non-blocking: inform user but keep production assignment
        alert('Assigned material but failed to update raw-material stock on server.');
      }

      setMaterialForm({ batch: '', material: '', quantity: '', unit: '', stock: '' });
    } catch (err) {
      console.error(err);
      alert('Failed to assign material');
    }
  };

  const handleEditTask = (task) => {
    setEditTask(task);
    setTaskForm({
      batch: task.batch,
      task: task.task,
      quantity: task.quantity,
      assigned_user_id: task.assigned_user_id,
      assigned_to: task.assigned_to || '',
      status: task.status,
      dueDate: task.dueDate
    });
    setMaterialForm({
      batch: task.batch,
      material: task.material,
      quantity: task.materialQuantity,
      unit: task.unit || '',  // <-- populate unit for editing
      stock: task.materialStock || '' // <-- populate stock for editing (if present)
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

  // Add finished task to inventory
  const addToInventory = async (task) => {
    try {
      const itemName = task.task; // Use task name as item name
      const quantity = Number(task.quantity) || 0;

      if (!itemName || quantity <= 0) {
        console.log('Invalid task data for inventory');
        return;
      }

      // First, check if item already exists in inventory
      const inventoryRes = await axios.get('http://127.0.0.1:8000/api/inventory');
      const inventoryItems = Array.isArray(inventoryRes.data) ? inventoryRes.data : [];
      
      // Find existing item with same name (case-insensitive)
      const existingItem = inventoryItems.find(
        item => (item.item_name || '').toLowerCase().trim() === itemName.toLowerCase().trim()
      );

      if (existingItem) {
        // Item exists - update quantity by adding new quantity
        const newQuantity = Number(existingItem.quantity || 0) + quantity;
        await axios.put(`http://127.0.0.1:8000/api/inventory/${existingItem.id}`, {
          item_name: existingItem.item_name,
          quantity: newQuantity,
          minimum_required: existingItem.minimum_required || 0,
          unit: 'Piece',
          status: newQuantity > (existingItem.minimum_required || 0) ? 'In Stock' : 'Low Stock'
        });
        console.log(`Updated inventory: ${itemName} - added ${quantity}, new total: ${newQuantity}`);
      } else {
        // Item doesn't exist - create new inventory item
        await axios.post('http://127.0.0.1:8000/api/inventory', {
          item_name: itemName,
          quantity: quantity,
          minimum_required: 0,
          unit: 'Piece',
          status: 'In Stock'
        });
        console.log(`Created new inventory item: ${itemName} with quantity: ${quantity}`);
      }

      // Notify inventory page about update
      window.dispatchEvent(new CustomEvent('inventory-updated'));
      
    } catch (err) {
      console.error('Failed to add to inventory:', err);
      alert('Task marked as Finished but failed to update inventory.');
    }
  };

  // Handle status change from 3-dot menu
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      const res = await axios.put(
        `http://127.0.0.1:8000/api/productions/${encodeURIComponent(task.batch)}/task`,
        {
          task: task.task,
          quantity: task.quantity,
          assigned_user_id: task.assigned_user_id || null,
          assigned_to: task.assigned_to || '',
          status: newStatus,
          due_date: task.dueDate || null
        }
      );

      setTasks(prev =>
        prev.map(t =>
          t.id === taskId
            ? { ...t, status: newStatus }
            : t
        )
      );
      setOpenStatusMenu(null);

      // If status changed to "Finished", add to inventory
      if (newStatus === 'Finished') {
        await addToInventory(task);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

  const buttonClass = "bg-[#6C5CE7] hover:bg-[#5949D5] text-white px-4 py-2 rounded-md font-semibold transition-colors h-[38px]";

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-4 md:p-6 bg-[#eff1f9] space-y-6 min-h-screen">
      <h1 className="text-2xl font-bold text-[#000000]">Production Planning</h1>

      {/* Create Batch   and role based rendaring */}
        {(role === "Admin" || role === "Manager" ) && (
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-[#000000]">Create Batch</h2>
        <form className="flex flex-col md:flex-row gap-2 items-end" onSubmit={handleBatchSubmit}>
          <div className="flex flex-col gap-1 flex-1">
            <label htmlFor="batchName">Batch Name</label>
            <input
              id="batchName"
              type="text"
              placeholder="Batch Name or ID"
              className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]"
              value={batchForm.batchName}
              onChange={e => setBatchForm({ ...batchForm, batchName: e.target.value })}
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="">Assign Task Date</label>
            <input
              type="date"
              className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]"
              value={batchForm.date}
              onChange={e => setBatchForm({ ...batchForm, date: e.target.value })}
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <button type="submit" className={buttonClass}>Create</button>
          </div>
        </form>
      </div>
        )}
      

       
      {/* Assign Tasks */}
       {(role === "Admin" || role === "Manager" ) && (
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-[#000000]">Assign Tasks</h2>
        <form className="flex flex-col md:flex-row gap-2 items-end w-full" onSubmit={handleTaskSubmit}>
          {/* Batch */}
          <div className="flex flex-col gap-1 flex-1">
            <label htmlFor="batchSelect">Select Batch</label>
            <select
              className="flex-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]"
              value={taskForm.batch}
              onChange={e => setTaskForm({ ...taskForm, batch: e.target.value })}
              required
            >
              <option value="">Select Batch</option>
              {batches.map(batch => <option key={batch.id + batch.date} value={batch.id}>{batch.name}</option>)}
            </select>
          </div>

          {/* Task Name */}
          <div className="flex flex-col gap-1 flex-1">
            <label htmlFor="taskInput">Task Name</label>
            <select
              id="taskInput"
              value={taskForm.task}
              onChange={e => setTaskForm({ ...taskForm, task: e.target.value })}
              required
              className="flex-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] bg-white"
            >
              <option value="">Select Task</option>
              <option value="Cutting">Cutting</option>
              <option value="Shirt">Shirt</option>
              <option value="Pant">Pant</option>
              <option value="T-shirt">T-shirt</option>
              <option value="Jersey">Jersey</option>
              <option value="Quality Check">Quality Check</option>
              <option value="Fabric Inspection">Fabric Inspection</option>
              <option value="Packing &amp; Folding">Packing &amp; Folding</option>
              <option value="Material Receiving">Material Receiving</option>
              <option value="Packing">Packing</option>
            </select>
          </div>

          {/* Task Quantity */}
          <div className="flex flex-col gap-1 flex-1">
            <label htmlFor="taskInput">Task Quantity </label>
            <input
              type="text"
              placeholder="Quantity"
              className="flex-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]"
              value={taskForm.quantity}
              onChange={e => setTaskForm({ ...taskForm, quantity: e.target.value })}
              required
            />
          </div>
        

          {/* Assign User */}
          <div className="flex flex-col gap-1 flex-1">
            <label htmlFor="taskInput">Assign To </label>
            <select
              className="flex-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]}"
              value={taskForm.assigned_user_id}
              onChange={e => setTaskForm({ ...taskForm, assigned_user_id: e.target.value })}
            >
              <option value="">Select User</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>

          {/* Due Date */}
          <div className="flex flex-col gap-1 flex-1">
            <label htmlFor="taskInput">Due Date </label>
            <input
              type="date"
              className="flex-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]"
              value={taskForm.dueDate}
              onChange={e => setTaskForm({ ...taskForm, dueDate: e.target.value })}
            />
          </div>

          <button type="submit" className={buttonClass}>{editTask ? 'Update' : 'Assign'}</button>
        </form>
      </div>
       )}

      {/* Assign Material */}
       {(role === "Admin" || role === "Manager" ) && (
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-[#000000]">Assign Material</h2>
        <form className="flex flex-col md:flex-row gap-2 items-end w-full" onSubmit={handleMaterialSubmit}>
          {/* Batch */}
          <div className="flex flex-col gap-1 flex-1">
            <label>Select Batch </label>
            <select
              className="flex-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]"
              value={materialForm.batch}
              onChange={e => setMaterialForm({ ...materialForm, batch: e.target.value })}
              required
            >
              <option value="">Select Batch</option>
              {batches.map(batch => <option key={batch.id + batch.date} value={batch.id}>{batch.name}</option>)}
            </select>
          </div>

          {/* Material */}
          <div className="flex flex-col gap-1 flex-1">
            <label>Select Material </label>
            <select
              className="flex-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]"
              value={materialForm.material}
              onChange={e => {
                const val = e.target.value;
                const sel = materials.find(m => m.id.toString() === val.toString());
                // prefer `quantity` field from raw-materials as stock and store as string
                setMaterialForm({ ...materialForm, material: val, stock: sel ? String(sel.quantity ?? sel.stock ?? '') : '', quantity: '' });
              }}
              required
            >
              <option value="">Assign Material</option>
              {materials.map(m => <option key={m.id} value={m.id}>{m.material_name}</option>)}
            </select>
          </div>

          {/* Stock */}
          <div className="flex flex-col gap-1 flex-1">
            <label>Stock</label>
            <input
              type="text"
              readOnly
              value={materialForm.stock}
              placeholder="-"
              className="px-2 py-1 border border-gray-300 rounded-md bg-gray-50"
            />
          </div>

          {/* Quantity */}
          <div className="flex flex-col gap-1 flex-1">
            <label>Assign Quantity </label>
            <input
              type="text"
              placeholder="Quantity"
              className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]"
              value={materialForm.quantity}
              onChange={e => {
                // allow only numbers and dot
                const raw = e.target.value.replace(/[^\d.]/g, '');
                const stockVal = Number(materialForm.stock || 0);
                const num = Number(raw);
                if (stockVal && !isNaN(num) && num > stockVal) {
                  alert('Not more than stock quantity'); // alert massage
                  return setMaterialForm({ ...materialForm, quantity: String(stockVal) });
                }
                setMaterialForm({ ...materialForm, quantity: raw });
              }}
              required
            />
          </div>

          {/* Unit */}
          <div className="flex flex-col gap-1 flex-1">
            <label>Unit</label>
            <select
              name="unit"
              value={materialForm.unit}
              onChange={e => setMaterialForm({ ...materialForm, unit: e.target.value })}
              className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] bg-white"
              required
            >
              <option value="">Select Unit</option>
              <option value="Kg">Kg</option>
              <option value="Yard">Yard</option>
              <option value="Meter">Meter</option>
              <option value="Gross">Gross</option>
              <option value="Dozen">Dozen</option>
              <option value="Piece">Piece</option>
            </select>
          </div>

          <button type="submit" className={buttonClass}>Assign</button>
        </form>
      </div>
       )}
        

      {/* Track Progress Table */}
      <div className="space-y-2">
          <div className="flex items-center justify-between">
         <h2 className="text-lg font-semibold text-[#000000]">
        Track Progress
      </h2>
      <div className="flex items-center gap-2">
        <select
          value={filterStatus}
          onChange={(e) => {
            const val = e.target.value;
            setFilterStatus(val);
            setCurrentPage(1);
            if (val !== 'ByDate') setFilterDate('');
          }}
          className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]"
        >
          <option value="All">All</option>
          <option value="Unused">Unused Batch</option>
          <option value="Used">Used Batch</option>
          <option value="ByDate">By Date</option>
        </select>
         {/* filter by date */}
        {filterStatus === 'ByDate' && (
          <input
            type="date"
            value={filterDate}
            onChange={e => { setFilterDate(e.target.value); setCurrentPage(1); }}
            className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]"
          />
        )}
      </div>
    </div>


        
        <div className="bg-white rounded-lg shadow overflow-auto">
          <table className="w-full text-sm">
            <thead className="text-white" style={{ background: 'linear-gradient(135deg, #8E7DFF, #6C5CE7)' }}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Batch ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Task</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Material</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Material Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Unit</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Assigned To</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Assign Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Due Date</th>
                 {(role === "Admin"  ) && (
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Actions</th>
                 )}
              </tr>
            </thead>
            <tbody>
              {currentTasks.length === 0 ? (
                <tr>
                  <td colSpan="11" className="px-6 py-3 text-center">No tasks assigned</td>
                </tr>
              ) : currentTasks.map(task => (
                <tr key={task.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-3 whitespace-nowrap">{task.batch}</td>
                  <td className="px-6 py-3 whitespace-nowrap">{task.task}</td>
                  <td className="px-6 py-3 whitespace-nowrap">{task.quantity}piece</td>
                  <td className="px-6 py-3 whitespace-nowrap">{task.materialName || '-'}</td>
                  <td className="px-6 py-3 whitespace-nowrap">{task.materialQuantity}</td>
                  <td className="px-6 py-3 whitespace-nowrap">{task.unit || '-'}</td>
                  <td className="px-6 py-3 whitespace-nowrap">{task.assigned_to || '-'}</td>
                  <td className="px-6 py-3 whitespace-nowrap">{task.assignDate}</td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        task.status === 'On Track' ? 'bg-green-100 text-green-800' :
                        task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                        task.status === 'Finished' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>{task.status}</span>
                      {(role === "Admin" || role === "Manager" || role==="Staff") && task.status !== 'Finished' && (
                        <div className="relative">
                          <button
                            onClick={() => setOpenStatusMenu(openStatusMenu === task.id ? null : task.id)}
                            className="p-1 rounded-full hover:bg-gray-100 focus:outline-none"
                          >
                            <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                              <circle cx="10" cy="4" r="2" />
                              <circle cx="10" cy="10" r="2" />
                              <circle cx="10" cy="16" r="2" />
                            </svg>
                          </button>
                          {openStatusMenu === task.id && (
                            <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                              <button
                                onClick={() => handleStatusChange(task.id, 'On Track')}
                                className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                              >
                                On Track
                              </button>
                              <button
                                onClick={() => handleStatusChange(task.id, 'In Progress')}
                                className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                              >
                                In Progress
                              </button>
                              <button
                                onClick={() => handleStatusChange(task.id, 'Delayed')}
                                className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                              >
                                Delayed
                              </button>
                              <button
                                onClick={() => handleStatusChange(task.id, 'Finished')}
                                className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 text-blue-600 font-medium"
                              >
                                Finished
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">{task.dueDate}</td>
                   {(role === "Admin" ) && (
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
                   )}
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
