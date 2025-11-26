<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('productions', function (Blueprint $table) {
    $table->id();
    $table->string('batch_id')->unique();
    $table->string('task')->default('Pending');
    $table->string('quantity')->default('0'); // string
    $table->foreignId('material_id')->nullable()->constrained('raw_materials')->nullOnDelete();
    $table->string('material_name')->nullable(); // corrected
    $table->string('material_quantity')->default('0');
    $table->foreignId('assigned_user_id')->nullable()->constrained('users')->nullOnDelete();
     $table->string('assigned_to')->nullable(); // corrected
    $table->date('assign_date')->nullable();
    $table->string('status')->default('On Track');
    $table->date('due_date')->nullable();
    $table->timestamps();
});
    }

    public function down(): void
    {
        Schema::dropIfExists('productions');
    }
};
