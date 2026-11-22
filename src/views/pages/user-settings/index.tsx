import UserGeneral from '@/views/pages/user-settings/general'

const UserSettings = () => {
  return (
    <div>
      <div className='mb-4 md:mb-6 lg:mb-10'>
        <h1 className='text-xl font-bold'>Account & User Management</h1>
        <p className='text-muted-foreground'>Manage your account settings and user preferences.</p>
      </div>
      <UserGeneral />
    </div>
  )
}

export default UserSettings
