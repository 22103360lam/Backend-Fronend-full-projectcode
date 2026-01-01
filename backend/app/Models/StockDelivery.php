<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockDelivery extends Model
{
    use HasFactory;

    protected $table = 'stocks_deliveries';

    protected $fillable = [
        'item_name',
        'supplier',
        'quantity',
        'delivery_status',
        'delivered_quantity',
        'unit',
    ];
}
