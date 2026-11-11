import { useState } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { HugeiconsIcon } from '@/components/ui/hugeicons'
import { Cancel01Icon } from '@hugeicons/core-free-icons'
import LogoSvg from '@/assets/svg/logo'
import {
  AnimatedSidebar,
  AnimatedSidebarClose,
  AnimatedSidebarContent,
  AnimatedSidebarGroup,
  AnimatedSidebarGroupContent,
  AnimatedSidebarGroupLabel,
  AnimatedSidebarHeader,
  AnimatedSidebarMenu,
  AnimatedSidebarMenuButton,
  AnimatedSidebarMenuItem,
  AnimatedSidebarMenuSub,
  AnimatedSidebarMenuSubButton,
  AnimatedSidebarMenuSubItem,
  AnimatedSidebarRail,
  useAnimatedSidebar
} from '@/components/motion/animated-sidebar'
import { navItems, type MenuLeafSubItem, type MenuSubItem } from '@/configs/navConfig'
import { navIcons } from '@/configs/navIcons'
import themeConfig from '@/configs/themeConfig'
import { cn } from '@/lib/utils'

export default function SidebarLayout() {
  const location = useLocation()
  const { setOpenMobile } = useAnimatedSidebar()
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})
  const searchParams = new URLSearchParams(location.searchStr)

  const isActive = (item: MenuLeafSubItem): boolean => {
    if (item.activePath) return location.pathname.startsWith(item.activePath)
    const [pathname, query] = item.href.split('?')
    return (
      location.pathname === pathname &&
      [...new URLSearchParams(query)].every(([key, value]) => searchParams.get(key) === value)
    )
  }
  const isChildActive = (item: MenuSubItem): boolean =>
    'childItems' in item ? item.childItems.some(isActive) : isActive(item)
  const toggle = (key: string, open: boolean) => {
    setOpenItems(current => ({ ...current, [key]: !open }))
  }
  const leaf = (item: MenuLeafSubItem) => (
    <AnimatedSidebarMenuSubItem key={item.label}>
      <AnimatedSidebarMenuSubButton
        href={item.href}
        target={item.target}
        isActive={isActive(item)}
        className='min-h-10 text-sm'
      >
        {item.label}
        {item.badge && <span className={cn('ml-2 text-xs', item.badgeClassName)}>{item.badge}</span>}
      </AnimatedSidebarMenuSubButton>
    </AnimatedSidebarMenuSubItem>
  )

  return (
    <AnimatedSidebar ariaLabel='Main navigation' collapsible='icon' panelClassName='bg-sidebar text-sidebar-foreground'>
      <AnimatedSidebarHeader>
        <div className='flex min-h-12 items-center gap-2'>
          <Link
            to={themeConfig.homePageUrl}
            onClick={() => setOpenMobile(false)}
            aria-label={themeConfig.templateName}
            className='focus-visible:outline-ring flex min-w-0 flex-1 items-center gap-2.5 overflow-hidden rounded-lg p-2 focus-visible:outline-2'
          >
            <LogoSvg className='[&_rect]:fill-sidebar [&_rect:first-child]:fill-primary size-7 shrink-0' />
            <span className='truncate text-lg font-semibold group-data-[state=collapsed]/sidebar:hidden'>
              {themeConfig.templateName}
            </span>
          </Link>
          <AnimatedSidebarClose className='md:hidden'>
            <HugeiconsIcon icon={Cancel01Icon} className='size-5' />
          </AnimatedSidebarClose>
        </div>
      </AnimatedSidebarHeader>
      <AnimatedSidebarContent>
        {navItems.map((group, index) => (
          <AnimatedSidebarGroup key={group.groupLabel ?? index}>
            {group.groupLabel && <AnimatedSidebarGroupLabel>{group.groupLabel}</AnimatedSidebarGroupLabel>}
            <AnimatedSidebarGroupContent>
              <AnimatedSidebarMenu>
                {group.items.map(item => {
                  const key = `${group.groupLabel ?? index}::${item.label}`
                  const active =
                    !item.disabled && (item.childItems ? item.childItems.some(isChildActive) : isActive(item))
                  const open = openItems[key] ?? active
                  return (
                    <AnimatedSidebarMenuItem key={key}>
                      <AnimatedSidebarMenuButton
                        icon={<HugeiconsIcon icon={navIcons[item.icon]} className='size-5' />}
                        href={item.href}
                        target={'target' in item ? item.target : undefined}
                        badge={item.badge}
                        disabled={item.disabled}
                        isActive={active}
                        ariaExpanded={item.childItems ? open : undefined}
                        onSelect={item.childItems ? () => toggle(key, open) : undefined}
                        className='min-h-10'
                      >
                        {item.label}
                      </AnimatedSidebarMenuButton>
                      {item.childItems && (
                        <AnimatedSidebarMenuSub open={open}>
                          {item.childItems.map(child => {
                            if (!('childItems' in child)) return leaf(child)
                            const childKey = `${key}::${child.label}`
                            const childOpen = openItems[childKey] ?? isChildActive(child)
                            return (
                              <AnimatedSidebarMenuSubItem key={childKey}>
                                <AnimatedSidebarMenuButton
                                  ariaExpanded={childOpen}
                                  onSelect={() => toggle(childKey, childOpen)}
                                >
                                  {child.label}
                                </AnimatedSidebarMenuButton>
                                <AnimatedSidebarMenuSub open={childOpen}>
                                  {child.childItems.map(leaf)}
                                </AnimatedSidebarMenuSub>
                              </AnimatedSidebarMenuSubItem>
                            )
                          })}
                        </AnimatedSidebarMenuSub>
                      )}
                    </AnimatedSidebarMenuItem>
                  )
                })}
              </AnimatedSidebarMenu>
            </AnimatedSidebarGroupContent>
          </AnimatedSidebarGroup>
        ))}
      </AnimatedSidebarContent>
      <AnimatedSidebarRail />
    </AnimatedSidebar>
  )
}
