import { useRef, useState } from 'react'
import type { ColumnDef, ColumnFiltersState, FilterFn, SortingState } from '@tanstack/react-table'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import {
  Add01Icon,
  ArrowDown01Icon,
  ArrowUp01Icon,
  ArrowUpDownIcon,
  Cancel01Icon,
  Search01Icon
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@/components/ui/hugeicons'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import ProductsFilters from '@/views/pages/products/ProductsFilters'
import {
  fruitProducts,
  getStockStatus,
  priceFormatter,
  type FruitProduct
} from '@/views/pages/products/FruitProductsData'

import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import AddProductDialog from './AddProductDialog'
const statusVariants = { 'Out of stock': 'destructive', 'Low stock': 'secondary', 'In stock': 'outline' } as const

const statusClasses = {
  'In stock': 'border-transparent bg-green-100 text-green-800 dark:bg-green-400/10 dark:text-green-400',
  'Low stock': 'bg-orange-100 text-orange-800 dark:bg-orange-400/10 dark:text-orange-400',
  'Out of stock': ''
}

const columns: ColumnDef<FruitProduct>[] = [
  {
    accessorKey: 'name',
    header: 'Fruit',
    cell: ({ row }) => (
      <div>
        <span className='font-medium'>{row.original.name}</span>
        <span className='text-muted-foreground block text-xs'>{row.original.sku}</span>
      </div>
    )
  },
  {
    accessorKey: 'category',
    header: 'Category',
    filterFn: 'equalsString',
    cell: ({ row }) => <span className='text-muted-foreground'>{row.original.category}</span>
  },
  {
    accessorKey: 'pricePerKg',
    header: 'Price',
    filterFn: 'inNumberRange',
    cell: ({ row }) => priceFormatter.format(row.original.pricePerKg),
    enableGlobalFilter: false
  },
  {
    accessorKey: 'weightKg',
    header: 'Kg',
    enableGlobalFilter: false
  },
  {
    accessorKey: 'quantity',
    header: 'Stock',
    cell: ({ row }) => row.original.quantity,
    enableGlobalFilter: false
  },
  {
    id: 'status',
    filterFn: (row, _columnId, value) => getStockStatus(row.original) === value,
    header: 'Status',
    enableSorting: false,
    enableGlobalFilter: false,
    cell: ({ row }) => {
      const status = getStockStatus(row.original)
      return (
        <Badge variant={statusVariants[status]} className={`rounded-sm ${statusClasses[status]}`}>
          {status}
        </Badge>
      )
    }
  }
]

const filterFruits: FilterFn<FruitProduct> = (row, _columnId, filterValue) => {
  const query = String(filterValue).trim().toLowerCase()
  if (!query) return true
  return row.original.name.toLowerCase().includes(query) || row.original.category.toLowerCase().includes(query)
}

export default function ProductsTable() {
  const [products, setProducts] = useState(() => fruitProducts)
  const [addOpen, setAddOpen] = useState(false)
  const addButtonRef = useRef<HTMLButtonElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [globalFilter, setGlobalFilter] = useState('')
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([{ id: 'name', desc: false }])
  const table = useReactTable({
    data: products,
    columns,
    state: { sorting, globalFilter, columnFilters },
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: filterFruits,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: row => row.id,
    enableSortingRemoval: false
  })

  function handleAddOpenChange(open: boolean) {
    setAddOpen(open)
    if (!open) requestAnimationFrame(() => addButtonRef.current?.focus())
  }

  function clearSearch() {
    setGlobalFilter('')
    searchInputRef.current?.focus()
  }

  function resetFilters() {
    setColumnFilters([])
    clearSearch()
  }

  return (
    <div className='min-w-0 space-y-4'>
      <div className='flex flex-wrap items-center gap-2'>
        <div className='relative w-full min-w-0 sm:max-w-xs'>
          <label htmlFor='product-search' className='sr-only'>
            Search fruits
          </label>
          <HugeiconsIcon
            icon={Search01Icon}
            className='text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2'
            aria-hidden='true'
          />
          <Input
            ref={searchInputRef}
            id='product-search'
            type='text'
            inputMode='search'
            autoComplete='off'
            spellCheck={false}
            value={globalFilter}
            onChange={event => setGlobalFilter(event.target.value)}
            placeholder='Search fruits'
            maxLength={60}
            className='focus-visible:border-foreground h-11 pr-12 pl-9 shadow-none focus-visible:ring-0'
          />
          {globalFilter && (
            <Button
              type='button'
              variant='ghost'
              size='icon'
              onClick={clearSearch}
              aria-label='Clear search'
              className='absolute top-0 right-0 size-11'
            >
              <HugeiconsIcon icon={Cancel01Icon} className='size-4' aria-hidden='true' />
            </Button>
          )}
        </div>
        <ProductsFilters columnFilters={columnFilters} onApply={setColumnFilters} />
        <Button type='button' variant='ghost' className='h-11' onClick={resetFilters}>
          Reset
        </Button>
        <Dialog open={addOpen} onOpenChange={handleAddOpenChange}>
          <DialogTrigger render={<Button ref={addButtonRef} className='h-11 w-full sm:ml-auto sm:w-auto' />}>
            <HugeiconsIcon icon={Add01Icon} aria-hidden='true' />
            Add Products
          </DialogTrigger>
          {addOpen && (
            <AddProductDialog
              products={products}
              onAddProduct={product => setProducts(current => [...current, product])}
              onClose={() => handleAddOpenChange(false)}
              returnFocus={addButtonRef}
            />
          )}
        </Dialog>
      </div>
      <div className='border-y'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id} className='bg-muted/50'>
                {headerGroup.headers.map(header => {
                  const direction = header.column.getIsSorted()
                  const label = String(header.column.columnDef.header)
                  return (
                    <TableHead
                      key={header.id}
                      className='h-11 p-0'
                      aria-sort={direction === 'asc' ? 'ascending' : direction === 'desc' ? 'descending' : 'none'}
                    >
                      {header.column.getCanSort() ? (
                        <button
                          type='button'
                          onClick={header.column.getToggleSortingHandler()}
                          className='hover:text-foreground focus-visible:ring-ring flex h-11 w-full items-center gap-1.5 px-2 text-left font-medium focus-visible:ring-2 focus-visible:outline-none'
                          aria-label={`Sort by ${label}`}
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
                    <TableCell key={cell.id} className='py-3'>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={table.getAllColumns().length} className='h-32 text-center'>
                  <p>No fruits match your search or filters.</p>
                  <Button type='button' variant='link' size='sm' className='h-11' onClick={resetFilters}>
                    Clear all
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
