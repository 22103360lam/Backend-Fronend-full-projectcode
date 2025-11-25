<?php


namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('users')->insert([
            [
                'name' => 'Admin User',
                'email' => 'lam@gmail.com',
                'phone' => '01303323107',
                'password' => Hash::make('12345678'),
                'role' => 'Admin', // uppercase to match migration enum
                'department' => 'Management',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Manager User',
                'email' => 'manager@gmail.com',
                'phone' => '01560048902',
                'password' => Hash::make('12345678'),
                'role' => 'Manager',
                'department' => 'Production',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Staff User',
                'email' => 'staff@gmail.com',
                'phone' => '01303323103',
                'password' => Hash::make('12345678'),
                'role' => 'Staff',
                'department' => 'Operations',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}

