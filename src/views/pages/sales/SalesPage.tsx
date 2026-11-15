import SalesTable from './SalesTable'

export default function SalesPage() {
  return (
    <section aria-labelledby='sales-title' className='min-w-0 space-y-6'>
      <header className='space-y-1'>
        <h1 id='sales-title' className='text-xl font-semibold'>
          Sales / Stock-Out
        </h1>
        <p className='text-muted-foreground text-sm'>Recorded sales and stock-outs. Mock data, reset on reload.</p>
      </header>
      <SalesTable />
    </section>
  )
}
