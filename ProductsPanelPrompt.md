# Products panel preview prompt

Copy everything under the line into your coding agent, working inside
`C:\Users\Jeremy\Documents\shadcn-nextjs-admincn-admin-template-free-1.0.0\inventory-management-system`.

---

## Task

Build a frontend-only Products preview at `/products`, inside the existing admin shell.

The panel contains:

- one search field that filters fruit products by name or category;
- sortable column headers for fruit, category, price, and stock;
- 12 hard-coded fruit products.

There is no backend, no CRUD, no pagination, and no extra filters.

---

## 1. Before you write code

1. Read every file in `ai-workflow/` in order: `00-README.md`, `01-Introduction.md`, `02-Process.md`, `03-Code-Standards.md`, `04-Security.md`, `05-Review-Checklist.md`, `06-Design-Rules.md`, `07-Validation-Rules.md`, `08-Visual-Design-Rules.md`. The `00-09` token in `AGENTS.md` refers to these nine files.
2. Read `context.md`, `inventory-management-system-docs/Project Overview/Pages & Navigation.md`, and `inventory-management-system-docs/Project Overview/Features.md`.
3. Read `src/routes/_pages/dashboard.tsx`, `src/views/dashboards/InventoryMockData.ts`, `src/views/datatables/filters/filters-datatable.tsx`, `src/components/ui/table.tsx`, `src/components/ui/input.tsx`, and `src/components/ui/badge.tsx`.
4. Start your reply with `Workflow read: 00-09 ✔`, then give a short plan before changing anything.

---

## 2. Ground truth about this project (do not guess)

- This is a **Vite 6 + React 19 + TanStack Router SPA**, not Next.js. `src/app/**`, `next.config.ts`, and `next-env.d.ts` are dead leftovers of the original template. **Do not use `next/image`, `next/font`, `next/link`, metadata exports, or `'use client'`.** Do not edit anything under `src/app/**`.
- **Never edit `src/routeTree.gen.ts`.** The TanStack Router Vite plugin generates it when the dev server or build runs.
- Path alias: `@/*` maps to `src/*`.
- Icons: **Hugeicons only.** Use `import { HugeiconsIcon } from '@/components/ui/hugeicons'` and icons from `@hugeicons/core-free-icons`. Do not introduce `lucide-react`.
- Tables: `@tanstack/react-table` v8 is already installed. Use it with the existing `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, and `TableCell` primitives.
- Inputs: `Input` is the existing Base UI wrapper. Do not replace it.
- Badges: use the existing `Badge` variants. Do not add success or warning tokens.
- Theme: Tailwind v4 CSS-first. All colours, spacing, typography, and radius values come from existing tokens in `src/index.css`. Do not add new tokens or inline colours.
- Prettier: no semicolons, single quotes, JSX single quotes, 120 print width, `arrowParens: 'avoid'`, Tailwind classes auto-sorted. Run `npm run format` at the end.
- Do not add any dependency.

---

## 3. Files

**Create**

| File | Purpose |
| --- | --- |
| `src/routes/_pages/products.tsx` | Thin route wrapper for `/_pages/products`. |
| `src/views/pages/products/ProductsPage.tsx` | Page header and panel layout. |
| `src/views/pages/products/ProductsTable.tsx` | Search field, table, sorting, empty state. |
| `src/views/pages/products/FruitProductsData.ts` | Fruit product type, 12 mock rows, and stock status helper. |

**Modify**

| File | Change |
| --- | --- |
| `src/configs/navConfig.tsx` | Turn the Products item into a real link to `/products`. Keep Categories planned. |
| `context.md` | Append a `## Products preview` section recording the behaviour and visual direction, as required by `08-Visual-Design-Rules.md`. Do not rewrite existing sections. |

**Do not touch:** `src/routeTree.gen.ts`, `src/app/**`, `src/components/ui/**`, `src/views/dashboards/**`, `src/views/datatables/**`, `src/views/pages/auth/**`, or any auth route.

---

## 4. Route and navigation

Route file:

```tsx
import { createFileRoute } from '@tanstack/react-router'
import ProductsPage from '@/views/pages/products/ProductsPage'

export const Route = createFileRoute('/_pages/products')({
  component: ProductsPage
})
```

In `src/configs/navConfig.tsx`, replace the disabled Products item with:

```tsx
{ icon: 'products', label: 'Products', href: '/products' }
```

The sidebar link must show the active state on `/products`. The header breadcrumb is generated from the path, so it shows `Products`; do not hard-code a breadcrumb.

---

## 5. Page layout

`ProductsPage.tsx` follows the dashboard page pattern:

```tsx
<section aria-labelledby='products-title' className='min-w-0 space-y-6'>
  <header className='space-y-1'>
    <h1 id='products-title' className='text-xl font-semibold'>
      Products
    </h1>
    <p className='text-muted-foreground text-sm'>Mock fruit data</p>
  </header>
  <ProductsTable />
</section>
```

- One clear page title, one short subtitle. No stats cards, no buttons, no filler copy.
- The page uses the admin shell background and spacing. Do not wrap the page in a card and do not add shadows.
- `ProductsTable` owns the search field and table. Keep all table state in that component.

### Search toolbar

Above the table, one search field:

```tsx
<div className='relative w-full sm:max-w-xs'>
  <label htmlFor='product-search' className='sr-only'>
    Search fruits
  </label>
  <HugeiconsIcon
    icon={Search01Icon}
    className='text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2'
    aria-hidden='true'
  />
  <Input
    ref={searchInputRef}
    id='product-search'
    type='text'
    inputMode='search'
    autoComplete='off'
    spellCheck={false}
    value={globalFilter}
    onChange={event => setGlobalFilter(event.target.value)}
    placeholder='Search fruits'
    maxLength={60}
    className='h-11 pr-12 pl-9'
  />
  {globalFilter && (
    <Button
      type='button'
      variant='ghost'
      size='icon'
      onClick={clearSearch}
      aria-label='Clear search'
      className='absolute top-0 right-0 size-11'
    >
      <HugeiconsIcon icon={Cancel01Icon} className='size-4' aria-hidden='true' />
    </Button>
  )}
</div>
```

- Do not auto-focus the field on page load.
- The clear button resets the query and returns focus to the search input.
- No debounce, no loading state, and no API call. Filtering is local and instant.

### Table

- Wrap the table in a plain `border-y` container. Do not add a card, rounded container, or shadow.
- Header row: `bg-muted/50`, no zebra stripes.
- Body rows use the existing row hover and border behaviour from `TableRow`.
- Cell padding: `py-3`. Header cells: `h-11 p-0`.
- Define `columns` at module scope so the array is not recreated on every render.
- Keep all five columns visible at every width. The existing `Table` wrapper handles horizontal scrolling; the page itself must never scroll horizontally.
- No sticky header, no row selection, no row actions, and no column visibility controls.

Columns, in this order:

| Column | Cell |
| --- | --- |
| Fruit | Name, `font-medium`. |
| Category | Muted text. |
| Price / kg | Formatted with `Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })`, created once at module scope. |
| Stock | `${quantity} kg`. |
| Status | Badge, derived from quantity and reorder level. |

Status badge mapping:

- `Out of stock` → `variant='destructive'`
- `Low stock` → `variant='secondary'`
- `In stock` → `variant='outline'`

The status text carries the meaning; colour is never the only signal.

- Status is a display column, not a data field. Define it with `id: 'status'` and a `cell` that reads `row.original`; do not add `status` to `FruitProduct`.
- Because header cells use `p-0`, render the non-sortable Status header as `<span className='flex h-11 items-center px-2 font-medium'>Status</span>` so it aligns with the sort buttons.

### Empty state

When no rows match the search:

- One row spanning every column, `h-32`, centred.
- Message: `No fruits match your search.`
- One `Button variant='link' size='sm'` labelled `Clear search` that resets the query and returns focus to the input.
- Use `table.getAllColumns().length` for `colSpan`; do not hard-code `5`.

There is no loading or error state because the data is static. Do not fake either one.

---

## 6. Mock fruit data

`FruitProductsData.ts`:

```ts
export type FruitProduct = {
  id: string
  name: string
  category: 'Berries' | 'Citrus' | 'Melon' | 'Pome' | 'Stone fruit' | 'Tropical' | 'Vine fruit'
  pricePerKg: number
  quantity: number
  reorderLevel: number
}

export const fruitProducts: FruitProduct[] = [
  { id: 'f1', name: 'Fuji apple', category: 'Pome', pricePerKg: 3.4, quantity: 42, reorderLevel: 15 },
  { id: 'f2', name: 'Cavendish banana', category: 'Tropical', pricePerKg: 1.2, quantity: 65, reorderLevel: 20 },
  { id: 'f3', name: 'Blueberry', category: 'Berries', pricePerKg: 9.6, quantity: 5, reorderLevel: 8 },
  { id: 'f4', name: 'Green grapes', category: 'Vine fruit', pricePerKg: 5.2, quantity: 21, reorderLevel: 10 },
  { id: 'f5', name: 'Lemon', category: 'Citrus', pricePerKg: 2.1, quantity: 30, reorderLevel: 12 },
  { id: 'f6', name: 'Kent mango', category: 'Tropical', pricePerKg: 4.2, quantity: 24, reorderLevel: 10 },
  { id: 'f7', name: 'Navel orange', category: 'Citrus', pricePerKg: 2.8, quantity: 0, reorderLevel: 18 },
  { id: 'f8', name: 'Peach', category: 'Stone fruit', pricePerKg: 4.8, quantity: 7, reorderLevel: 10 },
  { id: 'f9', name: 'Conference pear', category: 'Pome', pricePerKg: 3.1, quantity: 0, reorderLevel: 10 },
  { id: 'f10', name: 'Pineapple', category: 'Tropical', pricePerKg: 2.6, quantity: 18, reorderLevel: 8 },
  { id: 'f11', name: 'Strawberry', category: 'Berries', pricePerKg: 6.5, quantity: 9, reorderLevel: 12 },
  { id: 'f12', name: 'Watermelon', category: 'Melon', pricePerKg: 0.9, quantity: 38, reorderLevel: 10 }
]
```

- `quantity` and `reorderLevel` are kilograms.
- Do not add SKU, description, supplier, image, or date fields. They are not part of this preview.
- Status is derived, never stored. Export this helper from the same file:

```ts
export function getStockStatus(product: FruitProduct): 'In stock' | 'Low stock' | 'Out of stock' {
  if (product.quantity === 0) return 'Out of stock'
  if (product.quantity < product.reorderLevel) return 'Low stock'
  return 'In stock'
}
```

Expected statuses: `In stock` for 7 rows, `Low stock` for Blueberry, Peach, and Strawberry, `Out of stock` for Navel orange and Conference pear.

---

## 7. Search behaviour

Use TanStack Table's global filter. Do not pre-filter the array with a second copy of the logic.

- State: `const [globalFilter, setGlobalFilter] = useState('')`.
- Wire `state: { sorting, globalFilter }`, `onSortingChange: setSorting`, and `onGlobalFilterChange: setGlobalFilter` into `useReactTable`.
- Function:

```ts
const filterFruits: FilterFn<FruitProduct> = (row, _columnId, filterValue) => {
  const query = String(filterValue).trim().toLowerCase()
  if (!query) return true
  return (
    row.original.name.toLowerCase().includes(query) || row.original.category.toLowerCase().includes(query)
  )
}
```

- Search is case-insensitive and ignores leading and trailing spaces.
- Only name and category are searched. Price, stock, and status are not.
- Empty query shows all 12 rows.
- Search does not reset or change the current sort.
- No regex, no fuzzy matching, no highlighting.

---

## 8. Sorting behaviour

- Use `SortingState` with the initial state `[{ id: 'name', desc: false }]`.
- `enableSortingRemoval: false`, so clicking a sorted header toggles ascending and descending only.
- Sorting is available on Fruit, Category, Price / kg, and Stock.
- Status is not sortable: `enableSorting: false` on that column.
- Price and stock sort numerically. Verify `$0.90` comes before `$1.20`, and stock `5` before `38`; never compare formatted strings.
- Fruit and category sort alphabetically, case-insensitively. TanStack's default string sort is sufficient.
- Put `aria-sort` on the `<TableHead>`: `ascending`, `descending`, or `none`.
- Render a sort control inside each sortable header cell. In the snippet, `header` comes from `table.getHeaderGroups()`, and `label` is that column's header string:

```tsx
<button
  type='button'
  onClick={header.column.getToggleSortingHandler()}
  className='hover:text-foreground focus-visible:ring-ring flex h-11 w-full items-center gap-1.5 px-2 text-left font-medium focus-visible:ring-2 focus-visible:outline-none'
  aria-label={`Sort by ${label}`}
>
  {label}
  <HugeiconsIcon
    icon={
      header.column.getIsSorted() === 'asc'
        ? ArrowUp01Icon
        : header.column.getIsSorted() === 'desc'
          ? ArrowDown01Icon
          : ArrowUpDownIcon
    }
    className='text-muted-foreground size-3.5'
    aria-hidden='true'
  />
</button>
```

- The header button is the sort target, at least 44px tall. Keyboard activation works through the native button; do not add custom key handlers.
- Do not add a separate "Sort by" dropdown. Column header sorting is the only sorting control.

---

## 9. Scope boundaries

Do not add:

- add, edit, delete, or row action buttons;
- checkboxes, bulk actions, pagination, result counts, or "rows per page";
- category, stock, or price filters;
- a sort dropdown;
- images, icons per fruit, or emoji;
- charts, statistics cards, or low-stock summaries;
- search highlighting, fuzzy search, or URL search parameters;
- raw HTML injection (`dangerouslySetInnerHTML`); render names and categories as React text;
- API calls, `fetch`, React Query, local storage, or a mock server;
- loading skeletons, error states, or fake delays;
- new colours, tokens, fonts, or dependencies.

The only interactive elements are the search field, the clear button, the sortable headers, and the empty-state clear action.

---

## 10. Checks before you report

Run and report the result of each:

```bash
npm run check-types   # must pass with no errors
npm run lint          # must pass with 0 errors and 0 warnings
npm run format        # Prettier and Tailwind class order
npm run dev           # then open /products
```

Manual checks:

- `/products` opens inside the admin shell, the sidebar Products link is active, and the breadcrumb reads `Products`.
- Search `berry` shows Blueberry and Strawberry.
- Search `citrus` shows Lemon and Navel orange.
- Search `MANGO` shows Kent mango (case-insensitive).
- Search `  mango  ` shows Kent mango (spaces trimmed).
- Search `kiwi` shows the empty state; `Clear search` restores all 12 rows and focuses the search field.
- Search does not change the current sort order.
- Fruit starts ascending by name. Clicking toggles descending, then ascending; it never returns to "unsorted".
- Price sorting is numeric: `$0.90` first ascending, `$9.60` first descending.
- Stock sorting is numeric: `0 kg` first ascending, `65 kg` first descending.
- The active sortable header reports `aria-sort='ascending'` or `'descending'`; every other sortable header reports `'none'`.
- Tab reaches the search field and, after typing, the clear button; Tab also reaches each sortable header, and Enter and Space sort.
- 375px wide: no horizontal page scroll; the table scrolls inside its wrapper; the search field is full width.
- 1440×900: the search field is at most `20rem` wide and the table uses the available width.
- Dark mode: text, borders, badges, hover, and focus states have readable contrast.
- No console errors, no network requests, and no new dependencies.

---

## 11. Report format

Follow `ai-workflow/02-Process.md` exactly:

- **Changed:** one line per change, with the file name.
- **Test:** what you checked and the result.
- **Open:** risks, assumptions, or anything you could not verify.
- **Commit:** a one-line commit message. **Never run `git add` or `git commit`.**
