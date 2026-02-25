<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class AdminController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user()->role !== 'super-admin') {
            abort(403, 'Only Super Admins can view other admins.');
        }

        return response()->json(User::select(['id', 'name', 'email', 'role', 'created_at'])->get());
    }

    public function store(Request $request)
    {
        if ($request->user()->role !== 'super-admin') {
            abort(403, 'Only Super Admins can add new admins.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => ['required', Password::min(8)->mixedCase()->numbers()],
        ]);

        $admin = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        // Set role explicitly — not mass-assignable for security
        $admin->role = 'admin';
        $admin->save();

        return response()->json($admin->only(['id', 'name', 'email', 'role', 'created_at']), 201);
    }

    public function destroy(Request $request, string $id)
    {
        if ($request->user()->role !== 'super-admin') {
            abort(403, 'Only Super Admins can delete admins.');
        }

        $admin = User::findOrFail($id);
        
        if ($admin->role === 'super-admin') {
            abort(403, 'Cannot delete a super-admin.');
        }

        // Revoke all tokens for the deleted admin
        $admin->tokens()->delete();
        $admin->delete();
        return response()->json(['message' => 'Admin deleted successfully.']);
    }

    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => 'required|string',
            'new_password' => ['required', 'string', 'confirmed', Password::min(8)->mixedCase()->numbers()],
        ]);

        $user = $request->user();

        if (!Hash::check($validated['current_password'], $user->password)) {
            return response()->json(['message' => 'Current password is incorrect.'], 400);
        }

        $user->update([
            'password' => Hash::make($validated['new_password']),
        ]);

        // Revoke all other tokens — force re-login everywhere
        $user->tokens()->where('id', '!=', $user->currentAccessToken()->id)->delete();

        return response()->json(['message' => 'Password updated successfully.']);
    }
}
