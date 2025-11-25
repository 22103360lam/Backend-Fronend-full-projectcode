<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RawMaterialController;
use App\Http\Controllers\SupplierController;
use Illuminate\Http\Request;


//  User CRUD API 
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


//  LOGIN API (Updated + Token return)
Route::post('/login', function (Request $request) {
    $request->validate([
        'identifier' => 'required',
        'password' => 'required',
    ]);

    // Email or phone login
    $user = App\Models\User::where('email', $request->identifier)
                ->orWhere('phone', $request->identifier)
                ->first();

    if (!$user) {
        return response()->json(['message' => 'User not found'], 404);
    }

    // Password match check
    if (!Illuminate\Support\Facades\Hash::check($request->password, $user->password)) {
        return response()->json(['message' => 'Invalid password'], 401);
    }

    //  Generate API Token using Sanctum
    $token = $user->createToken('auth_token')->plainTextToken;
 
  $expiresAt = now()->addMinutes(60); // Token expiration time (e.g., 60 minutes)
     

    return response()->json([
        'message' => 'Login successful',
        'token' => $token,
         'expires_at' => $expiresAt,
        'user' => $user,
        'role' => $user->role,
    ]);
});


// AUTH USER API (found user by token)
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
