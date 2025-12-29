<?php

namespace App\Http\Controllers;

use App\Models\Production;
use App\Models\User;
use App\Models\Inventory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ProductionController extends Controller
{
    // Fetch all production records with related assigned user and material info
    public function index()
    {
        return Production::with(['assignedUser', 'materialItem'])->get();
    }

    // Create a new production record
    public function store(Request $request)
    {
        $request->validate([
            'batch_id' => 'required|string|unique:productions,batch_id',
            'task' => 'nullable|string',
            'quantity' => 'nullable|string',
            'material_id' => 'nullable|exists:raw_materials,id',
            'material_name' => 'nullable|string',
            'material_quantity' => 'nullable|string',
            'assigned_user_id' => 'nullable|exists:users,id',
            'assigned_to' => 'nullable|string',
            'assign_date' => 'nullable|date',
            'status' => 'nullable|string',
            'due_date' => 'nullable|date',
        ]);

        try {
            // Resolve assigned_to from assigned_user_id if available
            $assignedTo = $request->assigned_to ?? null;
            if ($request->filled('assigned_user_id')) {
                $user = User::find($request->assigned_user_id);
                $assignedTo = $user ? $user->name : $assignedTo;
            }

            $production = Production::create([
                'batch_id' => $request->batch_id,
                'task' => $request->task ?? 'Pending',
                'quantity' => $request->quantity ?? 0,
                'material_id' => $request->material_id ?? null,
                'material_name' => $request->material_name ?? null,
                'material_quantity' => $request->material_quantity ?? 0,
                'assigned_user_id' => $request->assigned_user_id ?? null,
                'assigned_to' => $assignedTo,
                'assign_date' => $request->assign_date ?? null,
                'status' => $request->status ?? 'On Track',
                'due_date' => $request->due_date ?? null,
            ]);

            return response()->json($production, 201);
        } catch (\Throwable $e) {
            Log::error('Production store error: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to create production'], 500);
        }
    }

    // Update a production record
    public function update(Request $request, $id)
    {
        $production = Production::find($id);
        if (!$production) {
            return response()->json(['message' => 'Production not found'], 404);
        }

        try {
            $updateData = [];

            if ($request->has('task')) $updateData['task'] = $request->task;
            if ($request->has('quantity')) $updateData['quantity'] = $request->quantity;
            if ($request->has('minimum_required')) $updateData['minimum_required'] = $request->minimum_required;
            if ($request->has('unit')) $updateData['unit'] = $request->unit;
            if ($request->has('status')) $updateData['status'] = $request->status;

            $production->update($updateData);

            return response()->json($production);
        } catch (\Throwable $e) {
            Log::error('Production update error: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to update production', 'error' => $e->getMessage()], 500);
        }
    }

    // Assign or update a task for a production batch
    public function assignTask(Request $request, $batch)
    {
        $request->validate([
            'task' => 'required|string',
            'quantity' => 'nullable|string',
            'assigned_user_id' => 'nullable|exists:users,id',
            'assigned_to' => 'nullable|string',
            'status' => 'nullable|string',
            'due_date' => 'nullable|date',
        ]);

        $production = Production::where('batch_id', $batch)->first() ?? Production::find($batch);
        if (!$production) return response()->json(['message' => 'Production not found'], 404);

        // Resolve assigned_to from assigned_user_id if provided
        $assignedTo = $production->assigned_to;
        if ($request->filled('assigned_user_id')) {
            $user = User::find($request->assigned_user_id);
            $assignedTo = $user ? $user->name : ($request->assigned_to ?? $assignedTo);
        } elseif ($request->filled('assigned_to')) {
            $assignedTo = $request->assigned_to;
        }

        $production->update([
            'task' => $request->task,
            'quantity' => $request->quantity ?? $production->quantity,
            'assigned_user_id' => $request->assigned_user_id ?? $production->assigned_user_id,
            'assigned_to' => $assignedTo,
            'status' => $request->status ?? $production->status,
            'due_date' => $request->due_date ?? $production->due_date,
        ]);

        return response()->json($production);
    }

    // Assign or update materials for a production batch
    public function assignMaterial(Request $request, $batch)
    {
        $request->validate([
            'material_id' => 'nullable|exists:raw_materials,id',
            'material_name' => 'nullable|string',
            'material_quantity' => 'nullable|string',
            'unit' => 'nullable|string',
        ]);

        $production = Production::where('batch_id', $batch)->first() ?? Production::find($batch);
        if (!$production) {
            return response()->json(['message' => 'Production not found'], 404);
        }

        $production->update([
            'material_id' => $request->material_id ?? $production->material_id,
            'material_name' => $request->material_name ?? $production->material_name,
            'material_quantity' => $request->material_quantity ?? $production->material_quantity,
            'unit' => $request->unit ?? $production->unit,
        ]);

        return response()->json($production);
    }

    // Delete a production record
    public function destroy($id)
    {
        $production = Production::find($id);
        if (!$production) return response()->json(['message' => 'Production not found'], 404);

        $production->delete();
        return response()->json(['message' => 'Production deleted successfully']);
    }

    // Convert a production batch into an inventory record
    public function toInventory(Request $request, $batch)
    {
        try {
            $production = Production::where('batch_id', $batch)->first() ?? Production::find($batch);
            if (!$production) return response()->json(['message' => 'Production not found'], 404);

            // Normalize quantity: extract numbers if quantity string like '500pc'
            $rawQty = $production->quantity ?? 0;
            $qty = 0;
            if (is_numeric($rawQty)) $qty = (int)$rawQty;
            else {
                $matches = [];
                preg_match('/(\d+)/', (string)$rawQty, $matches);
                $qty = isset($matches[1]) ? (int)$matches[1] : 0;
            }

            $inventory = Inventory::create([
                'item_name' => $production->task ?? 'Unnamed',
                'quantity' => $qty,
                'minimum_required' => 0,
                'unit' => $production->unit ?? 'Piece',
                'status' => $production->status ?? 'In Stock',
            ]);

            return response()->json($inventory, 201);
        } catch (\Throwable $e) {
            Log::error('Convert production to inventory error: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to convert'], 500);
        }
    }
}
