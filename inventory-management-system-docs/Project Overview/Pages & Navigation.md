# Pages & Navigation

## Routes

| Route | Layout | Page |
|---|---|---|
| `/` | — | Redirects to `/dashboard/orders` |
| `/dashboard/orders` | Admin shell | Inventory dashboard |
| `/datatable` | Admin shell | Data table demos (basic, pinnable columns, filters) |
| `/forms/form-layouts/vertical` | Admin shell | Vertical form layout |
| `/forms/form-layouts/horizontal` | Admin shell | Horizontal form layout |
| `/forms/form-validation` | Admin shell | Form validation demos |
| `/pages/user-settings?setting=general` | Admin shell | User settings — general |
| `/pages/user-settings?setting=workspace` | Admin shell | User settings — workspace |
| `/pages/auth/login` | Blank | Login |
| `/pages/auth/register` | Blank | Register |
| `/pages/auth/forgot-password` | Blank | Forgot password |
| `/pages/auth/verify-email` | Blank | Verify email |
| `/pages/auth/reset-password` | Blank | Reset password |
| `/pages/auth/two-steps` | Blank | Two-step verification |
| `*` (unknown) | Root | Custom 404 page |

## Sidebar Navigation

The sidebar is defined in `src/configs/navConfig.tsx` and grouped as follows:

### Overview

- Dashboard → `/dashboard/orders`
- Data Table → `/datatable`

### Forms

- Form Layouts
  - Vertical Layout → `/forms/form-layouts/vertical`
  - Horizontal Layout → `/forms/form-layouts/horizontal`
- Form Validation → `/forms/form-validation`

### Account

- User Settings
  - General → `/pages/user-settings?setting=general`
  - Workspace → `/pages/user-settings?setting=workspace`
- Authentication
  - Login → `/pages/auth/login`
  - Register → `/pages/auth/register`
  - Forgot Password → `/pages/auth/forgot-password`
  - Verify Email → `/pages/auth/verify-email`
  - Reset Password → `/pages/auth/reset-password`
  - Two Steps → `/pages/auth/two-steps`

## Header

- Sidebar collapse trigger
- Breadcrumb generated from the current path
- Mode toggle (light / dark / system)
- Language dropdown
- Profile dropdown

## Layout Behavior

- **Admin shell (`_pages`):** sidebar + header + page content + footer.
- **Blank shell (`_auth`):** centered content with no sidebar or header, used by authentication pages.
- **Root:** wraps all routes with theme, tooltip, and sidebar providers, plus the toaster, scroll-to-top, and 404 handling.
