<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RawMaterial extends Model
{
    use HasFactory;

    protected $table = 'raw_materials'; // table name

    protected $fillable = [
        'material_name',
        'quantity',
        'min_required',
        'supplier',
        'status',
        'unit',
    ];
}
