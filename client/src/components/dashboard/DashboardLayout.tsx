import React, { ReactNode } from 'react'
import { DashboardSidebar } from './DashboardSidebar'
import { DashboardHeader } from './DashboardHeader'
import { useSidebar } from '@/hooks/useDashboard'
import { UserProfile } from '@/types/dashboard.types'

interface DashboardLayoutProps {
  children: ReactNode
  user: UserProfile
  className?: string
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  user,
  className = '',
}) => {
  const { isOpen, toggle } = useSidebar(true)

  const handleSearch = (query: string) => {
    console.log('Searching for:', query)
    // Implementar lógica de busca aqui
  }

  const handleNotificationClick = () => {
    console.log('Notification clicked')
    // Implementar lógica de notificação aqui
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <DashboardSidebar
        isOpen={isOpen}
        onToggle={toggle}
        className="hidden md:flex"
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <DashboardHeader
          onMenuClick={toggle}
          onSearch={handleSearch}
          onNotificationClick={handleNotificationClick}
          user={user}
          className="border-b border-border/40"
        />

        {/* Page Content */}
        <main className={`flex-1 overflow-y-auto p-4 md:p-6 ${className}`}>
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
