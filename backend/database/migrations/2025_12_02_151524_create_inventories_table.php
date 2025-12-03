<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inventories', function (Blueprint $table) {
            $table->id();
            $table->string('item_name');                   // Item name
            $table->integer('quantity')->default(0);   // Quantity from production
            $table->integer('minimum_required')->default(0); 
            $table->string('status')->default('In Stock'); // Low / Medium / In Stock
            $table->unsignedBigInteger('production_task_id')->nullable(); // Link with production
            $table->string('unit')->nullable(); // pc, meter, kg etc (optional)
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventories');
    }
};
