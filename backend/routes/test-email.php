<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Mail;
use App\Models\User;
use App\Notifications\SendOtpNotification;

// Test email route - remove this after testing
Route::get('/test-email', function () {
    try {
        // Get first user or use email directly
        $user = User::first();
        
        if (!$user) {
            return response()->json(['error' => 'No user found in database']);
        }

        $testToken = '123456';
        
        // Send OTP notification
        $user->notify(new SendOtpNotification($testToken, 'email'));
        
        return response()->json([
            'success' => true,
            'message' => 'Test OTP email sent to ' . $user->email,
            'token' => $testToken
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ], 500);
    }
});
