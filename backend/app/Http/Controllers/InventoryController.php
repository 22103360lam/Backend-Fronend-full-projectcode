<?php

namespace App\Http\Controllers;

use App\Models\Inventory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class InventoryController extends Controller
{ 
    // Fetch inventory with dynamic values from Production
    public function index()
    {
        // keep using Inventory model; fully qualify Production to avoid missing import errors
        $inventoryCollection = Inventory::all();
        $productionData = \App\Models\Production::whereNotNull('task')->get(); // data fetch from production table

        $inventoryMap = $inventoryCollection->keyBy(fn($it) => trim((string)($it->item_name ?? $it->name ?? '')));

        $result = $inventoryCollection->map(function($item) {
            return [
                'id' => $item->id,
                'item_name' => $item->item_name,
                'quantity' => $item->quantity ?? 0,
                'minimum_required' => $item->minimum_required ?? 0,
                'unit' => $item->unit ?? 'Piece',
                'status' => $item->status ?? 'In Stock',
                'source' => 'inventory',
            ];
        })->toArray();

        foreach ($productionData as $prod) {
            $taskName = trim((string)($prod->task ?? ''));
            if ($taskName === '') continue;
            if (!$inventoryMap->has($taskName)) {
                $result[] = [
                    'id' => null,
                    'item_name' => $taskName,
                    'quantity' => $prod->quantity ?? 0,
                    'minimum_required' => 0,
                    'unit' => $prod->unit ?? 'Piece',
                    'status' => $prod->status ?? 'In Stock',
                    'source' => 'production',
                ];
            }
        }

        return response()->json($result);
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
