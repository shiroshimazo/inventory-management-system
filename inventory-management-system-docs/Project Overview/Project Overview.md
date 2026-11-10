A web-based portfolio project for tracking stock, managing suppliers, recording sales, and generating reports.

## 1. Project Summary

The Inventory Management System (IMS) is a web application that helps a small business keep accurate records of its products and stock levels. It replaces manual spreadsheets with a central system where staff can add items, record stock movements, place orders with suppliers, and view reports. Access is controlled by user roles so that admins and staff only see what they need.

## 2. Objectives

- Track products and stock quantities in real time.
- Reduce stock-outs and overstocking through low-stock alerts.
- Record stock-in (purchases) and stock-out (sales) transactions.
- Manage suppliers and purchase orders in one place.
- Provide simple reports to support decision-making.
- Demonstrate full-stack skills: authentication, CRUD, relational database design, and reporting.

## 3. Target Users

|   |   |   |
|---|---|---|
|Role|Description|Main Access|
|Admin|Owner or manager|Everything: users, products, suppliers, orders, reports|
|Staff|Store or warehouse employee|View and update stock, record sales, view limited reports|

## 4. Core Features

### 4.1 Basic Stock Tracking

- Add, edit, delete, and search products.
- Product details: name, SKU, category, unit price, quantity, reorder level.
- Low-stock indicator when quantity falls below the reorder level.
- Category management and filtering.

### 4.2 User Roles and Login

- Secure login and logout with hashed passwords.
- Role-based access control (Admin and Staff).
- Admin can create, edit, and deactivate user accounts.
- Basic profile and change-password page.

### 4.3 Sales / Stock-Out and Reports

- Record sales that automatically reduce stock.
- Stock movement history (who changed what, and when).
- Reports: current inventory, low-stock items, sales summary by date range, top-selling products.
- Export reports to CSV or PDF (optional stretch goal).

### 4.4 Suppliers and Purchase Orders

- Manage supplier records: name, contact person, phone, email, address.
- Create purchase orders with multiple items.
- Order statuses: Pending, Ordered, Received, Cancelled.
- Marking an order as Received automatically increases stock.

## 5. Suggested Pages

1. Login
2. Dashboard (totals, low-stock alerts, recent activity)
3. Products list and product form
4. Categories
5. Sales / stock-out entry and history
6. Suppliers list and form
7. Purchase orders list and form
8. Reports
9. User management (Admin only)

## 6. Main Data Entities

|   |   |
|---|---|
|Entity|Key Fields|
|Users|id, name, email, password_hash, role, status|
|Categories|id, name|
|Products|id, name, sku, category_id, price, quantity, reorder_level|
|Suppliers|id, name, contact_person, phone, email, address|
|Purchase Orders|id, supplier_id, status, order_date, received_date, created_by|
|Purchase Order Items|id, purchase_order_id, product_id, quantity, unit_cost|
|Sales|id, sale_date, total, created_by|
|Sale Items|id, sale_id, product_id, quantity, unit_price|
|Stock Movements|id, product_id, type (in/out/adjust), quantity, reference, user_id, date|

## 7. Basic System Flow

1. User logs in and is routed by role.
2. Admin sets up categories, products, and suppliers.
3. Admin or staff creates a purchase order for low-stock items.
4. When goods arrive, the order is marked Received and stock increases.
5. Staff records sales, and stock decreases.
6. Every change is logged as a stock movement.
7. Admin reviews the dashboard and reports.

## 8. Tech Stack

The current codebase is a frontend-only React single-page application. There is no backend or database yet; all data is mock data in the source files. A backend and hosting setup are planned.

| Layer                | Choice                                        |
| -------------------- | --------------------------------------------- |
| Frontend             | React 19 + TypeScript                         |
| Build tool           | Vite 6                                        |
| Routing              | TanStack Router                                |
| Styling              | Tailwind CSS 4 + shadcn/ui (Base UI)          |
| State / data fetching| TanStack Query                                 |
| Tables               | TanStack Table                                 |
| Forms                | React Hook Form + Zod                          |
| Charts               | Recharts                                       |
| Icons                | Hugeicons + Lucide                             |
| Theming              | next-themes                                   |
| Backend and database | Not implemented yet (planned: Supabase / PostgreSQL) |
| Hosting              | Not deployed yet (static hosting planned)      |

## 9. Scope

**In scope:** product CRUD, roles and login, sales, stock history, suppliers, purchase orders, basic reports.

**Out of scope (for now):** barcode scanning, multi-branch or multi-warehouse support, payment processing, mobile app.