import { useMemo, useRef, useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState
} from '@tanstack/react-table'
import {
  Add01Icon,
  ArrowDown01Icon,
  ArrowUp01Icon,
  ArrowUpDownIcon,
  Delete01Icon,
  Edit04Icon,
  Search01Icon
} from '@hugeicons/core-free-icons'
import { toast } from 'sonner'
import { HugeiconsIcon } from '@/components/ui/hugeicons'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  formatPurchaseOrderDate,
  getPurchaseOrderSupplier,
  getPurchaseOrderToday,
  getPurchaseOrderTotal,
  matchesPurchaseOrderSearch,
  MAX_SEARCH_LENGTH,
  priceFormatter,
  purchaseOrdersSeed,
  purchaseOrderStatuses,
  type PurchaseOrder
} from './PurchaseOrdersData'
import type { PurchaseOrderDraft } from './PurchaseOrdersSchema'
import PurchaseOrderDialog from './PurchaseOrderDialog'
import PurchaseOrdersSummary from './PurchaseOrdersSummary'

const defaultSorting: SortingState = [{ id: 'orderDate', desc: true }]
const statusOptions = [
  { value: 'all', label: 'All statuses' },
  ...purchaseOrderStatuses.map(status => ({ value: status, label: status }))
]

export default function PurchaseOrdersTable() {
  const [orders, setOrders] = useState(purchaseOrdersSeed)
  const [editingOrder, setEditingOrder] = useState<PurchaseOrder | 'new' | null>(null)
  const [removingOrder, setRemovingOrder] = useState<PurchaseOrder | null>(null)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [sorting, setSorting] = useState(defaultSorting)
  const returnFocus = useRef<HTMLButtonElement | null>(null)
  const searchInput = useRef<HTMLInputElement>(null)
  const nextSequence = useRef(Math.max(...purchaseOrdersSeed.map(order => Number(order.reference.split('-')[2]))) + 1)
  const filteredOrders = useMemo(
    () => orders.filter(order => status === 'all' || order.status === status),
    [orders, status]
  )
  const columns = useMemo<ColumnDef<PurchaseOrder>[]>(
    () => [
      {
        accessorKey: 'reference',
        header: 'Reference',
        cell: ({ getValue }) => <span className='font-medium'>{getValue<string>()}</span>
      },
      { id: 'supplier', accessorFn: order => getPurchaseOrderSupplier(order.supplierId), header: 'Supplier' },
      {
        accessorKey: 'orderDate',
        header: 'Order date',
        cell: ({ getValue }) => formatPurchaseOrderDate(getValue<string>())
      },
      {
        accessorKey: 'expectedDate',
        header: 'Expected date',
        cell: ({ getValue }) => formatPurchaseOrderDate(getValue<string>())
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ getValue }) => <Badge variant='outline'>{getValue<string>()}</Badge>
      },
      { id: 'lineCount', accessorFn: order => order.lines.length, header: 'Line items' },
      {
        id: 'total',
        accessorFn: order => getPurchaseOrderTotal(order.lines),
        header: 'Total (PHP)',
        cell: ({ getValue }) => <span className='tabular-nums'>{priceFormatter.format(getValue<number>())}</span>
      },
      {
        id: 'actions',
        header: 'Actions',
        enableSorting: false,
        cell: ({ row }) => (
          <div className='flex gap-2'>
            <Button
              type='button'
              variant='ghost'
              size='icon'
              className='size-11'
              aria-label={`Edit ${row.original.reference}`}
              onClick={event => {
                returnFocus.current = event.currentTarget
                setEditingOrder(row.original)
              }}
            >
              <HugeiconsIcon icon={Edit04Icon} aria-hidden='true' />
            </Button>
            <Button
              type='button'
              variant='ghost'
              size='icon'
              className='text-destructive size-11'
              aria-label={`Remove ${row.original.reference}`}
              onClick={event => {
                returnFocus.current = event.currentTarget
                setRemovingOrder(row.original)
              }}
            >
              <HugeiconsIcon icon={Delete01Icon} aria-hidden='true' />
            </Button>
          </div>
        )
      }
    ],
    []
  )
  const table = useReactTable({
    data: filteredOrders,
    columns,
    state: { sorting, globalFilter: search },
    onSortingChange: setSorting,
    globalFilterFn: (row, _columnId, value: string) => matchesPurchaseOrderSearch(row.original, value),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: order => order.id,
    enableSortingRemoval: false
  })
  function clearAll() {
    setSearch('')
    setStatus('all')
    setSorting(defaultSorting)
    searchInput.current?.focus()
  }
  function saveOrder(draft: PurchaseOrderDraft) {
    if (editingOrder && editingOrder !== 'new') {
      setOrders(current => current.map(order => (order.id === editingOrder.id ? { ...order, ...draft } : order)))
      return
    }
    const reference = `PO-${getPurchaseOrderToday().slice(0, 4)}-${String(nextSequence.current++).padStart(3, '0')}`
    setOrders(current => [...current, { ...draft, id: crypto.randomUUID(), reference }])
  }
  function removeOrder() {
    if (!removingOrder) return
    setOrders(current => current.filter(order => order.id !== removingOrder.id))
    setRemovingOrder(null)
    toast.success('Purchase order removed.')
  }
  return (
    <div className='min-w-0 space-y-4'>
      <PurchaseOrdersSummary orders={orders} />
      <div className='flex flex-wrap items-center gap-2'>
        <div className='relative w-full sm:max-w-xs'>
          <label htmlFor='purchase-order-search' className='sr-only'>
            Search purchase orders
          </label>
          <HugeiconsIcon
            icon={Search01Icon}
            className='text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2'
            aria-hidden='true'
          />
          <Input
            ref={searchInput}
            id='purchase-order-search'
            inputMode='search'
            placeholder='Search reference or supplier'
            value={search}
            onChange={event => setSearch(event.target.value)}
            maxLength={MAX_SEARCH_LENGTH}
            className='pl-9'
          />
        </div>
        <Select items={statusOptions} value={status} onValueChange={value => setStatus(value ?? 'all')}>
          <SelectTrigger aria-label='Filter by status'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className='borderline purchase-orders' alignItemWithTrigger={false}>
            {statusOptions.map(option => (
              <SelectItem key={option.value} value={option.value} className='min-h-11'>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type='button' className='h-11' onClick={clearAll}>
          Clear all
        </Button>
        <Button
          type='button'
          className='h-11 w-full sm:ml-auto sm:w-auto'
          onClick={event => {
            returnFocus.current = event.currentTarget
            setEditingOrder('new')
          }}
        >
          <HugeiconsIcon icon={Add01Icon} aria-hidden='true' />
          Add order
        </Button>
      </div>
      <div className='borderline borderline-surface min-w-0 p-6'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(group => (
              <TableRow key={group.id}>
                {group.headers.map(header => {
                  const direction = header.column.getIsSorted()
                  return (
                    <TableHead
                      key={header.id}
                      className='h-11 p-0'
                      aria-sort={direction === 'asc' ? 'ascending' : direction === 'desc' ? 'descending' : undefined}
                    >
                      {header.column.getCanSort() ? (
                        <button
                          type='button'
                          className='flex h-11 w-full items-center gap-2 px-2 text-left font-medium focus-visible:outline'
                          onClick={header.column.getToggleSortingHandler()}
                          aria-label={`Sort by ${header.column.columnDef.header}`}
                        >
                          {String(header.column.columnDef.header)}
                          <HugeiconsIcon
                            icon={
                              direction === 'asc'
                                ? ArrowUp01Icon
                                : direction === 'desc'
                                  ? ArrowDown01Icon
                                  : ArrowUpDownIcon
                            }
                            className='size-4'
                            aria-hidden='true'
                          />
                        </button>
                      ) : (
                        <span className='px-2'>{String(header.column.columnDef.header)}</span>
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-32 text-center'>
                  <p>{orders.length ? 'No purchase orders match your filters.' : 'No purchase orders yet.'}</p>
                  <Button
                    type='button'
                    variant='link'
                    className='h-11'
                    onClick={
                      orders.length
                        ? clearAll
                        : event => {
                            returnFocus.current = event.currentTarget
                            setEditingOrder('new')
                          }
                    }
                  >
                    {orders.length ? 'Clear all' : 'Add order'}
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {editingOrder && (
        <PurchaseOrderDialog
          order={editingOrder === 'new' ? undefined : editingOrder}
          onSave={saveOrder}
          onClose={() => setEditingOrder(null)}
          returnFocus={returnFocus}
        />
      )}
      <Dialog open={!!removingOrder} onOpenChange={open => !open && setRemovingOrder(null)}>
        {removingOrder && (
          <DialogContent
            aria-labelledby='remove-order-title'
            className='borderline purchase-orders [&>[data-slot=dialog-close]]:size-11'
            finalFocus={() => {
              requestAnimationFrame(() =>
                (returnFocus.current?.isConnected ? returnFocus.current : searchInput.current)?.focus()
              )
              return false
            }}
          >
            <DialogHeader>
              <DialogTitle id='remove-order-title' className='text-xl font-semibold'>
                Remove purchase order
              </DialogTitle>
              <DialogDescription>Remove {removingOrder.reference}? Reload restores mock data.</DialogDescription>
            </DialogHeader>
            <div className='flex flex-col-reverse gap-2 sm:flex-row sm:justify-end'>
              <Button type='button' variant='outline' className='h-11' onClick={() => setRemovingOrder(null)}>
                Cancel
              </Button>
              <Button type='button' variant='destructive' className='h-11' onClick={removeOrder}>
                Remove order
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
