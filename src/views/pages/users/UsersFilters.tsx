import type { RefObject } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { USER_ROLES, USER_STATUSES } from './UsersData'

export default function UsersFilters({
  search,
  role,
  status,
  onSearchChange,
  onRoleChange,
  onStatusChange,
  onClear,
  searchRef
}: {
  search: string
  role: string
  status: string
  onSearchChange: (value: string) => void
  onRoleChange: (value: string) => void
  onStatusChange: (value: string) => void
  onClear: () => void
  searchRef: RefObject<HTMLInputElement | null>
}) {
  return (
    <>
      <Input
        ref={searchRef}
        aria-label='Search users'
        placeholder='Search users'
        value={search}
        onChange={event => onSearchChange(event.target.value)}
        type='search'
        className='focus-visible:border-foreground h-11 w-full shadow-none focus-visible:ring-0 sm:max-w-xs'
      />
      {[
        { label: 'Role', value: role, options: USER_ROLES, all: 'All roles', onChange: onRoleChange },
        { label: 'Status', value: status, options: USER_STATUSES, all: 'All statuses', onChange: onStatusChange }
      ].map(filter => (
        <Select key={filter.label} value={filter.value} onValueChange={value => filter.onChange(value ?? 'all')}>
          <SelectTrigger aria-label={filter.label} className='min-w-36 shadow-none data-[size=default]:h-11'>
            <SelectValue>{filter.value === 'all' ? filter.all : filter.value}</SelectValue>
          </SelectTrigger>
          <SelectContent className='shadow-none'>
            <SelectItem value='all' className='min-h-11'>
              {filter.all}
            </SelectItem>
            {filter.options.map(option => (
              <SelectItem key={option} value={option} className='min-h-11'>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}
      {(search || role !== 'all' || status !== 'all') && (
        <Button className='h-11' onClick={onClear}>
          Clear filters
        </Button>
      )}
    </>
  )
}
