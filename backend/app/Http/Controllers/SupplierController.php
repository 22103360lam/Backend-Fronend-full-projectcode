<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use Illuminate\Http\Request;

class SupplierController extends Controller
{
    //  Get all suppliers
    public function index()
    {
        return response()->json(Supplier::all());
    }

    //  Get a single supplier
    public function show($id)
    {
        $supplier = Supplier::find($id);
        if (!$supplier) {
            return response()->json(['message' => 'Supplier not found'], 404);
        }
        return response()->json($supplier);
    }

    //  Create supplier
    public function store(Request $request)
    {
        $request->validate([
            'supplier'       => 'required|string|max:255',
            'contact_person' => 'required|string|max:255',
            'material'       => 'required|string|max:255',
            'quantity'       => 'required|integer',
            'unit'           => 'required|string',
            'status'         => 'required|string|max:50'
        ]);

        $supplier = Supplier::create($request->all());
        return response()->json(['message' => 'Supplier created successfully', 'supplier' => $supplier]);
    }

    // 4️⃣ Update supplier
    public function update(Request $request, $id)
    {
        $supplier = Supplier::find($id);
        if (!$supplier) {
            return response()->json(['message' => 'Supplier not found'], 404);
        }

        $request->validate([
            'supplier'       => 'sometimes|required|string|max:255',
            'contact_person' => 'sometimes|required|string|max:255',
            'material'       => 'sometimes|required|string|max:255',
            'quantity'       => 'sometimes|required|integer',
            'unit'           => 'sometimes|required|string',
            'status'         => 'sometimes|required|string|max:50'
        ]);

        $supplier->update($request->all());
        return response()->json(['message' => 'Supplier updated successfully', 'supplier' => $supplier]);
    }

    // 5️⃣ Delete supplier
    public function destroy($id)
    {
        $supplier = Supplier::find($id);
        if (!$supplier) {
            return response()->json(['message' => 'Supplier not found'], 404);
        }

        $supplier->delete();
        return response()->json(['message' => 'Supplier deleted successfully']);
    }
}
