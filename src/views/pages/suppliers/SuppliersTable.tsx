import { useMemo, useRef, useState } from 'react'
import type { ColumnDef, FilterFn, SortingState } from '@tanstack/react-table'
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
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { suppliersSeed, MAX_SUPPLIER_NAME_LENGTH, type Supplier } from './SuppliersData'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import SupplierDialog from './SupplierDialog'
type SupplierDialogState = { mode: 'add' } | { mode: 'edit'; supplier: Supplier }

const filterSuppliers: FilterFn<Supplier> = (row, _columnId, filterValue) => {
  const query = String(filterValue).trim().toLowerCase()
  if (!query) return true
  const { name, contactPerson, phone, email, address } = row.original
  return (
    [name, contactPerson, phone, email, address].some(value => value.toLowerCase().includes(query)) ||
    (/^[0-9]+$/.test(query) && phone.replace(/\D/g, '').includes(query))
  )
}

export default function SuppliersTable() {
  const [suppliers, setSuppliers] = useState(() => suppliersSeed)
  const [supplierDialog, setSupplierDialog] = useState<SupplierDialogState | null>(null)
  const [deletingSupplier, setDeletingSupplier] = useState<Supplier | null>(null)
  const addButtonRef = useRef<HTMLButtonElement>(null)
  const editButtonRef = useRef<HTMLButtonElement>(null)
  const deleteReturnFocusRef = useRef<HTMLElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState<SortingState>([{ id: 'name', desc: false }])
  const columns = useMemo<ColumnDef<Supplier>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Supplier',
        cell: ({ row }) => <span className='font-medium'>{row.original.name}</span>
      },
      { accessorKey: 'contactPerson', header: 'Contact person' },
      {
        accessorKey: 'phone',
        header: 'Phone',
        enableSorting: false,
        cell: ({ row }) => <span className='whitespace-nowrap'>{row.original.phone}</span>
      },
      {
        accessorKey: 'email',
        header: 'Email',
        enableSorting: false,
        cell: ({ row }) => (
          <span className='text-muted-foreground block min-w-48 break-words whitespace-normal'>
            {row.original.email}
          </span>
        )
      },
      {
        accessorKey: 'address',
        header: 'Address',
        enableSorting: false,
        cell: ({ row }) => (
          <span className='text-muted-foreground block min-w-64 break-words whitespace-normal'>
            {row.original.address}
          </span>
        )
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
                setSupplierDialog({ mode: 'edit', supplier: row.original })
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
                setDeletingSupplier(row.original)
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
    data: suppliers,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: filterSuppliers,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: row => row.id,
    enableSortingRemoval: false
  })

  function handleSupplierDialogOpenChange(open: boolean) {
    if (!open) {
      setSupplierDialog(null)
    } else if (!supplierDialog) {
      setSupplierDialog({ mode: 'add' })
    }
  }

  function saveSupplier(supplier: Supplier) {
    setSuppliers(current =>
      supplierDialog?.mode === 'edit'
        ? current.map(item => (item.id === supplier.id ? supplier : item))
        : [...current, supplier]
    )
  }

  function removeSupplier() {
    if (!deletingSupplier) return
    setSuppliers(current => current.filter(item => item.id !== deletingSupplier.id))
    deleteReturnFocusRef.current = searchInputRef.current
    setDeletingSupplier(null)
    toast.success('Supplier removed.')
  }

  function clearSearch() {
    setGlobalFilter('')
    searchInputRef.current?.focus()
  }

  return (
    <div className='min-w-0 space-y-4'>
      <div className='flex flex-wrap items-center gap-2'>
        <div className='relative w-full min-w-0 sm:max-w-xs'>
          <label htmlFor='supplier-search' className='sr-only'>
            Search suppliers
          </label>
          <HugeiconsIcon
            icon={Search01Icon}
            className='text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2'
            aria-hidden='true'
          />
          <Input
            ref={searchInputRef}
            id='supplier-search'
            type='text'
            inputMode='search'
            autoComplete='off'
            spellCheck={false}
            value={globalFilter}
            onChange={event => setGlobalFilter(event.target.value)}
            placeholder='Search suppliers'
            maxLength={MAX_SUPPLIER_NAME_LENGTH}
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
        <Button type='button' className='h-11' onClick={clearSearch}>
          Reset
        </Button>
        <Dialog open={supplierDialog !== null} onOpenChange={handleSupplierDialogOpenChange}>
          <DialogTrigger
            onClick={event => {
              addButtonRef.current = event.currentTarget
            }}
            render={<Button ref={addButtonRef} className='h-11 w-full sm:ml-auto sm:w-auto' />}
          >
            <HugeiconsIcon icon={Add01Icon} aria-hidden='true' />
            Add supplier
          </DialogTrigger>
          {supplierDialog && (
            <SupplierDialog
              key={supplierDialog.mode === 'edit' ? supplierDialog.supplier.id : 'add'}
              suppliers={suppliers}
              supplier={supplierDialog.mode === 'edit' ? supplierDialog.supplier : undefined}
              onSaveSupplier={saveSupplier}
              onClose={() => setSupplierDialog(null)}
              returnFocus={supplierDialog.mode === 'edit' ? editButtonRef : addButtonRef}
            />
          )}
        </Dialog>
      </div>
      <div className='borderline borderline-surface min-w-0 p-6'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
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
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={table.getAllColumns().length} className='h-32 text-center'>
                  <p>{suppliers.length ? 'No suppliers match your search.' : 'No suppliers yet.'}</p>
                  <Button
                    type='button'
                    variant='link'
                    className='h-11'
                    onClick={
                      suppliers.length
                        ? clearSearch
                        : event => {
                            addButtonRef.current = event.currentTarget
                            setSupplierDialog({ mode: 'add' })
                          }
                    }
                  >
                    {suppliers.length ? 'Clear search' : 'Add supplier'}
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Dialog open={deletingSupplier !== null} onOpenChange={open => !open && setDeletingSupplier(null)}>
        {deletingSupplier && (
          <DialogContent finalFocus={deleteReturnFocusRef} className='sm:max-w-md [&>[data-slot=dialog-close]]:size-11'>
            <DialogHeader>
              <DialogTitle className='text-xl font-semibold'>Remove supplier</DialogTitle>
              <DialogDescription>Remove {deletingSupplier.name}? This cannot be undone.</DialogDescription>
            </DialogHeader>
            <div className='flex flex-col-reverse gap-2 sm:flex-row sm:justify-end'>
              <Button type='button' variant='outline' className='h-11' onClick={() => setDeletingSupplier(null)}>
                Cancel
              </Button>
              <Button type='button' variant='destructive' className='h-11' onClick={removeSupplier}>
                Remove
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
