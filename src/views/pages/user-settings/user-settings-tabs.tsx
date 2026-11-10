'use client'

import { useNavigate, useSearch } from '@tanstack/react-router'

// Component Imports
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import UserGeneral from '@/views/pages/user-settings/general'
import Workspace from '@/views/pages/user-settings/workspace'

const tabs = [
  {
    name: 'General',
    value: 'general',
    content: <UserGeneral />
  },
  {
    name: 'Workspace',
    value: 'workspace',
    content: <Workspace />
  }
]

const UserSettingsTabs = () => {
  const { setting = 'general' } = useSearch({ from: '/_pages/pages/user-settings' })
  const navigate = useNavigate({ from: '/pages/user-settings' })

  return (
    <div className='w-full'>
      <Tabs
        value={setting}
        onValueChange={value => {
          void navigate({ search: { setting: value === 'workspace' ? 'workspace' : 'general' } })
        }}
      >
        <div className='overflow-x-auto sm:overflow-visible'>
          <TabsList
            variant='line'
            className='h-fit! w-max min-w-full flex-nowrap justify-start gap-0 rounded-none border-b p-0 sm:w-full sm:flex-wrap'
          >
            {tabs.map(tab => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className='not-data-active:hover:group-data-horizontal/tabs:after:bg-muted-foreground/30 shrink-0 border-0 group-data-horizontal/tabs:after:bottom-[-0.5px] not-data-active:hover:group-data-horizontal/tabs:after:opacity-100 sm:flex-0'
              >
                {tab.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {tabs.map(tab => (
          <TabsContent key={tab.value} value={tab.value}>
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

export default UserSettingsTabs
