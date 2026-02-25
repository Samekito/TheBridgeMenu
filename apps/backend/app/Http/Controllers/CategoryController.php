<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CategoryController extends Controller
{
    public function store(Request $request)
    {
        if ($request->user()->role !== 'super-admin') {
            abort(403, 'Only Super Admins can add new categories.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name'
        ]);

        $validated['slug'] = \Illuminate\Support\Str::slug($validated['name']);
        $validated['created_by'] = $request->user()->id;

        $category = Category::create($validated);
        
        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'created',
            'entity_type' => 'Category',
            'entity_name' => $category->name,
        ]);

        Log::info('Category created', ['category_id' => $category->id, 'name' => $category->name, 'user_id' => $request->user()->id]);

        $category->load('menuItems');
        return response()->json($category, 201);
    }

    public function update(Request $request, string $id)
    {
        if ($request->user()->role !== 'super-admin') {
            abort(403, 'Only Super Admins can update categories.');
        }

        $category = Category::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $category->id
        ]);

        $validated['slug'] = \Illuminate\Support\Str::slug($validated['name']);

        $category->update($validated);
        
        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'updated',
            'entity_type' => 'Category',
            'entity_name' => $category->name,
        ]);

        Log::info('Category updated', ['category_id' => $category->id, 'name' => $category->name, 'user_id' => $request->user()->id]);

        $category->load('menuItems');
        return response()->json($category);
    }

    public function destroy(Request $request, string $id)
    {
        if ($request->user()->role !== 'super-admin') {
            abort(403, 'Only Super Admins can delete categories.');
        }

        $category = Category::findOrFail($id);

        DB::transaction(function () use ($request, $category) {
            // Log + delete each item to trigger model events (image cleanup)
            foreach ($category->menuItems as $item) {
                AuditLog::create([
                    'user_id' => $request->user()->id,
                    'action' => 'deleted',
                    'entity_type' => 'Menu Item',
                    'entity_name' => $item->name,
                    'category_name' => $category->name,
                ]);
                $item->delete();
            }

            AuditLog::create([
                'user_id' => $request->user()->id,
                'action' => 'deleted',
                'entity_type' => 'Category',
                'entity_name' => $category->name,
            ]);

            $category->delete();
        });

        Log::info('Category deleted with cascading items', ['category' => $category->name, 'user_id' => $request->user()->id]);

        return response()->json(['message' => 'Category and its items deleted successfully.']);
    }
}
