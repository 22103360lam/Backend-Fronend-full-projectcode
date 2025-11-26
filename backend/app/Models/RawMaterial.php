<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RawMaterial extends Model
{
    use HasFactory;

    protected $table = 'raw_materials';

    protected $fillable = [
        'material_name',
        'quantity',
        'min_required',
        'supplier',
        'status',
        'unit',
    ];

    // Relationship with Production
    public function productions()
    {
        return $this->hasMany(Production::class, 'material_id');
    }

    // IMPORTANT FIX 
    // Map "material_name" → "name" for frontend compatibility
    public function getNameAttribute()
    {
        return $this->material_name;
    }
}
