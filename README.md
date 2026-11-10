## React migration status

The active entry point is `src/main.tsx`, using Vite and TanStack Router. Routes under `src/routes/_pages` share the admin layout; routes under `src/routes/_auth` keep the original `/pages/auth/*` URLs. User settings use the `setting` search parameter, including browser back/forward navigation.

Run `pnpm install --no-frozen-lockfile`, `pnpm build`, and `pnpm lint`. Vite generates `src/routeTree.gen.ts` before TypeScript runs. Use `pnpm dev` for development and `pnpm preview` to preview `dist`. Production hosting must serve `index.html` for unknown application paths so direct links and refreshes work.

Dependency installation, the production build (including TypeScript), and ESLint pass. Browser interaction testing is still pending. Vite reports a non-blocking warning for the main JavaScript chunk exceeding 500 kB. The workspace explicitly allows the esbuild install script and pins the router tooling dependencies to versions compatible with TanStack Router 1.120.0.

The original `src/app` and Next.js configuration remain inactive as migration reference files. `migration-backup.zip` contains the source and configuration from before this continuation. To roll back this continuation, restore that archive and remove the new route layout directories and `src/components/NotFound.tsx`; the archive restores the earlier partial migration, not a verified Next.js release.

---

﻿<p align="center">
   <a href="https://shadcnstudio.com/templates/admin-dashboard-free/admincn" target="_blank">
      <img src="https://cdn.shadcnstudio.com/ss-assets/logo/logo.png" alt="admincn-logo" width="32px" height="32px">
   </a>
</p>

<h1 align="center">
   <a href="https://shadcnstudio.com/templates/admin-dashboard-free/admincn" target="_blank" align="center">
      AdminCN - Free Shadcn Admin Dashboard Template
   </a>
</h1>

<p align="start">A responsive Next.js inventory management admin built with Shadcn UI and Tailwind CSS. It ships with an inventory dashboard, authentication pages, form layouts, and data tables you can reuse as building blocks for products, stock, warehouses, and purchase orders.</p>

![GitHub](https://img.shields.io/github/license/shadcnstudio/shadcn-nextjs-admincn-admin-template-free) ![GitHub issues](https://img.shields.io/github/issues/shadcnstudio/shadcn-nextjs-admincn-admin-template-free) ![GitHub closed issues](https://img.shields.io/github/issues-closed/shadcnstudio/shadcn-nextjs-admincn-admin-template-free) ![Twitter Follow](https://img.shields.io/twitter/follow/ShadcnStudio?style=social)

<kbd>[![AdminCN Free - Demo Screenshot](https://cdn.shadcnstudio.com/ss-assets/landing-page/admin-dashboard-page/admin-dashboard-detail-page/admincn-free/readme-image.png)](https://shadcn-nextjs-admincn-admin-template-free.vercel.app/dashboard/orders)</kbd>

## Introduction ðŸ“Š
This project is built with Next.js, Shadcn UI, and Tailwind CSS, providing a production-ready admin shell for an inventory management system. It includes an inventory dashboard, authentication pages, form layouts, form validation, and data tables.

[View Demo](https://shadcn-nextjs-admincn-admin-template-free.vercel.app/dashboard/orders)

[View Documentation](https://shadcnstudio.com/docs/documentation-admin/getting-started)

<p>
   Supported by
   <a href="https://shadcnstudio.com" target="_blank">
      Shadcn Studio
   </a>
   , with a commitment to empowering the open-source community.
</p>

## Key Features âœ¨

- **Inventory Dashboard** - Dashboard layout with statistics, charts, and widgets
- **Authentication Pages** - Login, Register, Forgot Password, Verify Email, Reset Password, and Two Steps Verification
- **Forms & Tables** - Vertical & Horizontal form layouts, form validation, and data tables
- **Built with Next.js** - App Router based, fast, SEO-friendly React framework
- **Tailwind CSS v4** - Easy theming and utility-based styling
- **Responsive & Mobile-First** - Designed to look great on all devices
- **Shadcn UI Primitives** - Statistics, charts, and widgets included

## Folder Structure

```
|-- public/                                    # Static assets served from the site root
|   |-- images/                                # Public images, logos, and media
|-- src/                                       # Application source code
|   |-- app/                                   # Next.js App Router routes and layouts
|   |   |-- favicon.ico                        # Browser favicon
|   |   |-- globals.css                        # Tailwind CSS, CSS variables, and theme tokens
|   |   |-- layout.tsx                         # Root layout, fonts, metadata, and providers
|   |   |-- not-found.tsx                      # Custom 404 page
|   |   |-- (pages)/                           # Admin shell routes with sidebar and header
|   |   |   |-- dashboard/                      # Inventory dashboard
|   |   |   |-- pages/                          # User settings
|   |   |   |-- datatable/                      # Data table (reference for CRUD lists)
|   |   |   |-- forms/                          # Form layouts and validation
|   |   |-- (blank)/                           # Routes without the admin shell
|   |   |   |-- pages/auth/                     # Authentication screens
|   |-- assets/                                # Local data files, SVGs, and static helpers
|   |   |-- svg/                                # SVG assets used by the UI
|   |-- components/                            # Shared React components
|   |   |-- layout/                             # Sidebar, header, footer, and shell pieces
|   |   |-- shared/                             # Shared UI components
|   |   |-- ui/                                 # shadcn/ui primitives
|   |   |-- Providers.tsx                       # App provider wrapper
|   |   |-- ThemeProvider.tsx                   # Theme provider wrapper
|   |-- configs/                               # Template configuration files
|   |   |-- navConfig.tsx                       # Sidebar menu structure and icons
|   |   |-- themeConfig.ts                      # Theme config
|   |-- hooks/                                 # Reusable client hooks
|   |-- lib/                                   # General utilities and shared helpers
|   |-- utils/                                 # Feature-specific helper functions
|   |-- views/                                 # Page-level UI composed by route files
|   |   |-- dashboards/                        # Dashboard charts, statistics, and widgets
|   |   |-- datatables/                        # Data table views
|   |   |-- forms/                             # Form layout and validation views
|   |   |-- pages/                             # Auth and settings views
|-- components.json                            # shadcn/ui aliases and registry config
|-- eslint.config.mjs                          # ESLint configuration
|-- next.config.ts                             # Next.js configuration
|-- package.json                               # Scripts and dependencies
|-- postcss.config.mjs                         # Tailwind CSS v4 PostCSS setup
|-- tsconfig.json                              # TypeScript compiler and path aliases
```

**Key UI Sections**

- **Dashboard** - Inventory overview with statistics, charts, and widgets
- **Authentication** - Login, Register, and account recovery flows
- **Forms & Tables** - Layouts, validation, and data table views (building blocks for CRUD screens)
- **User Pages** - Account settings

---

## What's Included ðŸ“¦

- Dashboard
  - Inventory Dashboard
- Forms & Tables
  - Form Layouts (vertical, horizontal)
  - Form Validation
  - Data Table (basic, pinnable columns, filters)
- Authentication Pages
  - Login Page
  - Register Page
  - Forgot Password Page
  - Verify Email Page
  - Reset Password Page
  - Two Steps Verification Page
- Pages
  - User Settings (general, workspace)
- Components
  - shadcn/ui primitives
  - Statistics, Charts & Widgets

## Upcoming Inventory Modules

| Module | Route | Status |
| ------ | ----- | ------ |
| Dashboard | `/dashboard/orders` | Included |
| Products | `/inventory/products` | To build |
| Stock levels | `/inventory/stock` | To build |
| Warehouses | `/inventory/warehouses` | To build |
| Suppliers | `/inventory/suppliers` | To build |
| Purchase orders | `/inventory/purchase-orders` | To build |
| Stock movements | `/inventory/movements` | To build |
---

## Quick Start

### Prerequisites

- Node.js 18, 20, or 22+
- pnpm (recommended) or npm

### Installation

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

2. **Start the development server:**

   ```bash
   pnpm dev
   ```

   The site will be available at `http://localhost:3000`

3. **Build for production:**

   ```bash
   pnpm build
   ```

4. **Preview the production build:**

   ```bash
   pnpm start
   ```

## ðŸ§ž Available Commands

The template comes with several pre-configured scripts to help you with development, building, and maintaining your project. All scripts can be run using your package manager of choice (npm, pnpm, yarn, or bun) from the root of the project.

| Command       | Action                                                                                                                                 |
| :------------ | :------------------------------------------------------------------------------------------------------------------------------------- |
| `dev`         | Starts the Vite development server with hot-reload enabled. Your application will be available at http://localhost:3000/              |
| `build`       | Creates an optimized production build of your application. This command generates static files and optimizes your code for deployment. |
| `start`       | Preview production site locally. Use this to test your production build locally before deploying.                                      |
| `lint`        | Runs ESLint to check your code for potential errors and code quality issues. This helps maintain clean and consistent code.            |
| `lint:fix`    | Runs ESLint and automatically fixes problems where possible.                                                                           |
| `format`      | Formats all files using Prettier to ensure consistent code style.                                                                      |
| `clean`       | Cleans the project by removing temporary files and build artifacts.                                                                    |
| `check-types` | Checks TypeScript types to catch type errors before building or deploying.                                                             |

## ðŸŒ Deployment

Check out our [Deployment docs](https://shadcnstudio.com/docs/documentation-admin/deployment)

## Documentation ðŸ“š

For comprehensive documentation, please visit [shadcn/studio documentation](https://shadcnstudio.com/docs/documentation-admin/introduction).

## Changelog ðŸ“†

Please refer to the [CHANGELOG file](CHANGELOG.md). We will add a detailed release notes to each new release.

## License &copy;

- Copyright Â© [ShadcnStudio](https://shadcnstudio.com/)
- Licensed under [MIT](LICENSE)
- All our free items are Open Source and licensed under MIT. You can use our free items for personal as well as commercial purposes. We just need attribution from your end. Copy the link below and paste it in the footer of your web application or project.
  ```html
  <a href="https://shadcnstudio.com/">ShadcnStudio</a>
  ```

---

<br />

<a href="https://shadcnstudio.com" target="_blank">
  <img src="https://cdn.shadcnstudio.com/ss-assets/smm/marketing/shadcn-studio-smm-banner.png" alt="shadcn/studio banner" width="1200">
</a>

<p>
   <a href="https://shadcnstudio.com" target="_blank">
      shadcn/studio
   </a>
   is an open-source collection of copy-and-paste shadcn components, blocks, and templates - paired with a powerful theme generator & AI Tools to craft, customize, and ship faster. ðŸš€
</p>

## Overview ðŸŒ

**This isn&apos;t a traditional component library or a replacement for Shadcn**. Instead, it&apos;s a unique collection offers customizable variants of components, blocks, and templates. Preview, customize, and copy-paste them into your apps with ease.

Building on the solid foundation of the Shadcn components & blocks, we&apos;ve enhanced it with custom-designed components & blocks to give you a head start. This allows you to craft, customize, and ship your projects faster and more efficiently.

### Not a standard library, but a distribution of components

Following the philosophy of Shadcn, shadcn/studio isn&apos;t a conventional &quot;install-from-NPM&quot; library. Rather, it&apos;s an open-source distribution of components designed for maximum adaptability. You can copy the code, modify styles, adjust logic, or integrate it with other toolsâ€”free from the limitations of typical libraries. This &quot;open code&quot; model empowers you to customize with confidence and creativity.

## Why should I use shadcn/studio? ðŸ’¡

shadcn/ui aims to provide core components with a unique distribution system, allowing developers to copy and paste reusable, customizable UI elements directly into their codebase.

While this approach offers flexibility and control, it comes with some limitations: a lack of diverse component variants examples, limited theme customization options, and limited pre-built blocks. Additionally, its extensive customization options, though powerful, can sometimes feel overwhelming, especially for those seeking a more guided or streamlined experience.

## Community ðŸ¤

Join the shadcn/studio community to discuss the library, ask questions, and share your experiences:

- ðŸ¦ [Follow us on Twitter](https://x.com/ShadCNStudio)
- ðŸŽ® [Join us on Discord](https://discord.com/invite/kBHkY7DekX)

## Credits ðŸ¤˜

We are grateful for the contributions of the open-source community, particularly:

- [shadcn/ui](https://ui.shadcn.com/)
- [tweakcn](https://tweakcn.com/) (Our Theme Generator is heavily inspired by tweakcn)

These projects form the backbone of shadcn/studio, allowing us to build a powerful copy-and-paste components.

## Useful Links ðŸŽ

- [Shadcn Blocks](https://shadcnstudio.com/blocks)
- [Shadcn Templates](https://shadcnstudio.com/templates)
- [Shadcn Admin Dashboard](https://shadcnstudio.com/templates/admin-dashboard)
- [Shadcn Figma UI Kit](https://shadcnstudio.com/figma)
- [Shadcn Theme Generator](https://shadcnstudio.com/theme-generator)
- [Shadcn MCP Server](https://shadcnstudio.com/mcp)
- [Shadcn IDE Extension](https://shadcnstudio.com/ide-extension)
- [Shadcn Components](https://shadcnstudio.com/components)
- [Shadcn Figma to Code](https://shadcnstudio.com/figma-plugin)

## Social Media :earth_africa:

- [x](https://x.com/ShadcnStudio)
- [Discord](https://discord.com/invite/kBHkY7DekX)
- [YouTube](https://www.youtube.com/@themeselection)
