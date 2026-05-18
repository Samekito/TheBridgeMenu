<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($request->only('email', 'password'))) {
            $request->session()->regenerate();
            $user = Auth::user();
            
            Log::info('Successful login', ['user_id' => $user->id, 'email' => $user->email, 'ip' => $request->ip()]);

            return response()->json([
                'user' => $user->only(['id', 'name', 'email', 'role']),
            ]);
        }

        Log::warning('Failed login attempt', ['email' => $request->email, 'ip' => $request->ip()]);

        throw ValidationException::withMessages([
            'email' => ['Invalid credentials.'],
        ]);
    }

    public function logout(Request $request)
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        Log::info('User logged out', ['ip' => $request->ip()]);
        return response()->json(['message' => 'Logged out successfully']);
    }
}
