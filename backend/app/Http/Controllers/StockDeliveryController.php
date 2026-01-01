<?php

namespace App\Http\Controllers;

use App\Models\StockDelivery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class StockDeliveryController extends Controller
{
    // Fetch all stock deliveries
    public function index()
    {
        try {
            $stockDeliveries = StockDelivery::orderBy('id', 'desc')->get();
            return response()->json($stockDeliveries);
        } catch (\Throwable $e) {
            Log::error('StockDelivery index error: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to fetch stock deliveries'], 500);
        }
    }

    // Create or update stock delivery
    public function store(Request $request)
    {
        $request->validate([
            'item_name' => 'required|string|max:255',
            'quantity' => 'required|integer|min:0',
            'delivery_status' => 'nullable|string|max:50',
            'delivered_quantity' => 'nullable|integer|min:0',
            'unit' => 'nullable|string|max:50',
        ]);

        try {
            // Check if item exists
            $existingItem = StockDelivery::whereRaw('LOWER(item_name) = ?', [strtolower(trim($request->item_name))])->first();

            if ($existingItem) {
                // Update quantity for existing item
                $newQuantity = $existingItem->quantity + $request->quantity;
                $existingItem->update([
                    'quantity' => $newQuantity,
                ]);
                return response()->json($existingItem, 200);
            } else {
                // Create new entry
                $stockDelivery = StockDelivery::create([
                    'item_name' => $request->item_name,
                    'quantity' => $request->quantity,
                    'delivery_status' => $request->delivery_status ?? 'Pending',
                    'delivered_quantity' => $request->delivered_quantity ?? 0,
                    'unit' => $request->unit ?? 'Piece',
                ]);
                return response()->json($stockDelivery, 201);
            }
        } catch (\Throwable $e) {
            Log::error('StockDelivery store error: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to create/update stock delivery'], 500);
        }
    }

    // Update stock delivery
    public function update(Request $request, $id)
    {
        $request->validate([
            'item_name' => 'nullable|string|max:255',
            'quantity' => 'nullable|integer|min:0',
            'delivery_status' => 'nullable|string|max:50',
            'delivered_quantity' => 'nullable|integer|min:0',
            'unit' => 'nullable|string|max:50',
        ]);

        $stockDelivery = StockDelivery::find($id);
        if (!$stockDelivery) return response()->json(['message' => 'Not found'], 404);

        try {
            // Validate delivered_quantity <= quantity
            $deliveredQty = $request->has('delivered_quantity') ? $request->delivered_quantity : $stockDelivery->delivered_quantity;
            $totalQty = $request->has('quantity') ? $request->quantity : $stockDelivery->quantity;

            if ($deliveredQty > $totalQty) {
                return response()->json(['message' => 'Delivered quantity cannot exceed total quantity'], 400);
            }

            $stockDelivery->fill($request->only(['item_name', 'quantity', 'delivery_status', 'delivered_quantity', 'unit']));
            $stockDelivery->save();
            return response()->json($stockDelivery);
        } catch (\Throwable $e) {
            Log::error('StockDelivery update error: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to update stock delivery'], 500);
        }
    }

    // Delete stock delivery
    public function destroy($id)
    {
        $stockDelivery = StockDelivery::find($id);
        if (!$stockDelivery) return response()->json(['message' => 'Not found'], 404);

        try {
            $stockDelivery->delete();
            return response()->json(['message' => 'Deleted successfully']);
        } catch (\Throwable $e) {
            Log::error('StockDelivery delete error: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to delete'], 500);
        }
    }
}
