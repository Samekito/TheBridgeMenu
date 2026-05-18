<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Models\User;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::define('manage-categories', function (User $user) {
            return $user->role === 'super-admin';
        });

        Gate::define('manage-menu', function (User $user) {
            return $user->role === 'super-admin'; // Only super-admin for now
        });
    }
}
