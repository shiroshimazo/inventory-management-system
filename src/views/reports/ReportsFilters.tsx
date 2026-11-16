import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { productCategories } from '@/views/pages/products/FruitProductsData'
import {
  ALL_CATEGORIES,
  REPORT_DATE_PRESETS,
  type ReportDatePreset,
  type ReportFilters
} from '@/views/reports/ReportsData'

const categoryOptions = [
  { value: ALL_CATEGORIES, label: 'All categories' },
  ...productCategories.map(category => ({ value: category, label: category }))
]

export default function ReportsFilters({
  filters,
  onDatePresetChange,
  onCategoryChange,
  onResetDatePreset,
  onResetCategory
}: {
  filters: ReportFilters
  onDatePresetChange: (preset: ReportDatePreset) => void
  onCategoryChange: (category: string) => void
  onResetDatePreset: () => void
  onResetCategory: () => void
}) {
  return (
    <div className='flex flex-wrap items-center gap-4'>
      <div className='flex items-center gap-2'>
        <Select
          value={filters.datePreset}
          onValueChange={value => {
            if (value) onDatePresetChange(value as ReportDatePreset)
          }}
          items={REPORT_DATE_PRESETS}
        >
          <SelectTrigger aria-label='Date range' className='data-[size=default]:h-11'>
            <span>Date:</span>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {REPORT_DATE_PRESETS.map(preset => (
              <SelectItem key={preset.value} value={preset.value} className='min-h-11'>
                {preset.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type='button' variant='ghost' className='h-11' onClick={onResetDatePreset}>
          Reset date
        </Button>
      </div>

      <div className='flex items-center gap-2'>
        <Select
          value={filters.category}
          onValueChange={value => {
            if (value) onCategoryChange(value)
          }}
          items={categoryOptions}
        >
          <SelectTrigger aria-label='Category' className='data-[size=default]:h-11'>
            <span>Category:</span>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categoryOptions.map(option => (
              <SelectItem key={option.value} value={option.value} className='min-h-11'>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type='button' variant='ghost' className='h-11' onClick={onResetCategory}>
          Reset category
        </Button>
      </div>
    </div>
  )
}
