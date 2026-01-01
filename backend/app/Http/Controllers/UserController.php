<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Auth\Events\Registered;

class UserController extends Controller
{
    // Show one user (without exposing password)
    public function show($id)
    {
        $user = User::select('id', 'name', 'email', 'phone', 'role', 'department')
                    ->find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json($user);
    }

    // List all users (clean and safe)
    public function index()
    {
        return response()->json(
            User::select('id', 'name', 'email', 'phone', 'role', 'department')->get()
        );
    }

    // Create new user
    public function store(Request $request)
    {  
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:users,email',
            'phone' => 'nullable|string|unique:users,phone',
            'password' => 'required|string|min:8',
            'role' => 'required|in:Admin,Manager,Staff',
            'department' => 'nullable|string',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'role' => $request->role,
            'department' => $request->department ?? null,
            'password' => Hash::make($request->password),
        ]);

        // Fire the Registered event to send OTP
        event(new Registered($user));

        return response()->json([
            'message' => 'User created successfully. Please check your email for OTP verification.',
            'user' => $user,
            'requires_otp' => true
        ]);
    }

    // Update user
    public function update(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|unique:users,phone,' . $user->id,
            'password' => 'nullable|string|min:8',
            'role' => 'required|in:Admin,Manager,Staff',
            'department' => 'nullable|string',
        ]);

        $user->name = $request->name;
        $user->email = $request->email;
        $user->phone = $request->phone;
        $user->role = $request->role;
        $user->department = $request->department ?? null;

        if ($request->password) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        return response()->json(['message' => 'User updated successfully', 'user' => $user]);
    }

    // Delete user
    public function destroy($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }
}
