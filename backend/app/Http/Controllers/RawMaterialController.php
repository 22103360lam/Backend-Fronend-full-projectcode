<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RawMaterial;

class RawMaterialController extends Controller
{
    // List all raw materials
    public function index()
    {
        $materials = RawMaterial::all();
        return response()->json($materials);
    }

    // Store new raw material
    public function store(Request $request)
    {
        $request->validate([
            'material_name' => 'required|string|max:255',
            'quantity' => 'required|integer|min:0',
            'min_required' => 'required|integer|min:0',
            'supplier' => 'nullable|string|max:255',
            'status' => 'nullable|string|max:50',
            'unit' => 'required|string|max:20',
        ]);

        $material = RawMaterial::create($request->all());
        return response()->json(['message' => 'Raw material created', 'material' => $material]);
    }

    // Show a single raw material
    public function show($id)
    {
        $material = RawMaterial::find($id);
        if (!$material) {
            return response()->json(['message' => 'Material not found'], 404);
        }
        return response()->json($material);
    }

    // Update a raw material
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
            'supplier' => 'nullable|string|max:255',
            'status' => 'nullable|string|max:50',
            'unit' => 'sometimes|required|string|max:20',
        ]);

        $material->update($request->all());
        return response()->json(['message' => 'Raw material updated', 'material' => $material]);
    }

    // Delete a raw material
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
