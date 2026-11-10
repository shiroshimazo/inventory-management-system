# Inventory Management System

A responsive admin dashboard and inventory management front-end built with React, TypeScript, Vite, and shadcn/ui. It ships with an inventory dashboard, authentication screens, form layouts, data tables, and user settings that you can reuse as building blocks for products, stock, suppliers, and purchase orders.

> The current codebase is a frontend-only single-page application. There is no backend or database yet; all data is mock data in the source files. A backend (for example Supabase/PostgreSQL) is planned.

## Features

### Implemented

- **Admin shell** — collapsible sidebar, sticky header with breadcrumbs, footer, scroll-to-top
- **Dashboard** — statistics cards, product insights, total earnings, sales metrics charts, transactions table
- **Data tables** — basic, pinnable columns, and filters (TanStack Table)
- **Forms** — vertical and horizontal layouts, validation demos (React Hook Form + Zod)
- **Authentication screens** — login, register, forgot password, verify email, reset password, two-step verification (UI only)
- **User settings** — general and workspace tabs
- **Theming** — light / dark / system mode with next-themes
- **Custom 404 page**

### Planned

Product CRUD, categories, stock tracking with low-stock alerts, sales / stock-out, suppliers, purchase orders, reports, user management, and role-based access control.

## Tech Stack

| Layer                 | Choice                               |
| --------------------- | ------------------------------------ |
| Frontend              | React 19 + TypeScript                |
| Build tool            | Vite 6                               |
| Routing               | TanStack Router                      |
| Styling               | Tailwind CSS 4 + shadcn/ui (Base UI) |
| State / data fetching | TanStack Query                       |
| Tables                | TanStack Table                       |
| Forms                 | React Hook Form + Zod                |
| Charts                | Recharts                             |
| Icons                 | Hugeicons + Lucide                   |
| Theming               | next-themes                         |
| Package manager       | npm                                  |

## Project Structure

```
src/
├── main.tsx              # React entry point
├── router.tsx            # TanStack Router + QueryClient
├── routeTree.gen.ts      # Generated route tree (auto-generated)
├── index.css             # Tailwind CSS + theme tokens
├── assets/               # SVGs and static assets
├── components/
│   ├── layout/           # Sidebar, Header, Footer, BlankLayout, ModeToggle
│   ├── shared/           # Logo, ProfileDropdown, LanguageDropdown
│   ├── motion/           # Animated sidebar primitives
│   ├── ui/               # shadcn/ui primitives
│   ├── Providers.tsx
│   ├── ThemeProvider.tsx
│   └── NotFound.tsx
├── configs/              # navConfig, navIcons, themeConfig
├── hooks/                # use-pagination, use-mobile
├── lib/                  # utilities and easing helpers
├── routes/               # File-based routes (admin shell + auth)
└── views/                # Page-level UI
```

## Getting Started

### Prerequisites

- Node.js 20.17+, 22.9+, or 24+
- npm 11.16+ (install-script approvals are configured in `package.json`)

### Installation

```bash
npm install
```

For a clean install using the committed lockfile, run `npm ci`.
Add development packages with `npm install <package> -D`.
Router compatibility overrides and approved install scripts are defined in `package.json`.
Keep `@tanstack/router-plugin` pinned to `1.120.0` to match the router and generator versions.

### Development

```bash
npm run dev
```

The app is available at http://localhost:3000.

### Development annotations

Agentation appears in the bottom-right corner during development and is excluded from production builds.
To sync annotations with your coding agent, connect its Agentation MCP integration to `npx -y agentation-mcp server`.
The toolbar connects to `http://localhost:4747`; use the same server and port for the MCP integration.
Click the toolbar, select an element, and add a note. Ask your agent to read pending annotations to confirm the connection.
Copying feedback also works without the MCP server.

### Production build

```bash
npm run build
npm run preview
```

## Available Commands

| Command             | Action                                                          |
| ------------------- | --------------------------------------------------------------- |
| `npm run dev`          | Start the Vite dev server on port 3000                          |
| `npm run build`        | Create an optimized production build with TypeScript checks     |
| `npm run preview`      | Preview the production build locally                            |
| `npm run lint`         | Run ESLint                                                      |
| `npm run lint:fix`     | Run ESLint and fix problems                                     |
| `npm run format`       | Format source files with Prettier                               |
| `npm run check-types`  | Run TypeScript type checking                                    |
| `npm run clean`        | Remove `dist` and `node_modules`                                |

## Documentation

Detailed documentation lives in [`inventory-management-system-docs/`](inventory-management-system-docs/):

- [Project Overview](inventory-management-system-docs/Project%20Overview/Project%20Overview.md)
- [Architecture](inventory-management-system-docs/Project%20Overview/Architecture.md)
- [Features](inventory-management-system-docs/Project%20Overview/Features.md)
- [User Roles & Permissions](inventory-management-system-docs/Project%20Overview/User%20Roles%20%26%20Permissions.md)
- [Pages & Navigation](inventory-management-system-docs/Project%20Overview/Pages%20%26%20Navigation.md)
- [Glossary](inventory-management-system-docs/Project%20Overview/Glossary.md)

## Deployment

The app builds to static files in `dist/`. Serve `index.html` for unknown application paths so direct links and refreshes work (SPA fallback).

## License

Licensed under the [MIT License](LICENSE.md). Copyright (c) 2026 shadcn/studio.

Built on the [AdminCN](https://shadcnstudio.com/templates/admin-dashboard-free/admincn) free template from [shadcn/studio](https://shadcnstudio.com/).
