<?php

namespace App\Http\Controllers;

use App\Models\Inventory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class InventoryController extends Controller
{ 
    // Fetch inventory from inventory table only
    public function index()
    {
        try {
            $inventoryCollection = Inventory::select(['id','item_name','quantity','minimum_required','unit','status','created_at'])->get();

            $result = $inventoryCollection->map(function($item) {
                return [
                    'id' => $item->id,
                    'item_name' => $item->item_name,
                    'quantity' => $item->quantity ?? 0,
                    'minimum_required' => $item->minimum_required ?? 0,
                    'unit' => $item->unit ?? 'Piece',
                    'status' => $item->status ?? 'In Stock',
                    'created_at' => $item->created_at ? $item->created_at->toDateTimeString() : null,
                ];
            })->toArray();

            return response()->json($result);
        } catch (\Throwable $e) {
            Log::error('Inventory index error: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to fetch inventory'], 500);
        }
    }

    // Create new inventory item
    public function store(Request $request)
    {
        Log::info('Inventory.store payload', $request->all()); // debug
        $request->validate([
            'item_name' => 'required|string|max:255',
            'quantity' => 'nullable|integer|min:0',
            'minimum_required' => 'nullable|integer|min:0',
            'unit' => 'nullable|string|max:50',
            'status' => 'nullable|string|max:50',
        ]);

        try {
            $inventory = Inventory::create([
                'item_name' => $request->item_name,
                'quantity' => $request->quantity ?? 0,
                'minimum_required' => $request->minimum_required ?? 0,
                'unit' => $request->unit ?? 'Piece',
                'status' => $request->status ?? 'In Stock',
            ]);
            return response()->json($inventory, 201);
        } catch (\Throwable $e) {
            Log::error('Inventory store error: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to create inventory'], 500);
        }
    }

    // Update inventory
    public function update(Request $request, $id)
    {
        $request->validate([
            'item_name' => 'nullable|string|max:255',
            'quantity' => 'nullable|integer|min:0',
            'minimum_required' => 'nullable|integer|min:0',
            'unit' => 'nullable|string|max:50',
            'status' => 'nullable|string|max:50',
        ]);

        $inventory = Inventory::find($id);
        if (!$inventory) return response()->json(['message' => 'Not found'], 404);

        try {
            $inventory->fill($request->only(['item_name','quantity','minimum_required','unit','status']));
            $inventory->save();
            return response()->json($inventory);
        } catch (\Throwable $e) {
            Log::error('Inventory update error: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to update inventory'], 500);
        }
    }

    // Delete inventory
    public function destroy($id)
    {
        $inventory = Inventory::find($id);
        if (!$inventory) return response()->json(['message' => 'Not found'], 404);

        try {
            $inventory->delete();
            return response()->json(['message' => 'Deleted']);
        } catch (\Throwable $e) {
            Log::error('Inventory delete error: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to delete'], 500);
        }
    }
}
