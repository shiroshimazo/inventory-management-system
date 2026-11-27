# Login UI

The app is a frontend-only React SPA using TanStack Router, shadcn/ui, and existing light/dark tokens in `src/index.css`.

The `/login` page uses the blank auth layout, a compact bordered surface, existing typography, and Hugeicons. No decorative assets or new tokens are needed. The old authentication demos at `/pages/auth/*` have been removed and now show the existing 404 page.

The form validates on blur and submit. For this UI preview, usernames use 3–20 letters, numbers, or underscores and start with a letter. Passwords use 8–128 characters and cannot contain only spaces. Password values are never trimmed. These provisional constraints must match the backend when authentication is added.

Submit shows a preview notice without sending or storing credentials.

## Password recovery preview

`/forgot-password` has three steps: email, a six-box verification code, and new/confirm password. The public preview code is `123456`; it is displayed on the verification step. No email is sent, no account is checked, and no password is saved. Completion clears the form and explicitly confirms that no password changed. Real recovery requires server verification before enabling any password update.

The page matches the login surface, typography, spacing, and light/dark tokens to keep account screens consistent. A single bordered surface groups the task; the primary button identifies the next action. A vertical three-step stepper sits left of the form on wide screens and switches to a compact horizontal stepper above the form below `xl`. The stepper shows progress only; its steps do not navigate. The verification step uses a six-slot animated OTP input. The new-password field has a show/hide toggle and a live strength meter with a four-rule checklist. Existing error icons identify validation failures. Motion is limited to input feedback and respects reduced motion. Design direction: calm inventory administration, energy 1 / rhythm 1 / motion 1.

Validation runs on blur and submit, then updates touched fields as users type. Passwords use 12–128 characters and must include upper and lowercase letters, a number, and a symbol. They preserve spaces exactly, reject repeated characters and a small common-password list, and cannot equal the email. These are provisional UI rules, not production authentication controls. All state stays in component memory and resets on reload.

## Dashboard preview

`/dashboard` uses the Borderline tokens from `ai-workflow/09-DESIGN-TOKENS.md`, defined once in `src/index.css` under `.borderline`. The light palette is the default. The dark palette applies under `.dark`. Cards and the chart tooltip use a double border (outer plus inset inner line), a subtle surface gradient, and the shared radius token. Stock movement badges use the Borderline chip style. The page heading uses `text-3xl`. In both themes the admin shell (header, sidebar, content area) also uses the Borderline page background.

Visible tables across the admin panels and demos use the rounded surface, double border, plain headers, and compact rows from Recent stock movements. Wide data tables scroll within their panel.

KPI cards use the same Borderline surfaces and trend colors on Dashboard, Reports, Products, Categories, Sales, Purchase Orders, and Suppliers. Counts and rates use lines, and currency totals use gradient areas. Each sparkline has 24 mock points anchored to the current summary value. The badge shows change across the series. Hover or keyboard scrubbing moves a gradient crosshair with a quick spring and updates cards in the same visible row. Leaving the chart restores the latest value.

## Products preview

`/products` displays 12 static fruit products inside the admin shell. Search matches names and categories, ignoring case and surrounding spaces. Fruit, category, price, and stock headers sort the table; fruit starts ascending. Stock badges derive from quantity and reorder level. Clearing search keeps filters and sorting and focuses the search field. Separate Category and Status dropdowns beside search apply immediately. The Price button opens inclusive price-per-kg limits; applying or resetting price preserves category and status. Invalid price ranges show an error. Reset price preserves search; Clear all in the empty state resets both. The Actions column after Status edits or removes products in memory. No backend, persistence, or pagination is included.

The visual direction is a restrained inventory list using existing tokens, table primitives, and badges. The search and filters sit above the table panel. Price (USD per kg), Kg (total weight), and Stock (mock item count) are separate columns. Stock status uses item counts and reorder counts; item counts are illustrative, not calculated from weight. Search uses a focus border without a glow. All seven columns remain visible through the table's horizontal scroll wrapper. Existing light and dark themes apply.

The toolbar Reset button clears search and all filters, preserves sorting, and focuses search. Product status badges use 6px corners, green for In stock, orange for Low stock, and the existing destructive style for Out of stock. Text labels retain the status meaning in both themes.

Borderline cards above the filters show fruit product count, total stock units, and separate counts for In stock, Low stock, and Out of stock. The cards summarize the full Products catalogue and update when products are added, edited, or removed.


Add Products opens a responsive three-step dialog (Details, Stock & price, Review) using the existing theme and components. React Hook Form and Zod validate required fields and case-insensitive SKU uniqueness. Text fields use a borderless resting style with visible focus and error borders. Numeric fields filter input: price accepts digits only, weight accepts up to two decimals, and quantity and reorder level accept whole numbers. Products and drafts stay in memory: closing resets the draft, successful additions update the filtered/sorted table and show a toast, and refresh restores the 12 mock rows. Active filters can hide a new product. A real backend must revalidate every field and enforce SKU uniqueness.

## Categories preview

`/categories` mirrors the restrained Products list with existing tokens, thin borders, and border-only input focus. Seven mock categories support name/description search, name/product-count sorting, and in-memory add, edit, and confirmed removal. Names use 2-40 characters and case-insensitive uniqueness; optional descriptions allow 120 characters. Counts derive from the original fruit products and are illustrative. Products are unchanged. Nothing persists; reload restores the seed rows.

The Status column displays Active or Inactive badges using the existing Users status style. Add and edit forms include a status choice. Existing and new categories start Active, and edits preserve the selected status. Status stays in component memory and resets on reload.

Four Borderline cards above search show total categories, Active categories, Inactive categories, and total products, with Hugeicons matching the Products summary. They summarize all current categories and update after add, edit, or removal. Total products sums the table's existing per-category product counts, including inactive categories. Search does not change the summary.

## Sales preview

`/sales` shows six seed sales, SO-2026-111 through SO-2026-116. Search matches reference, product, SKU, and recorded-by name. Date and total sort; All dates, Today, Last 7 days, and Last 30 days use Asia/Manila dates. A two-step form records immutable sales with name, SKU, and price snapshots. Totals derive from lines. `SalesSchema.ts` validates quantities and re-checks stock before deducting from a local product copy. Seed history is not replayed against stock. Products and dashboard data remain separate.

Preview assumption: catalogue `pricePerKg` is treated as the per-item PHP price on sale lines. Nothing persists; reload restores sales and stock. There is no authentication or server validation. A backend must atomically validate and deduct stock. All matching rows render without pagination.

Design direction: calm inventory administration, energy 1 / rhythm 1 / motion 1.

## Suppliers preview

`/suppliers` shows seven mock suppliers with search across all contact fields, digit-only phone search, and name/contact sorting. Add, edit, and confirmed removal use component memory; reload restores the seed rows. Names and contacts use 2?60 characters, phones require at least seven digits within 20 characters, emails allow 254 characters, and addresses use 5?160 characters. Names are unique ignoring case and surrounding spaces. No backend, persistence, or pagination is included.

The page follows the restrained Categories layout with existing tokens and border-only input focus. Workflow rules take precedence: the page heading uses `text-3xl`, and unsupported typed or pasted characters are rejected with field feedback. Server validation and Admin-manages/Staff-views permissions remain future work.

Separate Borderline cards above search show total suppliers, unique phone numbers by digits, and unique emails ignoring case. Cards summarize all current supplier records, including those hidden by search.

## Purchase orders preview

`/purchase-orders` uses four seed orders with Draft, Ordered, Received, and Cancelled statuses. Search matches reference and supplier; all data columns sort. Clear all resets search, status, and the default newest-order-date sorting. All matching rows render without pagination.

Add and edit use existing supplier and product seed catalogues, independently of edits on other pages. Each order requires at least one unique product, whole-number quantities from 1 to 1,000,000, and PHP unit costs from 0.01 to 1,000,000 with at most two decimals. Costs are entered independently of catalogue sale prices. Totals use integer centavos. Dates are Asia/Manila calendar dates in YYYY-MM-DD format; expected dates cannot precede order dates. New references use the current Manila year and a sequence that is not reused after removal during the mounted session.

The visual direction is a restrained inventory list using the existing Borderline tokens, table primitives, Hugeicons, and badges. Page headings use text-3xl; responsive forms use borderless resting fields with visible focus and error borders. No new dependencies or shared page restyling are needed.

This is a frontend-only mock preview. State stays in component memory and resets on reload or page remount. There is no backend, persistence, pagination, or authentication. Received changes status only and never updates stock. Server validation, permissions, and atomic stock updates remain future work. No network loading state is simulated; submitting disables Save order while validation runs, errors remain beside fields, and successful saves and removals show a toast.
