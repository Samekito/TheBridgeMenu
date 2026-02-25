<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MenuItem extends Model
{
    protected $fillable = [
        'category_id',
        'name',
        'description',
        'price',
        'image_url',
        'is_available',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'is_available' => 'boolean',
            'price' => 'decimal:2',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Safely resolve the relative storage path from an image URL.
     * Returns null if the path is invalid or attempts traversal.
     */
    private static function safeImagePath(?string $imageUrl): ?string
    {
        if (!$imageUrl) {
            return null;
        }

        $path = str_replace('/storage/', '', $imageUrl);

        // Block path traversal attempts
        if (str_contains($path, '..') || str_contains($path, "\0")) {
            \Illuminate\Support\Facades\Log::warning('Blocked suspicious image path', ['path' => $path]);
            return null;
        }

        // Must be within the menu-images directory
        if (!str_starts_with($path, 'menu-images/')) {
            \Illuminate\Support\Facades\Log::warning('Image path outside allowed directory', ['path' => $path]);
            return null;
        }

        return $path;
    }

    protected static function booted()
    {
        // When a menu item is updated, check if the image changed and delete the old one
        static::updated(function ($menuItem) {
            if ($menuItem->wasChanged('image_url')) {
                $oldPath = self::safeImagePath($menuItem->getOriginal('image_url'));
                if ($oldPath) {
                    \Illuminate\Support\Facades\Storage::disk('public')->delete($oldPath);
                }
            }
        });

        // When a menu item is deleted, delete its image
        static::deleted(function ($menuItem) {
            $path = self::safeImagePath($menuItem->image_url);
            if ($path) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($path);
            }
        });
    }
}
