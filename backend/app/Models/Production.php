<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Production extends Model
{
    use HasFactory;

    protected $table = 'productions';

    protected $fillable = [
        'batch_id',
        'task',
        'quantity',
        'minimum_required',
        'material_id',
        'material_name',
        'material_quantity',
        'unit',
        'assigned_user_id',
        'assigned_to',
        'assign_date',
        'due_date',
        'status',
    ];

    // Relations
    public function assignedUser()
    {
        return $this->belongsTo(User::class, 'assigned_user_id');
    }

    public function materialItem()
    {
        return $this->belongsTo(RawMaterial::class, 'material_id', 'id');
    }
}
