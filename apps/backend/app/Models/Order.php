<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_name',
        'customer_phone',
        'table_number',
        'status', // 'pending', 'cleared'
        'total_price',
        'cleared_by_admin_id'
    ];

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function clearedByAdmin()
    {
        return $this->belongsTo(User::class, 'cleared_by_admin_id');
    }
}
