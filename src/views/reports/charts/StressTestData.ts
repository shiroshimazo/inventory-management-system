import type { CategorySale, LowStockItem, SalesPoint, StatusSpend } from '@/views/reports/ReportsData'

export const stressSalesSeries: SalesPoint[] = [
  { label: '2026-11-01', revenueCentavos: 0 },
  { label: '2026-11-02', revenueCentavos: 1 },
  { label: '2026-11-03', revenueCentavos: 1284 },
  { label: 'Benachrichtigungseinstellungen', revenueCentavos: 145000 },
  { label: 'Paramètres de confidentialité et de sécurité', revenueCentavos: 340000 },
  { label: 'customer-feedback-from-enterprise-onboarding', revenueCentavos: 1250000 },
  { label: '王秀英', revenueCentavos: 420000 },
  { label: 'نور الهدى عبد الرحمن', revenueCentavos: 315000 },
  { label: 'Đặng Thị Ngọc Hân', revenueCentavos: 289000 },
  { label: '🦊 Fox', revenueCentavos: 76000 },
  { label: '👩🏽‍💻 Priya', revenueCentavos: 54000 },
  { label: 'J', revenueCentavos: 1000 },
  { label: '  Sam   Lee ', revenueCentavos: 2500 },
  { label: '', revenueCentavos: 0 },
  { label: '   ', revenueCentavos: 1 },
  { label: 'Untitled', revenueCentavos: 1284 },
  { label: 'Christopher Alexander Montgomery III', revenueCentavos: 1000000 },
  { label: 'Navel orange', revenueCentavos: -4250 },
  { label: 'Navel orange', revenueCentavos: 123456789 },
  { label: '<script>alert(1)</script>', revenueCentavos: 0 },
  ...Array.from({ length: 52 }, (_, index) => ({
    label: new Date(Date.UTC(2026, 11, 1) + index * 86_400_000).toISOString().slice(0, 10),
    revenueCentavos: (index + 1) * 12_345
  }))
]

export const stressSalesByCategory: CategorySale[] = [
  { category: 'Berries', revenueCentavos: 0, unitsSold: 0 },
  { category: 'Citrus', revenueCentavos: 1, unitsSold: 1 },
  { category: 'Benachrichtigungseinstellungen', revenueCentavos: 1284, unitsSold: 1 },
  { category: 'Paramètres de confidentialité et de sécurité', revenueCentavos: 1000000, unitsSold: 12 },
  { category: 'customer-feedback-from-enterprise-onboarding', revenueCentavos: 123456789, unitsSold: 999 },
  { category: '王秀英', revenueCentavos: 34500, unitsSold: 3 },
  { category: 'نور الهدى عبد الرحمن', revenueCentavos: 28100, unitsSold: 2 },
  { category: 'Đặng Thị Ngọc Hân', revenueCentavos: 0, unitsSold: 0 },
  { category: '🦊 Fox', revenueCentavos: -4250, unitsSold: -1 },
  { category: 'J', revenueCentavos: 1, unitsSold: 1 },
  { category: '', revenueCentavos: 0, unitsSold: 0 },
  { category: '   ', revenueCentavos: 1284, unitsSold: 1 },
  { category: 'Untitled', revenueCentavos: 500, unitsSold: 1 },
  { category: 'Pome', revenueCentavos: 1000000, unitsSold: 1000000 },
  { category: 'Tropical', revenueCentavos: 987654321, unitsSold: 1284 },
  { category: 'Stone fruit', revenueCentavos: 67000, unitsSold: 1 },
  { category: 'Berries', revenueCentavos: 0, unitsSold: 0 }
]

export const stressPoSpendByStatus: StatusSpend[] = [
  { status: 'Draft', spendCentavos: 0, count: 0 },
  { status: 'Ordered', spendCentavos: 1, count: 1 },
  { status: 'Received', spendCentavos: 1284, count: 1 },
  { status: 'Cancelled', spendCentavos: 1000000, count: 1 },
  { status: 'Ordered', spendCentavos: -4250, count: 1 },
  { status: 'Received', spendCentavos: 1234567890, count: 1284 }
]

export const stressLowStockItems: LowStockItem[] = [
  { name: 'Blueberry', quantity: 0, reorderLevel: 32 },
  { name: 'Peach', quantity: 1, reorderLevel: 1 },
  { name: 'Benachrichtigungseinstellungen', quantity: 0, reorderLevel: 0 },
  { name: 'Paramètres de confidentialité et de sécurité', quantity: 1, reorderLevel: 0 },
  { name: 'customer-feedback-from-enterprise-onboarding', quantity: 1284, reorderLevel: 1000000 },
  { name: '王秀英', quantity: 3, reorderLevel: 8 },
  { name: 'نور الهدى عبد الرحمن', quantity: 2, reorderLevel: 10 },
  { name: 'Đặng Thị Ngọc Hân', quantity: 4, reorderLevel: 4 },
  { name: '🦊 Fox', quantity: 1, reorderLevel: 100 },
  { name: '👩🏽‍💻 Priya', quantity: 1, reorderLevel: 12 },
  { name: 'J', quantity: 1, reorderLevel: 1 },
  { name: '  Sam   Lee ', quantity: 1, reorderLevel: 9 },
  { name: '', quantity: 0, reorderLevel: 0 },
  { name: '   ', quantity: 1, reorderLevel: 1 },
  { name: 'Untitled', quantity: 1, reorderLevel: 2 },
  { name: 'Christopher Alexander Montgomery III', quantity: 1, reorderLevel: 1000000 },
  { name: 'Fuji apple', quantity: -5, reorderLevel: 75 },
  { name: 'Fuji apple', quantity: 1, reorderLevel: 1 }
]
