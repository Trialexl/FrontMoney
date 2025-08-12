'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'
import { 
  Home, 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  ArrowLeftRight, 
  Calendar, 
  Repeat, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X,
  FolderOpen,
  Target
} from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import Button from '@/components/ui/Button'

const navigation = [
  { name: 'Дашборд', href: '/dashboard', icon: Home },
  { 
    name: 'Справочники', 
    icon: FolderOpen,
    children: [
      { name: 'Кошельки', href: '/dashboard/wallets', icon: Wallet },
      { name: 'Статьи движения', href: '/dashboard/cash-flow-items', icon: Target },
      { name: 'Проекты', href: '/dashboard/projects', icon: FolderOpen },
    ]
  },
  {
    name: 'Операции',
    icon: ArrowLeftRight,
    children: [
      { name: 'Приходы', href: '/dashboard/receipts', icon: TrendingUp },
      { name: 'Расходы', href: '/dashboard/expenditures', icon: TrendingDown },
      { name: 'Переводы', href: '/dashboard/transfers', icon: ArrowLeftRight },
    ]
  },
  {
    name: 'Планирование',
    icon: Calendar,
    children: [
      { name: 'Бюджеты', href: '/dashboard/budgets', icon: Calendar },
      { name: 'Автоплатежи', href: '/dashboard/auto-payments', icon: Repeat },
    ]
  },
  { name: 'Аналитика', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Настройки', href: '/dashboard/settings', icon: Settings },
]

interface SidebarProps {
  className?: string
}

export default function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const { logout, user } = useAuthStore()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>(['Операции'])

  const toggleExpanded = (name: string) => {
    setExpandedItems(prev => 
      prev.includes(name) 
        ? prev.filter(item => item !== name)
        : [...prev, name]
    )
  }

  const handleLogout = async () => {
    await logout()
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <span className="ml-3 text-lg font-semibold text-gray-900">
            DjangoLK
          </span>
        </div>
        <button
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden p-1 rounded-md hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* User Info */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-primary-700 font-medium">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">
              {user?.full_name || user?.username}
            </p>
            <p className="text-xs text-gray-500">
              {user?.status === 'COMP' ? 'Компания' : 'Частное лицо'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          if (item.children) {
            const isExpanded = expandedItems.includes(item.name)
            return (
              <div key={item.name}>
                <button
                  onClick={() => toggleExpanded(item.name)}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="flex items-center">
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </div>
                  <div className={clsx(
                    'transition-transform duration-200',
                    isExpanded ? 'rotate-90' : ''
                  )}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
                {isExpanded && (
                  <div className="ml-6 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={clsx(
                          'flex items-center px-3 py-2 text-sm rounded-lg transition-colors duration-200',
                          pathname === child.href
                            ? 'bg-primary-100 text-primary-700 font-medium'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        )}
                        onClick={() => setIsMobileOpen(false)}
                      >
                        <child.icon className="w-4 h-4 mr-3" />
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200',
                pathname === item.href
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
              onClick={() => setIsMobileOpen(false)}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <Button
          variant="ghost"
          fullWidth
          onClick={handleLogout}
          className="justify-start"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Выйти
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-gray-200"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile sidebar */}
      <div className={clsx(
        'lg:hidden fixed inset-0 z-40 transition-opacity duration-300',
        isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}>
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileOpen(false)} />
        <div className={clsx(
          'absolute left-0 top-0 h-full w-80 bg-white shadow-xl transition-transform duration-300',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}>
          <SidebarContent />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className={clsx(
        'hidden lg:flex lg:flex-col lg:w-80 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200',
        className
      )}>
        <SidebarContent />
      </div>
    </>
  )
}