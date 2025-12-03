<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RawMaterialController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\ProductionController;
use App\Http\Controllers\MaterialController;
use App\Http\Controllers\InventoryController;
use Illuminate\Http\Request;
use Carbon\Carbon;


// User CRUD API
Route::get('/users', [UserController::class, 'index']);
Route::post('/users', [UserController::class, 'store']);
Route::put('/users/{id}', [UserController::class, 'update']);
Route::delete('/users/{id}', [UserController::class, 'destroy']);


// Raw Material CRUD API
Route::get('/raw-materials', [RawMaterialController::class, 'index']);
Route::post('/raw-materials', [RawMaterialController::class, 'store']);
Route::put('/raw-materials/{id}', [RawMaterialController::class, 'update']);
Route::delete('/raw-materials/{id}', [RawMaterialController::class, 'destroy']);


// Supplier CRUD API
Route::get('/suppliers', [SupplierController::class, 'index']);
Route::post('/suppliers', [SupplierController::class, 'store']);
Route::put('/suppliers/{id}', [SupplierController::class, 'update']);
Route::delete('/suppliers/{id}', [SupplierController::class, 'destroy']);


// Production CRUD & Batch Flow
Route::prefix('productions')->group(function () {
    Route::post('/', [ProductionController::class, 'store']);
    Route::put('{batch}/task', [ProductionController::class, 'assignTask']);
    Route::put('{batch}/material', [ProductionController::class, 'assignMaterial']);
    // Convert a production batch into an inventory record
    Route::post('{batch}/to-inventory', [ProductionController::class, 'toInventory']);
    Route::get('/', [ProductionController::class, 'index']);
    Route::get('/{id}', [ProductionController::class, 'show']);
    Route::put('/{id}', [ProductionController::class, 'update']);
    Route::delete('{id}', [ProductionController::class, 'destroy']);
});

// Materials API
Route::get('/materials', [MaterialController::class, 'index']);

// Inventory CRUD
Route::get('/inventory', [InventoryController::class, 'index']);
Route::post('/inventory', [InventoryController::class, 'store']);
Route::put('/inventory/{id}', [InventoryController::class, 'update']);
Route::delete('/inventory/{id}', [InventoryController::class, 'destroy']);


// optional: production inventory endpoint
Route::get('/production/inventory', [ProductionController::class, 'inventory']);


// LOGIN (token-based)
Route::post('/login', function (Request $request) {
    $request->validate(['identifier' => 'required','password' => 'required']);

    $user = App\Models\User::where('email', $request->identifier)
                ->orWhere('phone', $request->identifier)
                ->first();

    if (!$user || !\Illuminate\Support\Facades\Hash::check($request->password, $user->password)) {
        return response()->json(['message' => 'Invalid credentials'], 401);
    }

   $expireMinutes = 60; // token lifetime in minutes
    $expiresAt = Carbon::now()->addMinutes($expireMinutes);
    $token = $user->createToken('auth_token', ['*'], $expiresAt)->plainTextToken;

  

   return response()->json([
    'message' => 'Login successful',
    'token' => $token,
    'expires_at' => $expiresAt, //  frontend receives proper time
    'user' => $user,
    'role' => $user->role,
    ]); 

});

// Token-authenticated user
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return response()->json($request->user());
});
