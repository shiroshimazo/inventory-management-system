## Routes

| Route                                    | Layout      | Page                                                |
| ---------------------------------------- | ----------- | --------------------------------------------------- |
| `/`                                      | —           | Redirects to `/dashboard`                            |
| `/dashboard`                             | Admin shell | Inventory dashboard                                 |
| `/datatable`                             | Admin shell | Data table demos (basic, pinnable columns, filters) |
| `/forms/form-layouts/vertical`           | Admin shell | Vertical form layout                                |
| `/forms/form-layouts/horizontal`         | Admin shell | Horizontal form layout                              |
| `/forms/form-validation`                 | Admin shell | Form validation demos                               |
| `/pages/user-settings?setting=general`   | Admin shell | User settings — general                             |
| `/pages/user-settings?setting=workspace` | Admin shell | User settings — workspace                           |
| `/login`                                 | Blank       | Username login UI preview                           |
| `/forgot-password`                       | Blank       | Three-step password recovery UI preview             |
| `*` (unknown)                            | Root        | 404 page (no sidebar, no breadcrumb)                |

## Sidebar Navigation

The sidebar is defined in `src/configs/navConfig.tsx` and grouped as follows:

Planned modules appear as disabled items with a `Planned` badge and no link until their routes exist.
The data table and form demo routes remain available by URL but are not shown in the sidebar. The old `/pages/auth/*` demos have been removed and show the 404 page.

### Overview

- Dashboard → `/dashboard`

### Inventory

- Products (planned)
- Categories (planned)

### Sales

- Sales / Stock-Out (planned)

### Purchasing

- Suppliers (planned)
- Purchase Orders (planned)

### Reports

- Reports (planned)

### Account

- User Settings
  - General → `/pages/user-settings?setting=general`
  - Workspace → `/pages/user-settings?setting=workspace`
- User Management (planned)

## Header

- Sidebar collapse trigger
- Breadcrumb generated from the current path
- Mode toggle (light / dark / system)
- Language dropdown
- Profile dropdown

## Layout Behavior

- **Admin shell (`_pages`):** sidebar + header + page content + footer.
- **Blank shell (`_auth`):** centered content with no sidebar or header, used by authentication pages.
- **Root:** wraps all routes with theme, tooltip, and sidebar providers, plus the toaster and scroll-to-top.

## 404 Page

- Any URL that does not match a route shows the 404 page.
- The 404 page renders at the root level: no sidebar and no breadcrumb trail for a page that does not exist.
- It offers one action, `Go back to home`, which returns to `/dashboard`.
