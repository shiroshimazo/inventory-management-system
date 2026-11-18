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
import { categoriesSeed, getProductCount, type Category } from './CategoriesData'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import CategoryDialog from './CategoryDialog'
type CategoryDialogState = { mode: 'add' } | { mode: 'edit'; category: Category }

const filterCategories: FilterFn<Category> = (row, _columnId, filterValue) => {
  const query = String(filterValue).trim().toLowerCase()
  if (!query) return true
  return row.original.name.toLowerCase().includes(query) || row.original.description.toLowerCase().includes(query)
}

export default function CategoriesTable() {
  const [categories, setCategories] = useState(() => categoriesSeed)
  const [categoryDialog, setCategoryDialog] = useState<CategoryDialogState | null>(null)
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null)
  const addButtonRef = useRef<HTMLButtonElement>(null)
  const editButtonRef = useRef<HTMLButtonElement>(null)
  const deleteReturnFocusRef = useRef<HTMLButtonElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState<SortingState>([{ id: 'name', desc: false }])
  const columns = useMemo<ColumnDef<Category>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Category',
        cell: ({ row }) => <span className='font-medium'>{row.original.name}</span>
      },
      {
        accessorKey: 'description',
        header: 'Description',
        enableSorting: false,
        cell: ({ row }) => (
          <span className='text-muted-foreground block min-w-40 break-words whitespace-normal'>
            {row.original.description}
          </span>
        )
      },
      {
        id: 'count',
        accessorFn: category => getProductCount(category.name),
        header: 'Products',
        enableGlobalFilter: false,
        cell: ({ getValue }) => <span className='tabular-nums'>{getValue<number>()}</span>
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
                setCategoryDialog({ mode: 'edit', category: row.original })
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
                setDeletingCategory(row.original)
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
    data: categories,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: filterCategories,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: row => row.id,
    enableSortingRemoval: false
  })

  function handleCategoryDialogOpenChange(open: boolean) {
    if (!open) {
      setCategoryDialog(null)
    } else if (!categoryDialog) {
      setCategoryDialog({ mode: 'add' })
    }
  }

  function saveCategory(category: Category) {
    editButtonRef.current = addButtonRef.current
    setCategories(current =>
      categoryDialog?.mode === 'edit'
        ? current.map(item => (item.id === category.id ? category : item))
        : [...current, category]
    )
  }

  function removeCategory() {
    if (!deletingCategory) return
    setCategories(current => current.filter(item => item.id !== deletingCategory.id))
    deleteReturnFocusRef.current = null
    setDeletingCategory(null)
    toast.success('Category removed.')
    requestAnimationFrame(() => searchInputRef.current?.focus())
  }

  function clearSearch() {
    setGlobalFilter('')
    searchInputRef.current?.focus()
  }

  return (
    <div className='min-w-0 space-y-4'>
      <div className='flex flex-wrap items-center gap-2'>
        <div className='relative w-full min-w-0 sm:max-w-xs'>
          <label htmlFor='category-search' className='sr-only'>
            Search categories
          </label>
          <HugeiconsIcon
            icon={Search01Icon}
            className='text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2'
            aria-hidden='true'
          />
          <Input
            ref={searchInputRef}
            id='category-search'
            type='text'
            inputMode='search'
            autoComplete='off'
            spellCheck={false}
            value={globalFilter}
            onChange={event => setGlobalFilter(event.target.value)}
            placeholder='Search categories'
            maxLength={40}
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
        <Dialog open={categoryDialog !== null} onOpenChange={handleCategoryDialogOpenChange}>
          <DialogTrigger render={<Button ref={addButtonRef} className='h-11 w-full sm:ml-auto sm:w-auto' />}>
            <HugeiconsIcon icon={Add01Icon} aria-hidden='true' />
            Add category
          </DialogTrigger>
          {categoryDialog && (
            <CategoryDialog
              key={categoryDialog.mode === 'edit' ? categoryDialog.category.id : 'add'}
              categories={categories}
              category={categoryDialog.mode === 'edit' ? categoryDialog.category : undefined}
              onSaveCategory={saveCategory}
              onClose={() => setCategoryDialog(null)}
              returnFocus={categoryDialog.mode === 'edit' ? editButtonRef : addButtonRef}
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
                  <p>{categories.length ? 'No categories match your search.' : 'No categories yet.'}</p>
                  <Button
                    type='button'
                    variant='link'
                    className='h-11'
                    onClick={categories.length ? clearSearch : () => setCategoryDialog({ mode: 'add' })}
                  >
                    {categories.length ? 'Clear search' : 'Add category'}
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Dialog open={deletingCategory !== null} onOpenChange={open => !open && setDeletingCategory(null)}>
        {deletingCategory && (
          <DialogContent finalFocus={deleteReturnFocusRef} className='sm:max-w-md [&>[data-slot=dialog-close]]:size-11'>
            <DialogHeader>
              <DialogTitle className='text-xl font-semibold'>Remove category</DialogTitle>
              <DialogDescription>Remove {deletingCategory.name}? This cannot be undone.</DialogDescription>
            </DialogHeader>
            <div className='flex flex-col-reverse gap-2 sm:flex-row sm:justify-end'>
              <Button type='button' variant='outline' className='h-11' onClick={() => setDeletingCategory(null)}>
                Cancel
              </Button>
              <Button type='button' variant='destructive' className='h-11' onClick={removeCategory}>
                Remove
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
