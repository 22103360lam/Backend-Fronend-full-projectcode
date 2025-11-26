<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RawMaterialController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\ProductionController;
use App\Http\Controllers\MaterialController;
use Illuminate\Http\Request;

// =======================
// User CRUD API
// =======================
Route::get('/users', [UserController::class, 'index']);
Route::post('/users', [UserController::class, 'store']);
Route::put('/users/{id}', [UserController::class, 'update']);
Route::delete('/users/{id}', [UserController::class, 'destroy']);

// =======================
// Raw Material CRUD API
// =======================
Route::get('/raw-materials', [RawMaterialController::class, 'index']);
Route::post('/raw-materials', [RawMaterialController::class, 'store']);
Route::put('/raw-materials/{id}', [RawMaterialController::class, 'update']);
Route::delete('/raw-materials/{id}', [RawMaterialController::class, 'destroy']);

// =======================
// Supplier CRUD API
// =======================
Route::get('/suppliers', [SupplierController::class, 'index']);
Route::post('/suppliers', [SupplierController::class, 'store']);
Route::put('/suppliers/{id}', [SupplierController::class, 'update']);
Route::delete('/suppliers/{id}', [SupplierController::class, 'destroy']);

// =======================
// Production CRUD & Batch Flow
// =======================
Route::prefix('productions')->group(function () {
    // Create initial batch
    Route::post('/', [ProductionController::class, 'store']);

    // Assign task to existing batch
    Route::put('{batch}/task', [ProductionController::class, 'assignTask']);       // expects batch id or production id

    // Assign material to existing batch
    Route::put('{batch}/material', [ProductionController::class, 'assignMaterial']);

    // Get all productions (for table)
    Route::get('/', [ProductionController::class, 'index']);

    // Get single production (optional)
    Route::get('/{id}', [ProductionController::class, 'show']);

    // Full update production (optional)
    Route::put('/{id}', [ProductionController::class, 'update']);

    // Delete production
    Route::delete('{id}', [ProductionController::class, 'destroy']);
});

// =======================
// MATERIALS API
// =======================
Route::get('/materials', [MaterialController::class, 'index']);

// =======================
// LOGIN API (with token)
// =======================
Route::post('/login', function (Request $request) {
    $request->validate([
        'identifier' => 'required',
        'password' => 'required',
    ]);

    $user = App\Models\User::where('email', $request->identifier)
                ->orWhere('phone', $request->identifier)
                ->first();

    if (!$user) {
        return response()->json(['message' => 'User not found'], 404);
    }

    if (!Illuminate\Support\Facades\Hash::check($request->password, $user->password)) {
        return response()->json(['message' => 'Invalid password'], 401);
    }

    $token = $user->createToken('auth_token')->plainTextToken;
    $expiresAt = now()->addMinutes(60);

    return response()->json([
        'message' => 'Login successful',
        'token' => $token,
        'expires_at' => $expiresAt,
        'user' => $user,
        'role' => $user->role,
    ]);
});

// =======================
// Authenticated User API
// =======================
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
