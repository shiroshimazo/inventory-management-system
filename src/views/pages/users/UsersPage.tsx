import UsersTable from './UsersTable'

export default function UsersPage() {
  return (
    <section aria-labelledby='users-title' className='borderline min-w-0 space-y-6'>
      <style>{`
        body:has(#users-title) [data-slot='dialog-overlay'],
        body:has(#users-title) [data-slot='dialog-content'] {
          animation-duration: 200ms;
          animation-timing-function: ease-out;
        }
        body:has(#users-title) [data-sonner-toast] {
          transition-duration: 200ms;
          transition-timing-function: ease-out;
        }
        @media (prefers-reduced-motion: reduce) {
          body:has(#users-title) [data-slot='dialog-overlay'],
          body:has(#users-title) [data-slot='dialog-content'],
          body:has(#users-title) [data-sonner-toast] {
            animation: none;
            transition: none;
          }
        }
      `}</style>
      <header className='space-y-1'>
        <h1 id='users-title' className='text-3xl font-semibold'>
          Users
        </h1>
        <p className='text-muted-foreground text-sm'>Manage admin and staff accounts.</p>
      </header>
      <UsersTable />
    </section>
  )
}
