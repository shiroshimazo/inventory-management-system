# Login UI

The app is a frontend-only React SPA using TanStack Router, shadcn/ui, and existing light/dark tokens in `src/index.css`.

The `/login` page uses the blank auth layout, a compact bordered surface, existing typography, and Hugeicons. No decorative assets or new tokens are needed. The old authentication demos at `/pages/auth/*` have been removed and now show the existing 404 page.

The form validates on blur and submit. For this UI preview, usernames use 3–20 letters, numbers, or underscores and start with a letter. Passwords use 8–128 characters and cannot contain only spaces. Password values are never trimmed. These provisional constraints must match the backend when authentication is added.

Submit shows a preview notice without sending or storing credentials.

## Password recovery preview

`/forgot-password` has three steps: email, a six-box verification code, and new/confirm password. The public preview code is `123456`; it is displayed on the verification step. No email is sent, no account is checked, and no password is saved. Completion clears the form and explicitly confirms that no password changed. Real recovery requires server verification before enabling any password update.

The page matches the login surface, typography, spacing, and light/dark tokens to keep account screens consistent. A single bordered surface groups the task; the primary button identifies the next action. A vertical three-step stepper sits left of the form on wide screens and switches to a compact horizontal stepper above the form below `xl`. Only completed steps navigate back; future steps stay disabled, and the stepper locks once the preview completes. Existing error icons identify validation failures. No decorative assets or motion are added. Design direction: calm inventory administration, energy 1 / rhythm 1 / motion 1.

Validation runs on blur and submit, then updates touched fields as users type. Passwords use 8–128 characters, preserve spaces exactly, reject repeated characters and a small common-password list, and cannot equal the email. These are provisional UI rules, not production authentication controls. All state stays in component memory and resets on reload.
