import { CancelCircleIcon, CheckmarkCircle02Icon, PackageIcon, Tag01Icon } from '@hugeicons/core-free-icons'
import { withMockStatisticsHistory } from '@/views/dashboards/statistics/StatisticsData'
import StatisticsGrid from '@/views/dashboards/statistics/StatisticsGrid'
import { getProductCount, type Category } from './CategoriesData'

export default function CategoriesSummary({ categories }: { categories: Category[] }) {
  const summary = withMockStatisticsHistory([
    { label: 'Total categories', value: categories.length, icon: Tag01Icon },
    {
      label: 'Active',
      value: categories.filter(category => category.status === 'Active').length,
      icon: CheckmarkCircle02Icon
    },
    {
      label: 'Inactive',
      value: categories.filter(category => category.status === 'Inactive').length,
      icon: CancelCircleIcon,
      trend: 'down'
    },
    {
      label: 'Total products',
      value: categories.reduce((total, category) => total + getProductCount(category.name), 0),
      icon: PackageIcon
    }
  ])

  return <StatisticsGrid label='Category summary' statistics={summary} className='sm:grid-cols-2 xl:grid-cols-4' />
}
