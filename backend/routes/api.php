<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RawMaterialController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\ProductionController;
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
Route::post('/raw-materials/recalculate-statuses', [RawMaterialController::class, 'recalculateStatuses']);


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

// Materials
Route::get('/materials', [RawMaterialController::class, 'index']);
Route::post('/materials', [RawMaterialController::class, 'store']);
Route::put('/materials/{id}', [RawMaterialController::class, 'update']);
Route::delete('/materials/{id}', [RawMaterialController::class, 'destroy']);

// Inventory CRUD
Route::get('/inventory', [InventoryController::class, 'index']);
Route::post('/inventory', [InventoryController::class, 'store']);
Route::put('/inventory/{id}', [InventoryController::class, 'update']);
Route::delete('/inventory/{id}', [InventoryController::class, 'destroy']);

// Stock Deliveries CRUD
Route::get('/stock-deliveries', [App\Http\Controllers\StockDeliveryController::class, 'index']);
Route::post('/stock-deliveries', [App\Http\Controllers\StockDeliveryController::class, 'store']);
Route::put('/stock-deliveries/{id}', [App\Http\Controllers\StockDeliveryController::class, 'update']);
Route::delete('/stock-deliveries/{id}', [App\Http\Controllers\StockDeliveryController::class, 'destroy']);


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
// OTP API routes (authenticated)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/otp/verify', [\App\Http\Controllers\Auth\OtpController::class, 'apiVerify']);
    Route::post('/otp/resend', [\App\Http\Controllers\Auth\OtpController::class, 'apiResend']);
});

// Public OTP verification (for newly created users who haven't logged in yet)
Route::post('/otp/verify-new-user', function (Request $request) {
    $request->validate([
        'user_id' => 'required|exists:users,id',
        'token' => 'required|string',
    ]);

    $user = App\Models\User::find($request->user_id);
    $token = $request->token;

    $otp = App\Models\Otp::where('user_id', $user->id)
        ->where('token', $token)
        ->where('used', false)
        ->orderBy('created_at', 'desc')
        ->first();

    if (!$otp) {
        return response()->json(['message' => 'Invalid verification code.'], 404);
    }

    if ($otp->expires_at && \Carbon\Carbon::now()->gt($otp->expires_at)) {
        return response()->json(['message' => 'This verification code has expired.'], 422);
    }

    $otp->used = true;
    $otp->save();

    $user->otp_verified_at = \Carbon\Carbon::now();
    $user->save();

    return response()->json(['message' => 'OTP verified successfully.', 'user' => $user], 200);
});

// Public OTP resend (for newly created users)
Route::post('/otp/resend-new-user', function (Request $request) {
    $request->validate([
        'user_id' => 'required|exists:users,id',
    ]);

    $user = App\Models\User::find($request->user_id);
    $token = (string) random_int(100000, 999999);

    $otp = App\Models\Otp::create([
        'user_id' => $user->id,
        'channel' => 'email',
        'target' => $user->email,
        'token' => $token,
        'expires_at' => \Carbon\Carbon::now()->addMinutes(10),
    ]);

    $user->notify(new App\Notifications\SendOtpNotification($token));

    return response()->json(['message' => 'A new verification code was sent.'], 200);
});
