# User Roles & Permissions

## Current State

The codebase does **not** implement authentication or role-based access yet. The login screen shows static "Login as User" and "Login as Admin" buttons, and the login form only prevents the default submit behavior. No routes are protected and no role is enforced.

## Planned Roles

| Role | Description | Main Access |
|---|---|---|
| Admin | Owner or manager | Everything: users, products, suppliers, orders, reports |
| Staff | Store or warehouse employee | View and update stock, record sales, view limited reports |

## Permission Matrix (Planned)

| Permission | Admin | Staff |
|---|:---:|:---:|
| View dashboard | ✓ | ✓ |
| View products | ✓ | ✓ |
| Create / edit / delete products | ✓ | ✗ |
| Manage categories | ✓ | ✗ |
| View stock levels | ✓ | ✓ |
| Update stock quantities | ✓ | ✓ |
| View suppliers | ✓ | ✓ |
| Manage suppliers | ✓ | ✗ |
| Create purchase orders | ✓ | ✓ |
| Approve / receive purchase orders | ✓ | ✗ |
| Record sales | ✓ | ✓ |
| View stock movement history | ✓ | ✓ |
| View full reports | ✓ | ✗ |
| View limited reports | ✓ | ✓ |
| Manage users | ✓ | ✗ |
| Manage application settings | ✓ | ✗ |
| Edit own profile / password | ✓ | ✓ |

## Planned Enforcement

- **Route protection:** TanStack Router `beforeLoad` hooks will redirect unauthenticated users to the login page and block routes the role cannot access.
- **UI hiding:** Sidebar items and actions will be filtered by role.
- **Server enforcement:** The backend must re-check every request; hiding UI alone is not security.
