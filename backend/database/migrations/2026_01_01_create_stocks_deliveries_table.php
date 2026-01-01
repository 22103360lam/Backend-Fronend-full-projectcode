<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stocks_deliveries', function (Blueprint $table) {
            $table->id();
            $table->string('item_name');
            $table->integer('quantity')->default(0);
            $table->string('delivery_status')->default('Pending'); // Pending / In Transit / Delivered
            $table->integer('delivered_quantity')->default(0);
            $table->string('unit')->default('Piece');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stocks_deliveries');
    }
};
