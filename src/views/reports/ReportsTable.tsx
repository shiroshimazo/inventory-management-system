import { useMemo, useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState
} from '@tanstack/react-table'
import { ArrowDown01Icon, ArrowUp01Icon, ArrowUpDownIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@/components/ui/hugeicons'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { type ReportRow } from '@/views/reports/ReportsData'
import { formatCentavos } from '@/views/reports/ReportsFormat'
import ReportsState, { type SectionState } from '@/views/reports/ReportsStates'

const numericColumns = ['units', 'totalCentavos']

export default function ReportsTable({ rows, state, onClearFilters }: {
  rows: ReportRow[]
  state: SectionState
  onClearFilters: () => void
}) {
  const [sorting, setSorting] = useState<SortingState>([])
  const columns = useMemo<ColumnDef<ReportRow>[]>(
    () => [
      {
        accessorKey: 'reference',
        header: 'Reference',
        cell: ({ row }) => <span className='font-medium'>{row.original.reference}</span>
      },
      {
        accessorKey: 'soldAt',
        header: 'Date',
        cell: ({ row }) => <time dateTime={row.original.soldAt}>{row.original.dateLabel}</time>
      },
      { accessorKey: 'productName', header: 'Product' },
      { accessorKey: 'category', header: 'Category' },
      { accessorKey: 'units', header: 'Units' },
      {
        accessorKey: 'totalCentavos',
        header: 'Total',
        cell: ({ row }) => formatCentavos(row.original.totalCentavos)
      }
    ],
    []
  )
  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: row => row.id,
    enableSortingRemoval: false
  })

  if (state !== 'ready') {
    return <ReportsState state={state} onClearFilters={onClearFilters} />
  }

  return (
    <div className='min-w-0'>
      <Table
        aria-label='Sales report'
        tabIndex={0}
        className='focus-visible:outline-primary focus-visible:outline-2 focus-visible:-outline-offset-2'
      >
        <TableHeader>
          {table.getHeaderGroups().map(group => (
            <TableRow key={group.id}>
              {group.headers.map(header => {
                const direction = header.column.getIsSorted()
                const label = String(header.column.columnDef.header)
                const alignRight = numericColumns.includes(header.column.id)
                return (
                  <TableHead key={header.id} scope='col' className='h-11 p-0' aria-sort={
                    direction === 'asc' ? 'ascending' : direction === 'desc' ? 'descending' : 'none'
                  }>
                    <button
                      type='button'
                      onClick={header.column.getToggleSortingHandler()}
                      aria-label={`Sort by ${label}`}
                      className={`hover:text-foreground flex h-11 w-full items-center gap-1.5 px-2 font-medium focus-visible:outline-primary focus-visible:outline-2 focus-visible:-outline-offset-2 ${alignRight ? 'justify-end' : 'text-left'}`}
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
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map(row => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map(cell => (
                <TableCell
                  key={cell.id}
                  className={numericColumns.includes(cell.column.id) ? 'text-right tabular-nums' : undefined}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
