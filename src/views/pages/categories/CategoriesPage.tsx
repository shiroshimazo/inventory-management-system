import CategoriesTable from '@/views/pages/categories/CategoriesTable'

export default function CategoriesPage() {
  return (
    <section aria-labelledby='categories-title' className='min-w-0 space-y-6'>
      <header className='space-y-1'>
        <h1 id='categories-title' className='text-xl font-semibold'>
          Categories
        </h1>
        <p className='text-muted-foreground text-sm'>Mock category data</p>
      </header>
      <CategoriesTable />
    </section>
  )
}
