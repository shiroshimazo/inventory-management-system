# Login UI

The app is a frontend-only React SPA using TanStack Router, shadcn/ui, and existing light/dark tokens in `src/index.css`.

The `/login` page uses the blank auth layout, a compact bordered surface, existing typography, and Hugeicons. No decorative assets or new tokens are needed. Existing authentication demos remain available at `/pages/auth/*`.

The form validates on blur and submit. For this UI preview, usernames use 3–20 letters, numbers, or underscores and start with a letter. Passwords use 8–128 characters and cannot contain only spaces. Password values are never trimmed. These provisional constraints must match the backend when authentication is added.

Submit shows a preview notice without sending or storing credentials. `/forgot-password` reuses the existing password reset demo; it does not send email.
