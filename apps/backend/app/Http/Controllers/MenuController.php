<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\MenuItem;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class MenuController extends Controller
{
    public function index()
    {
        return response()->json(Category::with(['menuItems.creator', 'creator'])->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:2000',
            'price' => 'required|numeric|min:0|max:999999.99',
            'image_url' => ['nullable', 'string', 'regex:/^\/storage\/menu-images\//'],
            'is_available' => 'boolean'
        ]);

        $validated['created_by'] = $request->user()->id;

        $item = MenuItem::create($validated);
        $categoryName = $item->category->name;

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'created',
            'entity_type' => 'Menu Item',
            'entity_name' => $item->name,
            'category_name' => $categoryName,
        ]);

        Log::info('Menu item created', ['item_id' => $item->id, 'name' => $item->name, 'user_id' => $request->user()->id]);

        return response()->json($item, 201);
    }

    public function show(string $id)
    {
        $item = MenuItem::findOrFail($id);
        return response()->json($item);
    }

    public function update(Request $request, string $id)
    {
        $item = MenuItem::findOrFail($id);
        
        $validated = $request->validate([
            'category_id' => 'exists:categories,id',
            'name' => 'string|max:255',
            'description' => 'nullable|string|max:2000',
            'price' => 'numeric|min:0|max:999999.99',
            'image_url' => ['nullable', 'string', 'regex:/^\/storage\/menu-images\//'],
            'is_available' => 'boolean'
        ]);

        $item->update($validated);
        $categoryName = $item->category->name;

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'updated',
            'entity_type' => 'Menu Item',
            'entity_name' => $item->name,
            'category_name' => $categoryName,
        ]);

        Log::info('Menu item updated', ['item_id' => $item->id, 'name' => $item->name, 'user_id' => $request->user()->id]);

        return response()->json($item);
    }

    public function destroy(Request $request, string $id)
    {
        $item = MenuItem::findOrFail($id);
        $categoryName = $item->category->name ?? 'Unknown';

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'deleted',
            'entity_type' => 'Menu Item',
            'entity_name' => $item->name,
            'category_name' => $categoryName,
        ]);

        Log::info('Menu item deleted', ['item_id' => $item->id, 'name' => $item->name, 'user_id' => $request->user()->id]);

        $item->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
