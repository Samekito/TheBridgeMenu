<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\CategoryController;

// Public routes
Route::get('/menu', [MenuController::class, 'index']);
Route::get('/menu/{id}', [MenuController::class, 'show']);

// Rate-limited public endpoints
Route::middleware('throttle:10,1')->group(function () {
    Route::post('/orders', [OrderController::class, 'store']);
});

Route::middleware('throttle:5,1')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
});

// Protected Admin Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user()->only(['id', 'name', 'email', 'role', 'created_at']);
    });
    
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Admin management (Role logic handled in controller)
    Route::get('/admins', [\App\Http\Controllers\AdminController::class, 'index']);
    Route::post('/admins', [\App\Http\Controllers\AdminController::class, 'store']);
    Route::delete('/admins/{id}', [\App\Http\Controllers\AdminController::class, 'destroy']);
    
    // User Settings
    Route::put('/user/password', [\App\Http\Controllers\AdminController::class, 'updatePassword']);
    
    // Menu & Category management
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);
    
    Route::post('/menu', [MenuController::class, 'store']);
    Route::put('/menu/{id}', [MenuController::class, 'update']);
    Route::delete('/menu/{id}', [MenuController::class, 'destroy']);
    
    // Image upload
    Route::post('/upload-image', [\App\Http\Controllers\ImageUploadController::class, 'store']);

    // Audit Logs (paginated)
    Route::get('/audit-logs', function (Request $request) {
        if ($request->user()->role !== 'super-admin') {
            abort(403, 'Unauthorized');
        }
        return response()->json(
            \App\Models\AuditLog::with('user')
                ->orderBy('created_at', 'desc')
                ->paginate(50)
        );
    });

    // Order management
    Route::get('/orders', [OrderController::class, 'index']);
    Route::patch('/orders/{id}/clear', [OrderController::class, 'markAsCleared']);
});
