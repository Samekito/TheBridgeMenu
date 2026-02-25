<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\MenuItem;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create Super Admin
        User::factory()->create([
            'name' => 'Super Admin',
            'email' => 'admin@thebridge.com',
            'password' => Hash::make('password'),
            'role' => 'super-admin',
        ]);

        // Create Categories
        $breakfast = Category::create(['name' => 'Breakfast Menu', 'slug' => 'breakfast-menu', 'description' => 'Start your day right.']);
        $national = Category::create(['name' => 'National Dishes', 'slug' => 'national-dishes', 'description' => 'Local delicacies.']);
        $continental = Category::create(['name' => 'Continental Dishes', 'slug' => 'continental-dishes', 'description' => 'International flavors.']);
        $drinks = Category::create(['name' => 'Drinks', 'slug' => 'drinks', 'description' => 'Refreshing beverages.']);

        // Create Sample Items
        MenuItem::create([
            'category_id' => $breakfast->id,
            'name' => 'Full English Breakfast',
            'description' => 'Eggs, bacon, sausages, and baked beans.',
            'price' => 4500.00,
            'image_url' => 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop',
            'is_available' => true,
        ]);

        MenuItem::create([
            'category_id' => $breakfast->id,
            'name' => 'Fluffy Pancakes',
            'description' => 'Stack of pancakes with maple syrup and berries.',
            'price' => 3000.00,
            'image_url' => 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop',
            'is_available' => true,
        ]);

        MenuItem::create([
            'category_id' => $national->id,
            'name' => 'Jollof Rice & Chicken',
            'description' => 'Spicy rice dish popular in West Africa, served with grilled chicken.',
            'price' => 4500.00,
            'image_url' => 'https://images.unsplash.com/photo-1664992955919-48addcc4ba2f?w=800&auto=format&fit=crop',
            'is_available' => true,
        ]);

        MenuItem::create([
            'category_id' => $national->id,
            'name' => 'Pounded Yam & Egusi',
            'description' => 'Traditional Nigerian soup with melon seeds and assorted meat.',
            'price' => 5500.00,
            'image_url' => 'https://images.unsplash.com/photo-1605809543169-dc9dc4df9878?w=800&auto=format&fit=crop',
            'is_available' => true,
        ]);

        MenuItem::create([
            'category_id' => $continental->id,
            'name' => 'Grilled Salmon',
            'description' => 'Fresh Norwegian salmon with roasted asparagus and lemon butter.',
            'price' => 12000.00,
            'image_url' => 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&auto=format&fit=crop',
            'is_available' => true,
        ]);

        MenuItem::create([
            'category_id' => $continental->id,
            'name' => 'Pasta Carbonara',
            'description' => 'Classic Italian pasta with pancetta, egg, and parmesan.',
            'price' => 6500.00,
            'image_url' => 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&auto=format&fit=crop',
            'is_available' => true,
        ]);
        
        MenuItem::create([
            'category_id' => $drinks->id,
            'name' => 'Fresh Orange Juice',
            'description' => 'Freshly squeezed oranges.',
            'price' => 1500.00,
            'image_url' => 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=800&auto=format&fit=crop',
            'is_available' => true,
        ]);

        MenuItem::create([
            'category_id' => $drinks->id,
            'name' => 'Classic Mojito',
            'description' => 'Refreshing blend of mint, lime, and white rum.',
            'price' => 3500.00,
            'image_url' => 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=800&auto=format&fit=crop',
            'is_available' => true,
        ]);
    }
}
