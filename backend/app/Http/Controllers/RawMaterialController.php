<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RawMaterial;

class RawMaterialController extends Controller
{
    // List all raw materials
    public function index()
    {
        return response()->json(
            RawMaterial::select('id', 'material_name', 'quantity', 'min_required', 'unit', 'supplier', 'status', 'created_at')
                        ->get()
        );
    }

    // Auto calculate stock status
    private function getStatus($quantity, $min_required)
    {
        if ($quantity == 0) {
            return 'Out of Stock';
        } elseif ($quantity < $min_required) {
            return 'Low Stock';
        } else {
            return 'In Stock';
        }
    }

    // Store new raw material
    public function store(Request $request)
    {
        $request->validate([
            'material_name' => 'required|string|max:255',
            'quantity' => 'required|integer|min:0',
            'min_required' => 'required|integer|min:0',
            'unit' => 'required|string|max:20',
            'supplier' => 'nullable|string|max:255',
        ]);

        $status = $this->getStatus($request->quantity, $request->min_required);

        $material = RawMaterial::create([
            'material_name' => $request->material_name,
            'quantity' => $request->quantity,
            'min_required' => $request->min_required,
            'unit' => $request->unit,
            'supplier' => $request->supplier,
            'status' => $status,
        ]);

        return response()->json(['message' => 'Raw material created', 'material' => $material]);
    }

    // Show one material
    public function show($id)
    {
        $material = RawMaterial::find($id);
        if (!$material) {
            return response()->json(['message' => 'Material not found'], 404);
        }
        return response()->json($material);
    }

    // Update raw material
    public function update(Request $request, $id)
    {
        $material = RawMaterial::find($id);
        if (!$material) {
            return response()->json(['message' => 'Material not found'], 404);
        }

        $request->validate([
            'material_name' => 'sometimes|required|string|max:255',
            'quantity' => 'sometimes|required|integer|min:0',
            'min_required' => 'sometimes|required|integer|min:0',
            'unit' => 'sometimes|required|string|max:20',
            'supplier' => 'nullable|string|max:255',
        ]);

        // Update only passed fields
        if ($request->has('material_name')) $material->material_name = $request->material_name;
        if ($request->has('quantity')) $material->quantity = $request->quantity;
        if ($request->has('min_required')) $material->min_required = $request->min_required;
        if ($request->has('unit')) $material->unit = $request->unit;
        if ($request->has('supplier')) $material->supplier = $request->supplier;

        // Recalculate stock status
        $material->status = $this->getStatus($material->quantity, $material->min_required);

        $material->save();

        return response()->json(['message' => 'Raw material updated', 'material' => $material]);
    }

    // Delete raw material
    public function destroy($id)
    {
        $material = RawMaterial::find($id);
        if (!$material) {
            return response()->json(['message' => 'Material not found'], 404);
        }

        $material->delete();
        return response()->json(['message' => 'Raw material deleted']);
    }
}
