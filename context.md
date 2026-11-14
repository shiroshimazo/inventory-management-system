# Login UI

The app is a frontend-only React SPA using TanStack Router, shadcn/ui, and existing light/dark tokens in `src/index.css`.

The `/login` page uses the blank auth layout, a compact bordered surface, existing typography, and Hugeicons. No decorative assets or new tokens are needed. The old authentication demos at `/pages/auth/*` have been removed and now show the existing 404 page.

The form validates on blur and submit. For this UI preview, usernames use 3–20 letters, numbers, or underscores and start with a letter. Passwords use 8–128 characters and cannot contain only spaces. Password values are never trimmed. These provisional constraints must match the backend when authentication is added.

Submit shows a preview notice without sending or storing credentials.

## Password recovery preview

`/forgot-password` has three steps: email, a six-box verification code, and new/confirm password. The public preview code is `123456`; it is displayed on the verification step. No email is sent, no account is checked, and no password is saved. Completion clears the form and explicitly confirms that no password changed. Real recovery requires server verification before enabling any password update.

The page matches the login surface, typography, spacing, and light/dark tokens to keep account screens consistent. A single bordered surface groups the task; the primary button identifies the next action. A vertical three-step stepper sits left of the form on wide screens and switches to a compact horizontal stepper above the form below `xl`. The stepper shows progress only; its steps do not navigate. The verification step uses a six-slot animated OTP input. The new-password field has a show/hide toggle and a live strength meter with a four-rule checklist. Existing error icons identify validation failures. Motion is limited to input feedback and respects reduced motion. Design direction: calm inventory administration, energy 1 / rhythm 1 / motion 1.

Validation runs on blur and submit, then updates touched fields as users type. Passwords use 12–128 characters and must include upper and lowercase letters, a number, and a symbol. They preserve spaces exactly, reject repeated characters and a small common-password list, and cannot equal the email. These are provisional UI rules, not production authentication controls. All state stays in component memory and resets on reload.

## Products preview

`/products` displays 12 static fruit products inside the admin shell. Search matches names and categories, ignoring case and surrounding spaces. Fruit, category, price, and stock headers sort the table; fruit starts ascending. Stock badges derive from quantity and reorder level. Clearing search keeps filters and sorting and focuses the search field. Separate Category and Status dropdowns beside search apply immediately. The Price button opens inclusive price-per-kg limits; applying or resetting price preserves category and status. Invalid price ranges show an error. Reset price preserves search; Clear all in the empty state resets both. No backend, persistence, edit/delete, or pagination is included.

The visual direction is a restrained inventory list using existing tokens, table primitives, and badges. A single search field sits above a table with horizontal borders and a muted header, without cards or shadows. Price (USD per kg), Kg (total weight), and Stock (mock item count) are separate columns. Stock status uses item counts and reorder counts; item counts are illustrative, not calculated from weight. Search uses a focus border without a glow. All six columns remain visible through the table's horizontal scroll wrapper. Existing light and dark themes apply.

The toolbar Reset button clears search and all filters, preserves sorting, and focuses search. Product status badges use 6px corners, green for In stock, orange for Low stock, and the existing destructive style for Out of stock. Text labels retain the status meaning in both themes.


Add Products opens a responsive three-step dialog (Details, Stock & price, Review) using the existing theme and components. React Hook Form and Zod validate required fields and case-insensitive SKU uniqueness. Products and drafts stay in memory: closing resets the draft, successful additions update the filtered/sorted table and show a toast, and refresh restores the 12 mock rows. Active filters can hide a new product. A real backend must revalidate every field and enforce SKU uniqueness.
