import ProductsTable from '@/views/pages/products/ProductsTable'

export default function ProductsPage() {
  return (
    <section aria-labelledby='products-title' className='min-w-0 space-y-6'>
      <header className='space-y-1'>
        <h1 id='products-title' className='text-xl font-semibold'>
          Products
        </h1>
        <p className='text-muted-foreground text-sm'>Mock fruit data</p>
      </header>
      <ProductsTable />
    </section>
  )
}
