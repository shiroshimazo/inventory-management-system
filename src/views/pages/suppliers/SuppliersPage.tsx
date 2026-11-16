import SuppliersTable from '@/views/pages/suppliers/SuppliersTable'

export default function SuppliersPage() {
  return (
    <section aria-labelledby='suppliers-title' className='min-w-0 space-y-6'>
      <header className='space-y-1'>
        <h1 id='suppliers-title' className='text-3xl font-semibold'>
          Suppliers
        </h1>
        <p className='text-muted-foreground text-sm'>Mock supplier data</p>
      </header>
      <SuppliersTable />
    </section>
  )
}
