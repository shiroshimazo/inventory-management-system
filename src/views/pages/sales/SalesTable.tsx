import { useMemo, useRef, useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
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
  Cancel01Icon,
  Search01Icon
} from '@hugeicons/core-free-icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { HugeiconsIcon } from '@/components/ui/hugeicons'
import { Dialog } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { fruitProducts } from '../products/FruitProductsData'
import {
  formatSaleDate,
  getNextSaleReference,
  getSaleItemCount,
  getSaleTotal,
  matchesSaleDatePreset,
  matchesSaleSearch,
  priceFormatter,
  seedSales,
  type Sale,
  type SaleDatePreset
} from './SalesData'
import { recordSale, type SaleDraft } from './SalesSchema'
import RecordSaleDialog from './RecordSaleDialog'
import SaleDetailDialog from './SaleDetailDialog'

const datePresets: { value: SaleDatePreset; label: string }[] = [
  { value: 'all', label: 'All dates' },
  { value: 'today', label: 'Today' },
  { value: 'last-7-days', label: 'Last 7 days' },
  { value: 'last-30-days', label: 'Last 30 days' }
]

export default function SalesTable() {
  const [inventory, setInventory] = useState(() => ({
    products: fruitProducts.map(product => ({ ...product })),
    sales: seedSales
  }))
  const inventoryRef = useRef(inventory)
  const [recording, setRecording] = useState(false)
  const [viewingSale, setViewingSale] = useState<Sale | null>(null)
  const [search, setSearch] = useState('')
  const [datePreset, setDatePreset] = useState<SaleDatePreset>('all')
  const [sorting, setSorting] = useState<SortingState>([{ id: 'soldAt', desc: true }])
  const searchRef = useRef<HTMLInputElement>(null)
  const recordButtonRef = useRef<HTMLButtonElement>(null)
  const recordReturnFocusRef = useRef<HTMLButtonElement>(null)
  const detailButtonRef = useRef<HTMLButtonElement>(null)
  const columns = useMemo<ColumnDef<Sale>[]>(
    () => [
      {
        accessorKey: 'reference',
        header: 'Reference',
        enableSorting: false,
        cell: ({ row }) => <span className='font-medium'>{row.original.reference}</span>
      },
      {
        accessorKey: 'soldAt',
        header: 'Date',
        cell: ({ row }) => <time dateTime={row.original.soldAt}>{formatSaleDate(row.original.soldAt)}</time>
      },
      { id: 'items', header: 'Items', accessorFn: getSaleItemCount, enableSorting: false },
      {
        id: 'total',
        header: 'Total',
        accessorFn: getSaleTotal,
        cell: ({ row }) => priceFormatter.format(getSaleTotal(row.original))
      },
      { accessorKey: 'recordedBy', header: 'Recorded by', enableSorting: false },
      {
        id: 'actions',
        header: 'Actions',
        enableSorting: false,
        cell: ({ row }) => (
          <Button
            type='button'
            variant='ghost'
            className='h-11'
            aria-label={`View ${row.original.reference}`}
            onClick={event => {
              detailButtonRef.current = event.currentTarget
              setViewingSale(row.original)
            }}
          >
            View
          </Button>
        )
      }
    ],
    []
  )
  const filteredSales = useMemo(
    () => inventory.sales.filter(sale => matchesSaleSearch(sale, search) && matchesSaleDatePreset(sale, datePreset)),
    [inventory.sales, search, datePreset]
  )
  const table = useReactTable({
    data: filteredSales,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: sale => sale.id,
    enableSortingRemoval: false
  })

  function saveSale(draft: SaleDraft) {
    const current = inventoryRef.current
    const result = recordSale(draft, current.products, current.sales)
    if (result.success) {
      recordReturnFocusRef.current = recordButtonRef.current
      const next = { products: result.data.products, sales: [result.data.sale, ...current.sales] }
      inventoryRef.current = next
      setInventory(next)
    }
    return result
  }
  function clearSearch() {
    setSearch('')
    searchRef.current?.focus()
  }
  function resetFilters() {
    setDatePreset('all')
    clearSearch()
  }

  return (
    <div className='min-w-0 space-y-4'>
      <div className='flex flex-wrap items-end gap-2'>
        <div className='relative w-full min-w-0 sm:max-w-xs'>
          <label htmlFor='sale-search' className='sr-only'>
            Search sales
          </label>
          <HugeiconsIcon
            icon={Search01Icon}
            className='text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2'
            aria-hidden='true'
          />
          <Input
            ref={searchRef}
            id='sale-search'
            type='text'
            inputMode='search'
            autoComplete='off'
            spellCheck={false}
            value={search}
            onChange={event => setSearch(event.target.value)}
            placeholder='Search reference or product'
            maxLength={60}
            className='focus-visible:border-foreground h-11 pr-12 pl-9 shadow-none focus-visible:ring-0'
          />
          {search && (
            <Button
              type='button'
              variant='ghost'
              size='icon'
              className='absolute top-0 right-0 size-11'
              aria-label='Clear search'
              onClick={clearSearch}
            >
              <HugeiconsIcon icon={Cancel01Icon} aria-hidden='true' />
            </Button>
          )}
        </div>
        <div className='space-y-2'>
          <label htmlFor='sale-date' className='block text-sm'>
            Date
          </label>
          <Select
            value={datePreset}
            onValueChange={value => {
              if (value) setDatePreset(value as SaleDatePreset)
            }}
            items={datePresets}
          >
            <SelectTrigger id='sale-date' className='min-w-36 data-[size=default]:h-11'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {datePresets.map(preset => (
                <SelectItem key={preset.value} value={preset.value} className='min-h-11'>
                  {preset.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button type='button' variant='ghost' className='h-11' onClick={resetFilters}>
          Reset
        </Button>
        <Button
          ref={recordButtonRef}
          type='button'
          className='h-11 w-full sm:ml-auto sm:w-auto'
          onClick={event => {
            recordReturnFocusRef.current = event.currentTarget
            setRecording(true)
          }}
        >
          <HugeiconsIcon icon={Add01Icon} aria-hidden='true' />
          Record sale
        </Button>
      </div>
      <div className='border-y'>
        <Table
          aria-label='Sales'
          tabIndex={0}
          className='focus-visible:outline-primary focus-visible:outline-2 focus-visible:-outline-offset-2'
        >
          <TableHeader>
            {table.getHeaderGroups().map(group => (
              <TableRow key={group.id} className='bg-muted/50'>
                {group.headers.map(header => {
                  const direction = header.column.getIsSorted()
                  const label = String(header.column.columnDef.header)
                  return (
                    <TableHead
                      key={header.id}
                      className='h-11 p-0'
                      scope='col'
                      aria-sort={
                        header.column.getCanSort()
                          ? direction === 'asc'
                            ? 'ascending'
                            : direction === 'desc'
                              ? 'descending'
                              : 'none'
                          : undefined
                      }
                    >
                      {header.column.getCanSort() ? (
                        <button
                          type='button'
                          onClick={header.column.getToggleSortingHandler()}
                          aria-label={`Sort by ${label}`}
                          className={`hover:text-foreground focus-visible:ring-ring flex h-11 w-full items-center gap-1.5 px-2 font-medium focus-visible:ring-2 focus-visible:outline-none ${header.id === 'total' ? 'justify-end' : 'text-left'}`}
                        >
                          {label}
                          <HugeiconsIcon
                            icon={
                              direction === 'asc'
                                ? ArrowUp01Icon
                                : direction === 'desc'
                                  ? ArrowDown01Icon
                                  : ArrowUpDownIcon
                            }
                            className='text-muted-foreground size-3.5'
                            aria-hidden='true'
                          />
                        </button>
                      ) : (
                        <span className='flex h-11 items-center px-2 font-medium'>{label}</span>
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
                    <TableCell
                      key={cell.id}
                      className={`py-3 ${cell.column.id === 'total' ? 'text-right tabular-nums' : cell.column.id === 'items' ? 'tabular-nums' : ''}`}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-32 text-center'>
                  <p>{inventory.sales.length ? 'No sales match your search or filters.' : 'No sales recorded.'}</p>
                  {inventory.sales.length ? (
                    <Button type='button' variant='link' className='h-11' onClick={resetFilters}>
                      Clear filters
                    </Button>
                  ) : (
                    <Button
                      type='button'
                      className='mt-2 h-11'
                      onClick={event => {
                        recordReturnFocusRef.current = event.currentTarget
                        setRecording(true)
                      }}
                    >
                      Record sale
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {recording && (
        <RecordSaleDialog
          products={inventory.products}
          reference={getNextSaleReference(inventory.sales)}
          onSave={saveSale}
          onClose={() => setRecording(false)}
          returnFocus={recordReturnFocusRef}
        />
      )}
      <Dialog
        open={viewingSale !== null}
        onOpenChange={open => {
          if (!open) setViewingSale(null)
        }}
      >
        {viewingSale && (
          <SaleDetailDialog sale={viewingSale} onClose={() => setViewingSale(null)} returnFocus={detailButtonRef} />
        )}
      </Dialog>
    </div>
  )
}
