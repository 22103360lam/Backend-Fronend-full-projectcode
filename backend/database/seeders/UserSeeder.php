<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Array of users to create
        $users = [
            [
                'name' => 'Admin User',
                'email' => 'lam@gmail.com',
                'phone' => '01303323107',
                'password' => '12345678',
                'role' => 'Admin',
                'department' => 'Management',
            ],
            [
                'name' => 'Manager User',
                'email' => 'manager@gmail.com',
                'phone' => '01560048902',
                'password' => '12345678',
                'role' => 'Manager',
                'department' => 'Production',
            ],
            [
                'name' => 'Staff User',
                'email' => 'staff@gmail.com',
                'phone' => '01303323103',
                'password' => '12345678',
                'role' => 'Staff',
                'department' => 'Operations',
            ],
        ];

        foreach ($users as $userData) {
            // Create user using Eloquent
            $user = User::updateOrCreate(
                ['email' => $userData['email']], // match by email to avoid duplicates
                [
                    'name' => $userData['name'],
                    'phone' => $userData['phone'],
                    'role' => $userData['role'],
                    'department' => $userData['department'],
                    'password' => Hash::make($userData['password']), // hash password
                ]
            );

            //  make password visible temporarily for debugging
             $user = $user->makeVisible('password');
            // dd($user); // dump user to check password hash
        }
    }
}
