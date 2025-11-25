<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
      Schema::create('raw_materials', function (Blueprint $table) {
            $table->id();
            $table->string('material_name');      // Raw Material Name
            $table->integer('quantity')->default(0);     // Current Quantity
            $table->integer('min_required')->default(0); // Minimum Required
            $table->string('supplier')->nullable();      // Supplier Name
            $table->string('status')->nullable();        // Status (e.g., Active/Inactive)
            $table->string('unit')->default('pcs');      // Unit (pcs, kg, etc.)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('raw_materials');
    }
};
