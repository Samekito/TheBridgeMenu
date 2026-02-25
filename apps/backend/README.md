# The Bridge Menu — Backend API

RESTful API powering the admin dashboard and customer ordering system. Built with Laravel and secured with Sanctum token authentication.

## Tech Stack

- **PHP 8.2+** — Runtime
- **Laravel 12** — Framework
- **Laravel Sanctum 4** — Token-based API authentication
- **MySQL** — Database (SQLite for local dev)
- **Eloquent ORM** — Database models & relationships

## API Endpoints

### Public

| Method | Endpoint         | Description                                                   |
| ------ | ---------------- | ------------------------------------------------------------- |
| `GET`  | `/api/menu`      | List all categories with their menu items                     |
| `GET`  | `/api/menu/{id}` | Get a single menu item                                        |
| `POST` | `/api/orders`    | Submit a new customer order (rate-limited: 10/min)            |
| `POST` | `/api/login`     | Authenticate and receive a bearer token (rate-limited: 5/min) |

### Authenticated (Bearer Token)

| Method   | Endpoint                 | Description                                                      |
| -------- | ------------------------ | ---------------------------------------------------------------- |
| `GET`    | `/api/user`              | Get the current authenticated user                               |
| `POST`   | `/api/logout`            | Revoke the current token                                         |
| `GET`    | `/api/orders`            | List orders with optional `?status=pending\|cleared` (paginated) |
| `POST`   | `/api/orders/{id}/clear` | Mark an order as cleared                                         |
| `POST`   | `/api/menu`              | Create a new menu item                                           |
| `PUT`    | `/api/menu/{id}`         | Update a menu item                                               |
| `DELETE` | `/api/menu/{id}`         | Delete a menu item                                               |
| `POST`   | `/api/upload-image`      | Upload a menu item image                                         |
| `POST`   | `/api/categories`        | Create a new category                                            |
| `PUT`    | `/api/categories/{id}`   | Rename a category                                                |
| `DELETE` | `/api/categories/{id}`   | Delete a category and its items (transactional)                  |
| `GET`    | `/api/admins`            | List all admin accounts                                          |
| `POST`   | `/api/admins`            | Create a new admin account                                       |
| `DELETE` | `/api/admins/{id}`       | Delete an admin account                                          |
| `POST`   | `/api/update-password`   | Change the authenticated user's password                         |
| `GET`    | `/api/audit-logs`        | View audit history (paginated, super-admin only)                 |

## Data Models

```
User           – name, email, password, role (admin | super-admin)
Category       – name, created_by → User
MenuItem       – name, description, price, image_url, is_available, category_id, created_by → User
Order          – customer_name, table_number, status, total, cleared_by_admin → User
OrderItem      – order_id → Order, menu_item_id → MenuItem, quantity, price_at_time
AuditLog       – action, entity_type, entity_name, user_id → User
```

## Project Structure

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── AuthController.php          # Login/logout
│   │   ├── AdminController.php         # Admin CRUD & password management
│   │   ├── MenuController.php          # Menu item CRUD
│   │   ├── CategoryController.php      # Category CRUD
│   │   ├── OrderController.php         # Order listing & clearing
│   │   └── ImageUploadController.php   # Image upload handler
│   └── Middleware/
│       └── SecurityHeaders.php         # HSTS, X-Frame-Options, etc.
├── Models/
│   ├── User.php, MenuItem.php, Category.php
│   ├── Order.php, OrderItem.php, AuditLog.php
config/
├── cors.php        # CORS origins (env-configurable)
├── sanctum.php     # Token expiry (24 hours)
routes/
└── api.php         # All API route definitions
```

## Getting Started

### Prerequisites

- PHP 8.2+
- Composer
- MySQL (or SQLite for local dev)

### Setup

```bash
cd apps/backend

# Install dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate app key
php artisan key:generate

# Run migrations
php artisan migrate

# Create storage symlink for image uploads
php artisan storage:link

# Start the dev server
php artisan serve
```

The API runs on **http://localhost:8000** by default.

### Seed a Super Admin

```bash
php artisan tinker
```

```php
\App\Models\User::create([
    'name' => 'Admin',
    'email' => 'admin@thebridgemenu.com',
    'password' => bcrypt('password'),
    'role' => 'super-admin',
]);
```

## Environment Variables

See `.env.example` for all available variables. Key production settings:

| Variable                   | Description                                      |
| -------------------------- | ------------------------------------------------ |
| `APP_DEBUG`                | Must be `false` in production                    |
| `APP_URL`                  | Your production domain                           |
| `DB_*`                     | Database connection credentials                  |
| `CORS_ALLOWED_ORIGINS`     | Comma-separated list of allowed frontend origins |
| `SANCTUM_STATEFUL_DOMAINS` | Your frontend domain(s) for cookie auth          |

## Security

- **Rate limiting** on login (5/min) and order submission (10/min)
- **Token expiry** after 24 hours
- **Path traversal protection** on image cleanup
- **Security headers** (HSTS, X-Frame-Options, X-Content-Type-Options, etc.)
- **Password complexity** enforcement (mixed case + numbers, min 8 chars)
- **Token revocation** on password change
- **CORS** restricted to configured origins
- **Structured logging** across all controllers
