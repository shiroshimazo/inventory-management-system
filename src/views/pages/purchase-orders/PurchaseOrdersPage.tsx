import PurchaseOrdersTable from './PurchaseOrdersTable'
import './PurchaseOrders.css'

export default function PurchaseOrdersPage() {
  return (
    <section aria-labelledby='purchase-orders-title' className='borderline purchase-orders min-w-0 space-y-6'>
      <header className='space-y-1'>
        <h1 id='purchase-orders-title' className='text-3xl font-semibold'>
          Purchase Orders
        </h1>
        <p className='text-muted-foreground text-sm'>Manage supplier orders and expected deliveries.</p>
        <p className='text-muted-foreground text-sm'>Mock data resets on reload. Receiving does not update stock.</p>
      </header>
      <PurchaseOrdersTable />
    </section>
  )
}
