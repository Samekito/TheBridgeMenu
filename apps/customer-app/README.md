# The Bridge Menu — Customer App

Public-facing menu and ordering interface for restaurant guests. Customers browse the menu, add items to a cart, and submit orders directly to the kitchen.

## Tech Stack

- **React 19** + **TypeScript 5.9** — UI framework
- **Vite 7** — Build tool & dev server
- **Tailwind CSS 4** — Styling
- **TanStack React Query** — Data fetching & caching
- **React Router DOM** — Client-side routing
- **Framer Motion** — Page transitions & animations
- **Lucide React** — Icons
- **Axios** — HTTP client
- **@the-bridge-menu/shared-types** — Shared TypeScript types (monorepo package)

## Features

| Feature                | Description                                                                 |
| ---------------------- | --------------------------------------------------------------------------- |
| **Landing Page**       | Restaurant welcome page with animated entry                                 |
| **Menu Browser**       | Browse items grouped by category with search/filter, responsive grid layout |
| **Menu Cards**         | Image, price, description, and "Sold Out" badge for unavailable items       |
| **Cart**               | Slide-out cart sidebar with quantity controls and running total             |
| **Ordering**           | Submit orders with optional customer name and table number                  |
| **Order Confirmation** | Animated success state after order submission                               |
| **Persistent Cart**    | Cart state persisted to `localStorage` across page reloads                  |

## Project Structure

```
src/
├── api/
│   └── menuApi.ts       # Axios client for menu & order endpoints
├── components/
│   ├── MenuCard.tsx      # Individual menu item card
│   └── CartSidebar.tsx   # Slide-out cart panel with checkout form
├── context/
│   └── CartContext.tsx   # Cart state management with localStorage persistence
├── pages/
│   ├── LandingPage.tsx  # Welcome / hero page
│   └── MenuPage.tsx     # Menu browser with category tabs & search
├── App.tsx              # Router & route definitions
└── main.tsx             # React entry point with QueryClient & CartProvider
```

## Getting Started

This app is part of a monorepo. From the **root** of the project:

```bash
# Install all dependencies
npm install

# Start all apps (admin + customer + backend)
npm run dev

# Or start only the customer app
npm run dev:customer
```

The customer app runs on **http://localhost:5174** by default.

## Environment Variables

Create a `.env` file in the customer-app directory (or set at monorepo root):

| Variable       | Default                 | Description          |
| -------------- | ----------------------- | -------------------- |
| `VITE_API_URL` | `http://localhost:8000` | Backend API base URL |

## Build

```bash
# From monorepo root
npm run build:customer

# Or from this directory
npm run build
```

Output is generated in `dist/`.
