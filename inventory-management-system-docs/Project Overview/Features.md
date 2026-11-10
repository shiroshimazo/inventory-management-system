# Features

## Implemented (UI)

### Layout and Shell

- Collapsible sidebar with icon-only mode and mobile drawer
- Sticky header with dynamic breadcrumbs
- Mode toggle (light / dark / system)
- Language dropdown and profile dropdown (UI only)
- Footer and scroll-to-top behavior
- Custom 404 page

### Dashboard (`/dashboard/orders`)

- Statistics cards (shipped orders, damaged returns, missed delivery slots)
- Product insights widget
- Total earnings widget with trend and comparison
- Sales metrics chart (bar and pie charts via Recharts)
- Transactions data table with status badges

### Data Tables (`/datatable`)

- Basic data table
- Pinnable columns
- Data table with filters

### Forms

- Vertical form layout (`/forms/form-layouts/vertical`)
- Horizontal form layout (`/forms/form-layouts/horizontal`)
- Validation demos for `onChange`, `onBlur`, `onSubmit`, and `onTouched` modes (React Hook Form + Zod)

### Authentication Screens (UI only)

- Login, Register, Forgot Password, Verify Email, Reset Password, Two Steps Verification
- Static "Login as User" / "Login as Admin" buttons (no real authentication yet)

### User Settings (`/pages/user-settings`)

- General: personal info, email and password, social URLs, connected accounts, danger zone
- Workspace settings
- Tab state kept in the `setting` search parameter so browser back/forward works

## Planned

| Module | Description | Status |
|---|---|---|
| Authentication | Real login, logout, hashed passwords, role-based access | To build |
| Product management | Add, edit, delete, search products; SKU, category, price, quantity, reorder level | To build |
| Categories | Category management and filtering | To build |
| Stock tracking | Real-time quantities, low-stock alerts, stock movement history | To build |
| Sales / stock-out | Record sales that reduce stock automatically | To build |
| Suppliers | Supplier records: name, contact person, phone, email, address | To build |
| Purchase orders | Multi-item orders with Pending / Ordered / Received / Cancelled statuses; receiving increases stock | To build |
| Reports | Current inventory, low-stock items, sales summary by date range, top-selling products; CSV/PDF export | To build |
| User management | Admin can create, edit, and deactivate user accounts | To build |
| Roles and permissions | Enforce Admin vs Staff access on routes and actions | To build |

## Feature Status Summary

| Area | Status |
|---|---|
| Admin shell / layout | Implemented |
| Dashboard | Implemented (mock data) |
| Data tables | Implemented (mock data) |
| Forms and validation | Implemented |
| Authentication UI | Implemented |
| Authentication logic | Not implemented |
| Inventory modules | Not implemented |
| Reports | Not implemented |
| Backend / database | Not implemented |
