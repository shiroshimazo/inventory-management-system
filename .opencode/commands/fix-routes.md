---
description: Find and fix routes whose URL no longer matches the page they show
agent: general
---

Read every file in `ai-workflow/` before writing anything. Then fix the wrong routes in this
project.

## How this project routes

| Concern                    | File                                                |
| -------------------------- | --------------------------------------------------- |
| Route files (file-based)   | `src/routes/` (TanStack Router)                      |
| Generated route tree       | `src/routeTree.gen.ts` — never edit by hand          |
| Sidebar links              | `src/configs/navConfig.tsx`                          |
| Logo / home link           | `src/configs/themeConfig.tsx`                        |
| `/` redirect               | `src/routes/index.tsx`                               |
| Header breadcrumb          | `src/components/layout/Header.tsx` (built from URL) |
| Route reference table      | `inventory-management-system-docs/Project Overview/Pages & Navigation.md` |

## The bug to look for

A page can live at a URL that does not match its name. The breadcrumb is generated from the
URL segments, so the page you are on shows the wrong crumb, and the sidebar highlights the
wrong entry. Example: the Inventory dashboard file was `src/routes/_pages/dashboard/orders.tsx`,
so the URL was `/dashboard/orders` and the breadcrumb read "Dashboard / Orders" while the
page itself was the Dashboard.

## Steps

1. List every route in `src/routes/` with the URL it serves and the page it renders.
2. Compare each URL against the page's `h1`, the sidebar label in `navConfig.tsx`, and the
   table in `Pages & Navigation.md`.
3. For each mismatch, rename the route file to the path that matches the page, following the
   file-based rules: a leading `_` segment is a pathless layout (`_pages/`, `_auth/`), a file
   `foo.tsx` serves `/foo`, and `foo/index.tsx` serves `/foo` as well.
4. Update the `createFileRoute(...)` id in the renamed file to the new route id.
5. Update every reference to the old URL: `navConfig.tsx`, `themeConfig.tsx`, the redirect in
   `src/routes/index.tsx`, and the route table in the docs.
6. Regenerate `src/routeTree.gen.ts` by running `npx vite build` (the TanStack Router Vite
   plugin writes the file before the build). Do not hand-edit it.
7. Verify with `npm run check-types` and `npm run lint`.

## Rules

- Renaming is the default fix. Do not delete a route file unless I name it in `$ARGUMENTS`.
- Do not touch `src/routeTree.gen.ts` by hand.
- Keep the sidebar, the redirect, and the docs in sync with the new URL.
- Report every route you changed, the old URL, the new URL, and the files you touched.

$ARGUMENTS
