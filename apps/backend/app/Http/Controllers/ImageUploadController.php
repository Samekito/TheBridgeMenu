<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ImageUploadController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $path = $request->file('image')->store('menu-images', 'public');

        // Return path formatted for frontend usage or direct storage access
        return response()->json(['path' => '/storage/' . $path]);
    }
}
