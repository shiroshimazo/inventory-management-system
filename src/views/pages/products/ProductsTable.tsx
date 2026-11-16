import { useMemo, useRef, useState } from 'react'
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
  Delete01Icon,
  Edit04Icon,
  Search01Icon
} from '@hugeicons/core-free-icons'
import { toast } from 'sonner'
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

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import AddProductDialog from './AddProductDialog'
const statusVariants = { 'Out of stock': 'destructive', 'Low stock': 'secondary', 'In stock': 'outline' } as const

const statusClasses = {
  'In stock': 'bg-[#142c1a] text-[#2ab34c]',
  'Low stock': 'bg-[#33250e] text-[#ff9f0a]',
  'Out of stock': 'bg-[#331716] text-[#ff453a]'
}

type ProductDialogState = { mode: 'add' } | { mode: 'edit'; product: FruitProduct }

const filterFruits: FilterFn<FruitProduct> = (row, _columnId, filterValue) => {
  const query = String(filterValue).trim().toLowerCase()
  if (!query) return true
  return row.original.name.toLowerCase().includes(query) || row.original.category.toLowerCase().includes(query)
}

export default function ProductsTable() {
  const [products, setProducts] = useState(() => fruitProducts)
  const [productDialog, setProductDialog] = useState<ProductDialogState | null>(null)
  const [deletingProduct, setDeletingProduct] = useState<FruitProduct | null>(null)
  const addButtonRef = useRef<HTMLButtonElement>(null)
  const editButtonRef = useRef<HTMLButtonElement>(null)
  const deleteReturnFocusRef = useRef<HTMLButtonElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [globalFilter, setGlobalFilter] = useState('')
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([{ id: 'name', desc: false }])
  const columns = useMemo<ColumnDef<FruitProduct>[]>(
    () => [
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
      },
      {
        id: 'actions',
        header: 'Actions',
        enableSorting: false,
        enableGlobalFilter: false,
        cell: ({ row }) => (
          <div className='flex items-center gap-1'>
            <Button
              type='button'
              variant='ghost'
              size='icon'
              className='size-11'
              aria-label={`Edit ${row.original.name}`}
              onClick={event => {
                editButtonRef.current = event.currentTarget
                setProductDialog({ mode: 'edit', product: row.original })
              }}
            >
              <HugeiconsIcon icon={Edit04Icon} className='size-4' aria-hidden='true' />
            </Button>
            <Button
              type='button'
              variant='ghost'
              size='icon'
              className='text-destructive hover:bg-destructive/10 hover:text-destructive size-11'
              aria-label={`Remove ${row.original.name}`}
              onClick={event => {
                deleteReturnFocusRef.current = event.currentTarget
                setDeletingProduct(row.original)
              }}
            >
              <HugeiconsIcon icon={Delete01Icon} className='size-4' aria-hidden='true' />
            </Button>
          </div>
        )
      }
    ],
    []
  )
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

  function handleProductDialogOpenChange(open: boolean) {
    if (!open) {
      setProductDialog(null)
    } else if (!productDialog) {
      setProductDialog({ mode: 'add' })
    }
  }

  function saveProduct(product: FruitProduct) {
    setProducts(current =>
      productDialog?.mode === 'edit'
        ? current.map(item => (item.id === product.id ? product : item))
        : [...current, product]
    )
  }

  function removeProduct() {
    if (!deletingProduct) return
    setProducts(current => current.filter(item => item.id !== deletingProduct.id))
    deleteReturnFocusRef.current = null
    setDeletingProduct(null)
    toast.success('Product removed.')
    requestAnimationFrame(() => searchInputRef.current?.focus())
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
            Search fruits, Category, Price
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
            placeholder='Search Fruits, Category, Price'
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
        <Dialog open={productDialog !== null} onOpenChange={handleProductDialogOpenChange}>
          <DialogTrigger render={<Button ref={addButtonRef} className='h-11 w-full sm:ml-auto sm:w-auto' />}>
            <HugeiconsIcon icon={Add01Icon} aria-hidden='true' />
            Add Products
          </DialogTrigger>
          {productDialog && (
            <AddProductDialog
              key={productDialog.mode === 'edit' ? productDialog.product.id : 'add'}
              products={products}
              product={productDialog.mode === 'edit' ? productDialog.product : undefined}
              onSaveProduct={saveProduct}
              onClose={() => setProductDialog(null)}
              returnFocus={productDialog.mode === 'edit' ? editButtonRef : addButtonRef}
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
      <Dialog open={deletingProduct !== null} onOpenChange={open => !open && setDeletingProduct(null)}>
        {deletingProduct && (
          <DialogContent finalFocus={deleteReturnFocusRef} className='sm:max-w-md'>
            <DialogHeader>
              <DialogTitle className='text-xl font-semibold'>Remove product</DialogTitle>
              <DialogDescription>Remove {deletingProduct.name}? This cannot be undone.</DialogDescription>
            </DialogHeader>
            <div className='flex flex-col-reverse gap-2 sm:flex-row sm:justify-end'>
              <Button type='button' variant='outline' className='h-11' onClick={() => setDeletingProduct(null)}>
                Cancel
              </Button>
              <Button type='button' variant='destructive' className='h-11' onClick={removeProduct}>
                Remove
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
