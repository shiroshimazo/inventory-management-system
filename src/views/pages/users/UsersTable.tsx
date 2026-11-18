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
  Delete01Icon,
  Edit04Icon
} from '@hugeicons/core-free-icons'
import { toast } from 'sonner'
import { HugeiconsIcon } from '@/components/ui/hugeicons'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import UsersFilters from './UsersFilters'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { usersSeed, formatUserDate, type User } from './UsersData'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import UserDialog from './UserDialog'
type UserDialogState = { mode: 'add' } | { mode: 'edit'; user: User }

const filterUsers: FilterFn<User> = (row, _columnId, filterValue) => {
  const query = String(filterValue).trim().toLowerCase()
  if (!query) return true
  return row.original.name.toLowerCase().includes(query) || row.original.email.toLowerCase().includes(query)
}

export default function UsersTable() {
  const [users, setUsers] = useState(() => usersSeed)
  const [userDialog, setUserDialog] = useState<UserDialogState | null>(null)
  const [deletingUser, setDeletingUser] = useState<User | null>(null)
  const editButtonRef = useRef<HTMLButtonElement>(null)
  const deleteReturnFocusRef = useRef<HTMLButtonElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [globalFilter, setGlobalFilter] = useState('')
  const [role, setRole] = useState('all')
  const [status, setStatus] = useState('all')
  const [sorting, setSorting] = useState<SortingState>([{ id: 'name', desc: false }])
  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'User',
        cell: ({ row }) => (
          <div>
            <span className='font-medium'>{row.original.name}</span>
            <span className='text-muted-foreground block text-sm'>{row.original.email}</span>
          </div>
        )
      },
      {
        accessorKey: 'role',
        header: 'Role',
        enableSorting: false,
        cell: ({ row }) => (
          <Badge variant='outline' className='rounded-[12px]'>
            {row.original.role}
          </Badge>
        )
      },
      {
        accessorKey: 'status',
        header: 'Status',
        enableSorting: false,
        cell: ({ row }) => (
          <Badge
            variant='secondary'
            className={
              row.original.status === 'Active'
                ? 'rounded-[12px] border-(--up-border) bg-(--up-bg) text-(--up-text)'
                : 'bg-muted text-muted-foreground rounded-[12px]'
            }
          >
            {row.original.status}
          </Badge>
        )
      },
      {
        accessorKey: 'joinedAt',
        header: 'Joined',
        cell: ({ row }) => formatUserDate(row.original.joinedAt)
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
                setUserDialog({ mode: 'edit', user: row.original })
              }}
            >
              <HugeiconsIcon icon={Edit04Icon} className='size-4' aria-hidden='true' />
            </Button>
            <Button
              type='button'
              variant='ghost'
              size='icon'
              className='text-destructive hover:bg-destructive/10 hover:text-destructive size-11'
              aria-label={`Delete ${row.original.name}`}
              onClick={event => {
                deleteReturnFocusRef.current = event.currentTarget
                setDeletingUser(row.original)
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
    data: useMemo(
      () =>
        users.filter(user => (role === 'all' || user.role === role) && (status === 'all' || user.status === status)),
      [users, role, status]
    ),
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: filterUsers,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: row => row.id,
    enableSortingRemoval: false
  })

  function handleUserDialogOpenChange(open: boolean) {
    if (!open) {
      setUserDialog(null)
    } else if (!userDialog) {
      setUserDialog({ mode: 'add' })
    }
  }

  function saveUser(user: User) {
    setUsers(current =>
      userDialog?.mode === 'edit' ? current.map(item => (item.id === user.id ? user : item)) : [...current, user]
    )
  }

  function removeUser() {
    if (!deletingUser) return
    setUsers(current => current.filter(item => item.id !== deletingUser.id))
    deleteReturnFocusRef.current = null
    setDeletingUser(null)
    toast.success('User deleted.')
    requestAnimationFrame(() => searchInputRef.current?.focus())
  }

  function clearSearch() {
    setGlobalFilter('')
    setRole('all')
    setStatus('all')
    searchInputRef.current?.focus()
  }

  return (
    <div className='min-w-0 space-y-4'>
      <div className='flex flex-wrap items-center gap-2'>
        <UsersFilters
          search={globalFilter}
          role={role}
          status={status}
          onSearchChange={setGlobalFilter}
          onRoleChange={setRole}
          onStatusChange={setStatus}
          onClear={clearSearch}
          searchRef={searchInputRef}
        />
        <Dialog open={userDialog !== null} onOpenChange={handleUserDialogOpenChange}>
          <DialogTrigger
            render={
              <Button
                id='add-user'
                onClick={event => {
                  editButtonRef.current = event.currentTarget
                }}
                className='h-11 w-full sm:ml-auto sm:w-auto'
              />
            }
          >
            <HugeiconsIcon icon={Add01Icon} aria-hidden='true' />
            Add user
          </DialogTrigger>
          {userDialog && (
            <UserDialog
              key={userDialog.mode === 'edit' ? userDialog.user.id : 'add'}
              users={users}
              user={userDialog.mode === 'edit' ? userDialog.user : undefined}
              onSave={saveUser}
              onClose={() => setUserDialog(null)}
              returnFocus={editButtonRef}
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
                  <p>{users.length ? 'No users match your filters.' : 'No users yet.'}</p>
                  <Button
                    type='button'
                    variant='link'
                    className='h-11'
                    onClick={
                      users.length
                        ? clearSearch
                        : event => {
                            editButtonRef.current = event.currentTarget
                            setUserDialog({ mode: 'add' })
                          }
                    }
                  >
                    {users.length ? 'Clear filters' : 'Add user'}
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Dialog open={deletingUser !== null} onOpenChange={open => !open && setDeletingUser(null)}>
        {deletingUser && (
          <DialogContent
            finalFocus={deleteReturnFocusRef}
            className='duration-200 ease-out motion-reduce:animate-none sm:max-w-md [&>[data-slot=dialog-close]]:size-11'
          >
            <DialogHeader>
              <DialogTitle className='text-xl font-semibold'>Delete user?</DialogTitle>
              <DialogDescription>
                This removes {deletingUser.name} from the team. This cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className='flex flex-col-reverse gap-2 sm:flex-row sm:justify-end'>
              <Button type='button' variant='outline' className='h-11' onClick={() => setDeletingUser(null)}>
                Cancel
              </Button>
              <Button type='button' variant='destructive' className='h-11' onClick={removeUser}>
                Delete user
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
