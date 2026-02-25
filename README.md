# 🍽️ The Bridge Menu

Full-stack restaurant menu and ordering system — customers browse & order, admins manage.

## Architecture

```
the-bridge-menu/
├── apps/
│   ├── admin-app/       React 19 + Vite — admin dashboard
│   ├── customer-app/    React 19 + Vite — public menu & ordering
│   └── backend/         Laravel 12 — REST API (Sanctum auth)
├── packages/
│   ├── shared-types/    Shared TypeScript types
│   └── shared-ui/       Shared UI components
├── turbo.json           Turborepo pipeline config
└── package.json         Workspace root
```

| App              | Port   | Description                                         |
| ---------------- | ------ | --------------------------------------------------- |
| **Admin App**    | `5173` | Menu CRUD, order management, team admin, audit logs |
| **Customer App** | `5174` | Browse menu, build a cart, place orders             |
| **Backend API**  | `8000` | RESTful API with Sanctum token auth                 |

## Tech Stack

| Layer    | Technologies                                                                          |
| -------- | ------------------------------------------------------------------------------------- |
| Frontend | React 19, TypeScript 5.9, Vite 7, Tailwind CSS 4, TanStack React Query, Framer Motion |
| Backend  | PHP 8.2+, Laravel 12, Sanctum 4, Eloquent ORM                                         |
| Database | MySQL (SQLite for local dev)                                                          |
| Tooling  | Turborepo, npm workspaces, ESLint                                                     |

## Quick Start

### Prerequisites

- **Node.js** 18+
- **npm** 9+
- **PHP** 8.2+ & **Composer**
- **MySQL** (or use SQLite for local dev)

### 1. Clone & install

```bash
git clone https://github.com/Samekito/TheBridgeMenu.git
cd TheBridgeMenu
npm install
```

### 2. Set up the backend

```bash
cd apps/backend
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate
php artisan storage:link
```

### 3. Seed a super-admin account

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

### 4. Start everything

```bash
# From the project root — starts all three apps
npm run dev
```

Or start services individually:

```bash
npm run dev:admin       # Admin app only
npm run dev:customer    # Customer app only
cd apps/backend && php artisan serve   # API only
```

## Scripts

All scripts are run from the **project root**:

| Script                   | Description                            |
| ------------------------ | -------------------------------------- |
| `npm run dev`            | Start all apps in parallel (Turborepo) |
| `npm run dev:admin`      | Start admin app only                   |
| `npm run dev:customer`   | Start customer app only                |
| `npm run build`          | Build all apps                         |
| `npm run build:admin`    | Build admin app only                   |
| `npm run build:customer` | Build customer app only                |
| `npm run lint`           | Lint all apps                          |

## Environment Variables

### Frontend apps (`apps/admin-app/.env` & `apps/customer-app/.env`)

| Variable       | Default                 | Description          |
| -------------- | ----------------------- | -------------------- |
| `VITE_API_URL` | `http://localhost:8000` | Backend API base URL |

### Backend (`apps/backend/.env`)

See [`apps/backend/.env.example`](apps/backend/.env.example) for the full list. Key variables:

| Variable               | Description                      |
| ---------------------- | -------------------------------- |
| `APP_DEBUG`            | `false` in production            |
| `APP_URL`              | Your production domain           |
| `DB_*`                 | Database connection credentials  |
| `CORS_ALLOWED_ORIGINS` | Comma-separated frontend origins |

## License

Private — all rights reserved.
