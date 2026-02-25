<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo; // Added for BelongsTo return type hint

class Category extends Model
{
    protected $fillable = ['name', 'slug', 'description', 'created_by'];

    public function menuItems(): HasMany
    {
        return $this->hasMany(MenuItem::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
