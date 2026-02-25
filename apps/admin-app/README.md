# The Bridge Menu — Admin App

Internal admin dashboard for managing the restaurant menu, processing orders, and team administration.

## Tech Stack

- **React 19** + **TypeScript 5.9** — UI framework
- **Vite 7** — Build tool & dev server
- **Tailwind CSS 4** — Styling
- **TanStack React Query** — Data fetching & caching
- **React Router DOM** — Client-side routing
- **Framer Motion** — Animations
- **Lucide React** — Icons
- **Axios** — HTTP client
- **@the-bridge-menu/shared-types** — Shared TypeScript types (monorepo package)

## Features

| Feature              | Description                                                                      |
| -------------------- | -------------------------------------------------------------------------------- |
| **Dashboard**        | View all menu categories and items, create/edit/delete items with image upload   |
| **Orders**           | Real-time pending order queue with 10s auto-refresh, clear orders when fulfilled |
| **Categories**       | Create, rename, and delete categories (with cascading item deletion)             |
| **Settings**         | Change your password with complexity enforcement                                 |
| **Admin Management** | Super-admins can add/remove admin accounts with branded confirmation modals      |
| **Audit Logs**       | Super-admins can view a paginated history of all CRUD actions                    |
| **Auth**             | Token-based login via Laravel Sanctum (24h expiry)                               |

## Project Structure

```
src/
├── api/
│   └── adminApi.ts          # Axios client & all API functions
├── components/
│   └── MenuItemFormModal.tsx # Create/edit/delete menu item modal
├── pages/
│   ├── LoginPage.tsx         # Authentication page
│   ├── DashboardPage.tsx     # Main dashboard with menu management
│   ├── OrdersView.tsx        # Order queue & history
│   ├── AuditLogsView.tsx     # Audit trail viewer
│   └── SettingsPage.tsx      # Password & team management
├── App.tsx                   # Router & route definitions
└── main.tsx                  # React entry point
```

## Getting Started

This app is part of a monorepo. From the **root** of the project:

```bash
# Install all dependencies
npm install

# Start all apps (admin + customer + backend)
npm run dev

# Or start only the admin app
npm run dev:admin
```

The admin app runs on **http://localhost:5173** by default.

## Environment Variables

Create a `.env` file in the admin-app directory (or set at monorepo root):

| Variable       | Default                 | Description          |
| -------------- | ----------------------- | -------------------- |
| `VITE_API_URL` | `http://localhost:8000` | Backend API base URL |

## Build

```bash
# From monorepo root
npm run build:admin

# Or from this directory
npm run build
```

Output is generated in `dist/`.
