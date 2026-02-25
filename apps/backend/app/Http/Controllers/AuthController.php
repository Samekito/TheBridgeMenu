<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            Log::warning('Failed login attempt', ['email' => $request->email, 'ip' => $request->ip()]);

            throw ValidationException::withMessages([
                'email' => ['Invalid credentials.'],
            ]);
        }

        Log::info('Successful login', ['user_id' => $user->id, 'email' => $user->email, 'ip' => $request->ip()]);

        return response()->json([
            'token' => $user->createToken('admin-token')->plainTextToken,
            'user' => $user->only(['id', 'name', 'email', 'role']),
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        Log::info('User logged out', ['user_id' => $request->user()->id]);
        return response()->json(['message' => 'Logged out successfully']);
    }
}
